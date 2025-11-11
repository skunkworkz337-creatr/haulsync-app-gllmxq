
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PurchaseVerificationRequest {
  platform: 'ios' | 'android';
  productId: string;
  transactionId: string;
  purchaseToken?: string;
  receipt?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    // Get the user
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    // Parse request body
    const body: PurchaseVerificationRequest = await req.json();
    const { platform, productId, transactionId, purchaseToken, receipt } = body;

    console.log('Verifying purchase:', { platform, productId, transactionId });

    // Verify the purchase with the respective store
    let isValid = false;
    let expiresAt: Date | null = null;

    if (platform === 'ios') {
      // Verify with Apple App Store
      isValid = await verifyApplePurchase(receipt!, transactionId);
      // For subscriptions, calculate expiration (typically 1 month or 1 year)
      expiresAt = calculateExpirationDate(productId);
    } else if (platform === 'android') {
      // Verify with Google Play Store
      isValid = await verifyGooglePurchase(productId, purchaseToken!);
      expiresAt = calculateExpirationDate(productId);
    }

    if (!isValid) {
      throw new Error('Invalid purchase');
    }

    // Parse tier and billing period from product ID
    const { tier, billingPeriod } = parseProductId(productId);

    // Create subscription record
    const { data: subscription, error: subscriptionError } = await supabaseClient
      .from('subscriptions')
      .insert({
        user_id: user.id,
        tier,
        billing_period: billingPeriod,
        status: 'active',
        platform,
        product_id: productId,
        transaction_id: transactionId,
        original_transaction_id: transactionId,
        purchase_token: purchaseToken,
        receipt_data: receipt,
        starts_at: new Date().toISOString(),
        expires_at: expiresAt?.toISOString(),
      })
      .select()
      .single();

    if (subscriptionError) {
      console.error('Error creating subscription:', subscriptionError);
      throw subscriptionError;
    }

    // Create purchase history record
    await supabaseClient.from('purchase_history').insert({
      user_id: user.id,
      subscription_id: subscription.id,
      platform,
      product_id: productId,
      transaction_id: transactionId,
      purchase_token: purchaseToken,
      receipt_data: receipt,
      status: 'completed',
      verified_at: new Date().toISOString(),
    });

    // Update hauler subscription tier
    const { error: updateError } = await supabaseClient
      .from('haulers')
      .update({
        subscription_tier: tier,
        subscription_status: 'active',
        subscription_expires_at: expiresAt?.toISOString(),
      })
      .eq('id', user.id);

    if (updateError) {
      console.error('Error updating hauler:', updateError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        subscription,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error verifying purchase:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});

async function verifyApplePurchase(receipt: string, transactionId: string): Promise<boolean> {
  try {
    // In production, use: https://buy.itunes.apple.com/verifyReceipt
    // In sandbox, use: https://sandbox.itunes.apple.com/verifyReceipt
    const verifyUrl = 'https://sandbox.itunes.apple.com/verifyReceipt';
    
    const response = await fetch(verifyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'receipt-data': receipt,
        password: Deno.env.get('APPLE_SHARED_SECRET'),
      }),
    });

    const data = await response.json();
    console.log('Apple verification response:', data);

    // Check if the receipt is valid
    if (data.status === 0) {
      // Find the transaction in the receipt
      const transaction = data.receipt?.in_app?.find(
        (item: any) => item.transaction_id === transactionId
      );
      return !!transaction;
    }

    return false;
  } catch (error) {
    console.error('Error verifying Apple purchase:', error);
    return false;
  }
}

async function verifyGooglePurchase(productId: string, purchaseToken: string): Promise<boolean> {
  try {
    // Use Google Play Developer API to verify the purchase
    // You'll need to set up OAuth2 credentials and get an access token
    const packageName = Deno.env.get('ANDROID_PACKAGE_NAME');
    const accessToken = await getGoogleAccessToken();

    const verifyUrl = `https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${packageName}/purchases/subscriptions/${productId}/tokens/${purchaseToken}`;

    const response = await fetch(verifyUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();
    console.log('Google verification response:', data);

    // Check if the subscription is valid
    return data.paymentState === 1; // 1 = Payment received
  } catch (error) {
    console.error('Error verifying Google purchase:', error);
    return false;
  }
}

async function getGoogleAccessToken(): Promise<string> {
  // Implement OAuth2 flow to get access token
  // This is a simplified version - in production, use proper OAuth2 flow
  const serviceAccountKey = JSON.parse(Deno.env.get('GOOGLE_SERVICE_ACCOUNT_KEY') || '{}');
  
  // Use JWT to get access token
  // Implementation details omitted for brevity
  return 'access_token';
}

function parseProductId(productId: string): { tier: string; billingPeriod: string } {
  if (productId.includes('pro')) {
    return {
      tier: 'pro',
      billingPeriod: productId.includes('annual') ? 'annual' : 'monthly',
    };
  } else if (productId.includes('premier')) {
    return {
      tier: 'premier',
      billingPeriod: productId.includes('annual') ? 'annual' : 'monthly',
    };
  }
  return { tier: 'free', billingPeriod: 'monthly' };
}

function calculateExpirationDate(productId: string): Date {
  const expiresAt = new Date();
  if (productId.includes('annual')) {
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);
  } else {
    expiresAt.setMonth(expiresAt.getMonth() + 1);
  }
  return expiresAt;
}
