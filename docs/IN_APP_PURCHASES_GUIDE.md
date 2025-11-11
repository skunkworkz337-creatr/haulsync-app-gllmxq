
# In-App Purchases Implementation Guide

This guide explains how the in-app purchase system is implemented in the Hauler app, allowing Apple App Store and Google Play Store to process payments for subscription tiers.

## Overview

The app implements a subscription-based model with three tiers:
- **Free**: Limited features, no payment required
- **Pro**: $5/month or $50/year - Enhanced features
- **Premier**: $15/month or $150/year - Full feature access

## Architecture

### 1. Database Schema

The following tables are created in Supabase:

- **users**: Base user information
- **haulers**: Hauler-specific data including subscription tier
- **customers**: Customer-specific data
- **subscriptions**: Active subscription records
- **purchase_history**: Audit trail of all purchases

All tables have Row Level Security (RLS) enabled to ensure users can only access their own data.

### 2. Services

#### PurchaseService (`services/purchaseService.ts`)
Handles all in-app purchase operations:
- Initializes connection to App Store/Play Store
- Loads available products
- Processes purchases
- Handles purchase updates
- Restores previous purchases

#### FeatureAccessService (`services/featureAccessService.ts`)
Manages feature access based on subscription tiers:
- Checks if users can access specific features
- Validates service area limits
- Validates job request limits
- Provides upgrade suggestions

### 3. Hooks

#### usePurchases (`hooks/usePurchases.ts`)
React hook for purchase operations:
- Loads products from stores
- Initiates purchases
- Restores purchases
- Provides loading and error states

#### useFeatureAccess (`hooks/useFeatureAccess.ts`)
React hook for feature access control:
- Gets current user tier
- Checks feature availability
- Validates usage limits

### 4. Components

#### FeatureGate (`components/FeatureGate.tsx`)
Wrapper component that shows/hides features based on subscription:
- Displays upgrade prompts for locked features
- Redirects to subscription screen

## Product IDs

Configure these product IDs in App Store Connect and Google Play Console:

### iOS (App Store Connect)
- `com.haulerapp.pro.monthly`
- `com.haulerapp.pro.annual`
- `com.haulerapp.premier.monthly`
- `com.haulerapp.premier.annual`

### Android (Google Play Console)
- `com.haulerapp.pro.monthly`
- `com.haulerapp.pro.annual`
- `com.haulerapp.premier.monthly`
- `com.haulerapp.premier.annual`

## Backend Verification

The `verify-purchase` Edge Function verifies purchases with Apple/Google:

### Apple Verification
1. Receives receipt data from client
2. Sends to Apple's verification endpoint
3. Validates transaction ID
4. Updates subscription in database

### Google Verification
1. Receives purchase token from client
2. Uses Google Play Developer API
3. Validates payment state
4. Updates subscription in database

### Environment Variables Required

Set these in Supabase Edge Functions:
- `APPLE_SHARED_SECRET`: Your App Store shared secret
- `GOOGLE_SERVICE_ACCOUNT_KEY`: Google service account JSON
- `ANDROID_PACKAGE_NAME`: Your Android package name

## Feature Access Control

### Tier Features

**Free Tier:**
- 1 service area
- 5 job requests/month
- Basic features only

**Pro Tier:**
- 5 service areas
- 50 job requests/month
- Ad-free experience
- Priority job assignment

**Premier Tier:**
- Unlimited service areas
- Unlimited job requests
- All Pro features
- Advanced analytics
- Premium support
- Dedicated account manager

### Usage Example

```typescript
import { useFeatureAccess } from '@/hooks/useFeatureAccess';

function MyComponent() {
  const { canAccessFeature, canAddServiceArea } = useFeatureAccess();
  
  // Check if user can access a feature
  const { canAccessFeature: hasAnalytics } = canAccessFeature('hasAdvancedAnalytics');
  
  // Check if user can add more service areas
  const { canAccessFeature: canAdd } = canAddServiceArea(currentAreas.length);
  
  if (!canAdd) {
    // Show upgrade prompt
  }
}
```

### Using FeatureGate Component

```typescript
import { FeatureGate } from '@/components/FeatureGate';

function AnalyticsScreen() {
  const { canAccessFeature } = useFeatureAccess();
  const access = canAccessFeature('hasAdvancedAnalytics');
  
  return (
    <FeatureGate
      hasAccess={access.canAccessFeature}
      reason={access.reason}
      requiredTier="premier"
    >
      {/* Analytics content only shown to Premier users */}
      <AnalyticsContent />
    </FeatureGate>
  );
}
```

## Testing

### Sandbox Testing

#### iOS
1. Create sandbox test accounts in App Store Connect
2. Sign out of App Store on device
3. Use sandbox account when prompted during purchase
4. Test purchases without real charges

#### Android
1. Add test accounts in Google Play Console
2. Create test tracks (internal/closed testing)
3. Test purchases with test accounts
4. Purchases are not charged

### Production Checklist

- [ ] Configure products in App Store Connect
- [ ] Configure products in Google Play Console
- [ ] Set up App Store shared secret
- [ ] Set up Google service account
- [ ] Deploy verify-purchase Edge Function
- [ ] Test sandbox purchases on iOS
- [ ] Test sandbox purchases on Android
- [ ] Test subscription restoration
- [ ] Test subscription expiration
- [ ] Test upgrade/downgrade flows

## Subscription Management

Users can manage subscriptions through:

### iOS
Settings → Apple ID → Subscriptions

### Android
Google Play Store → Menu → Subscriptions

The app provides a "Manage Subscription" button that:
- On iOS: Opens App Store subscription settings
- On Android: Opens Google Play subscription settings

## Security Considerations

1. **Always verify purchases server-side**: Never trust client-side purchase data
2. **Use RLS policies**: Ensure users can only access their own data
3. **Store receipts securely**: Keep purchase receipts for audit trail
4. **Handle expired subscriptions**: Check expiration dates before granting access
5. **Implement retry logic**: Handle network failures gracefully

## Troubleshooting

### Purchase not completing
- Check network connection
- Verify product IDs match store configuration
- Check sandbox account status
- Review console logs for errors

### Features not unlocking
- Verify subscription record in database
- Check subscription expiration date
- Ensure RLS policies are correct
- Verify user authentication

### Restore not working
- Ensure user is signed in to same store account
- Check purchase history in store
- Verify receipt validation logic
- Review Edge Function logs

## Support

For issues with:
- **App Store**: Contact Apple Developer Support
- **Google Play**: Contact Google Play Developer Support
- **Supabase**: Check Supabase documentation or support
- **App Issues**: Check application logs and Edge Function logs
