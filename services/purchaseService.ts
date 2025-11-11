
import * as InAppPurchases from 'expo-in-app-purchases';
import { Platform, Alert } from 'react-native';
import { SubscriptionTier } from '@/types/user';

// Product IDs for App Store and Google Play
// These should match the product IDs configured in App Store Connect and Google Play Console
export const PRODUCT_IDS = {
  pro_monthly: Platform.select({
    ios: 'com.haulerapp.pro.monthly',
    android: 'com.haulerapp.pro.monthly',
    default: 'pro_monthly',
  }),
  pro_annual: Platform.select({
    ios: 'com.haulerapp.pro.annual',
    android: 'com.haulerapp.pro.annual',
    default: 'pro_annual',
  }),
  premier_monthly: Platform.select({
    ios: 'com.haulerapp.premier.monthly',
    android: 'com.haulerapp.premier.monthly',
    default: 'premier_monthly',
  }),
  premier_annual: Platform.select({
    ios: 'com.haulerapp.premier.annual',
    android: 'com.haulerapp.premier.annual',
    default: 'premier_annual',
  }),
};

export interface PurchaseProduct {
  productId: string;
  tier: SubscriptionTier;
  billingPeriod: 'monthly' | 'annual';
  price: string;
  localizedPrice: string;
  currency: string;
}

class PurchaseService {
  private isInitialized = false;
  private products: InAppPurchases.IAPItemDetails[] = [];

  async initialize(): Promise<void> {
    try {
      if (this.isInitialized) {
        console.log('Purchase service already initialized');
        return;
      }

      console.log('Initializing purchase service...');
      await InAppPurchases.connectAsync();
      this.isInitialized = true;
      console.log('Purchase service initialized successfully');

      // Load products
      await this.loadProducts();

      // Set up purchase listener
      InAppPurchases.setPurchaseListener(this.handlePurchaseUpdate.bind(this));
    } catch (error) {
      console.log('Error initializing purchase service:', error);
      throw error;
    }
  }

  async loadProducts(): Promise<PurchaseProduct[]> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      const productIds = Object.values(PRODUCT_IDS);
      console.log('Loading products:', productIds);

      const { results, responseCode } = await InAppPurchases.getProductsAsync(productIds);

      if (responseCode === InAppPurchases.IAPResponseCode.OK) {
        this.products = results || [];
        console.log('Products loaded:', this.products.length);
        return this.mapProducts(this.products);
      } else {
        console.log('Failed to load products, response code:', responseCode);
        return [];
      }
    } catch (error) {
      console.log('Error loading products:', error);
      return [];
    }
  }

  private mapProducts(products: InAppPurchases.IAPItemDetails[]): PurchaseProduct[] {
    return products.map(product => {
      const { tier, billingPeriod } = this.parseProductId(product.productId);
      return {
        productId: product.productId,
        tier,
        billingPeriod,
        price: product.price || '0',
        localizedPrice: product.priceString || '$0',
        currency: product.priceCurrencyCode || 'USD',
      };
    });
  }

  private parseProductId(productId: string): { tier: SubscriptionTier; billingPeriod: 'monthly' | 'annual' } {
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

  async purchaseProduct(productId: string): Promise<boolean> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      console.log('Purchasing product:', productId);
      await InAppPurchases.purchaseItemAsync(productId);
      return true;
    } catch (error: any) {
      console.log('Error purchasing product:', error);
      
      if (error.code === 'E_USER_CANCELLED') {
        console.log('User cancelled the purchase');
        return false;
      }
      
      Alert.alert(
        'Purchase Failed',
        'Unable to complete the purchase. Please try again.',
        [{ text: 'OK' }]
      );
      return false;
    }
  }

  private async handlePurchaseUpdate(event: InAppPurchases.InAppPurchase): Promise<void> {
    console.log('Purchase update received:', event);

    const { responseCode, results, errorCode } = event;

    if (responseCode === InAppPurchases.IAPResponseCode.OK) {
      // Purchase successful
      for (const purchase of results || []) {
        console.log('Processing purchase:', purchase);
        
        // Here you would verify the purchase with your backend
        // and update the user's subscription status
        await this.verifyPurchase(purchase);

        // Acknowledge the purchase (required for Android)
        if (Platform.OS === 'android' && !purchase.acknowledged) {
          await InAppPurchases.finishTransactionAsync(purchase, true);
        }
      }
    } else if (responseCode === InAppPurchases.IAPResponseCode.USER_CANCELED) {
      console.log('User cancelled the purchase');
    } else {
      console.log('Purchase failed with error code:', errorCode);
      Alert.alert(
        'Purchase Error',
        'There was an error processing your purchase. Please try again.',
        [{ text: 'OK' }]
      );
    }
  }

  private async verifyPurchase(purchase: InAppPurchases.InAppPurchase): Promise<void> {
    try {
      console.log('Verifying purchase:', purchase.orderId);
      
      // In a production app, you would send the receipt to your backend
      // for verification with Apple/Google servers
      // For now, we'll just log it
      
      const receiptData = {
        platform: Platform.OS,
        productId: purchase.productId,
        transactionId: purchase.orderId,
        purchaseToken: Platform.OS === 'android' ? purchase.purchaseToken : undefined,
        receipt: Platform.OS === 'ios' ? purchase.transactionReceipt : undefined,
      };

      console.log('Receipt data:', receiptData);
      
      // TODO: Send to backend for verification
      // await fetch('YOUR_BACKEND_URL/verify-purchase', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(receiptData),
      // });
    } catch (error) {
      console.log('Error verifying purchase:', error);
    }
  }

  async restorePurchases(): Promise<void> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      console.log('Restoring purchases...');
      const { results, responseCode } = await InAppPurchases.getPurchaseHistoryAsync();

      if (responseCode === InAppPurchases.IAPResponseCode.OK) {
        console.log('Purchases restored:', results?.length || 0);
        
        // Process restored purchases
        for (const purchase of results || []) {
          await this.verifyPurchase(purchase);
        }

        Alert.alert(
          'Purchases Restored',
          `Successfully restored ${results?.length || 0} purchase(s).`,
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          'Restore Failed',
          'Unable to restore purchases. Please try again.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.log('Error restoring purchases:', error);
      Alert.alert(
        'Restore Error',
        'There was an error restoring your purchases.',
        [{ text: 'OK' }]
      );
    }
  }

  async disconnect(): Promise<void> {
    try {
      if (this.isInitialized) {
        await InAppPurchases.disconnectAsync();
        this.isInitialized = false;
        console.log('Purchase service disconnected');
      }
    } catch (error) {
      console.log('Error disconnecting purchase service:', error);
    }
  }

  getProductPrice(tier: SubscriptionTier, billingPeriod: 'monthly' | 'annual'): string {
    const product = this.products.find(p => {
      const parsed = this.parseProductId(p.productId);
      return parsed.tier === tier && parsed.billingPeriod === billingPeriod;
    });

    return product?.priceString || '$0';
  }
}

export const purchaseService = new PurchaseService();
