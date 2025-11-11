
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, buttonStyles, commonStyles } from '@/styles/commonStyles';
import { useAuth } from '@/contexts/AuthContext';
import { IconSymbol } from '@/components/IconSymbol';
import { subscriptionTiers } from '@/data/subscriptionTiers';
import { SubscriptionTier } from '@/types/user';
import { usePurchases } from '@/hooks/usePurchases';
import { PRODUCT_IDS } from '@/services/purchaseService';

export default function SubscriptionScreen() {
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier>('free');
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');
  const [loading, setLoading] = useState(false);
  const { updateUser } = useAuth();
  const { products, loading: productsLoading, purchaseProduct, restorePurchases, getProductPrice } = usePurchases();

  const handleSubscribe = async () => {
    if (selectedTier === 'free') {
      // Free tier - just update user
      try {
        await updateUser({
          subscriptionTier: 'free',
          subscriptionExpiresAt: undefined,
        });
        Alert.alert(
          'Free Plan Selected',
          'You are now on the Free plan.',
          [{ text: 'OK', onPress: () => router.back() }]
        );
      } catch (error) {
        console.log('Error updating to free tier:', error);
        Alert.alert('Error', 'Failed to update subscription. Please try again.');
      }
      return;
    }

    // Paid tier - initiate in-app purchase
    setLoading(true);
    try {
      // Get the product ID based on tier and billing period
      let productId = '';
      if (selectedTier === 'pro') {
        productId = billingPeriod === 'monthly' ? PRODUCT_IDS.pro_monthly : PRODUCT_IDS.pro_annual;
      } else if (selectedTier === 'premier') {
        productId = billingPeriod === 'monthly' ? PRODUCT_IDS.premier_monthly : PRODUCT_IDS.premier_annual;
      }

      console.log('Initiating purchase for:', productId);
      const success = await purchaseProduct(productId);

      if (success) {
        // Calculate expiration date
        const expiresAt = new Date();
        expiresAt.setMonth(expiresAt.getMonth() + (billingPeriod === 'annual' ? 12 : 1));

        // Update user subscription
        await updateUser({
          subscriptionTier: selectedTier,
          subscriptionExpiresAt: expiresAt,
        });

        Alert.alert(
          'Subscription Active',
          `You are now subscribed to the ${selectedTier.toUpperCase()} plan!`,
          [{ text: 'OK', onPress: () => router.back() }]
        );
      }
    } catch (error) {
      console.log('Error subscribing:', error);
      Alert.alert('Error', 'Failed to process subscription. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRestorePurchases = async () => {
    Alert.alert(
      'Restore Purchases',
      'This will restore any previous purchases made with this Apple ID or Google account.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Restore',
          onPress: async () => {
            try {
              await restorePurchases();
            } catch (error) {
              console.log('Error restoring purchases:', error);
            }
          },
        },
      ]
    );
  };

  const selectedTierInfo = subscriptionTiers.find(t => t.id === selectedTier);
  
  // Get price from products if available, otherwise use default
  const displayPrice = selectedTier !== 'free' 
    ? getProductPrice(selectedTier, billingPeriod) || 
      (billingPeriod === 'monthly' 
        ? `$${selectedTierInfo?.monthlyPrice}` 
        : `$${selectedTierInfo?.annualPrice}`)
    : 'Free';

  return (
    <SafeAreaView style={commonStyles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={commonStyles.title}>Choose Your Plan</Text>
          <Text style={commonStyles.subtitle}>
            Select the subscription that fits your needs
          </Text>
        </View>

        {productsLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Loading subscription options...</Text>
          </View>
        )}

        <View style={styles.billingToggle}>
          <Pressable
            style={[
              styles.billingOption,
              billingPeriod === 'monthly' && styles.billingOptionActive,
            ]}
            onPress={() => setBillingPeriod('monthly')}
          >
            <Text
              style={[
                styles.billingOptionText,
                billingPeriod === 'monthly' && styles.billingOptionTextActive,
              ]}
            >
              Monthly
            </Text>
          </Pressable>
          <Pressable
            style={[
              styles.billingOption,
              billingPeriod === 'annual' && styles.billingOptionActive,
            ]}
            onPress={() => setBillingPeriod('annual')}
          >
            <Text
              style={[
                styles.billingOptionText,
                billingPeriod === 'annual' && styles.billingOptionTextActive,
              ]}
            >
              Annual
            </Text>
            <View style={styles.savingsBadge}>
              <Text style={styles.savingsText}>Save 17%</Text>
            </View>
          </Pressable>
        </View>

        {subscriptionTiers.map(tier => {
          const isSelected = selectedTier === tier.id;
          const tierPrice = tier.id !== 'free'
            ? getProductPrice(tier.id, billingPeriod) ||
              (billingPeriod === 'monthly' ? `$${tier.monthlyPrice}` : `$${tier.annualPrice}`)
            : 'Free';
          
          return (
            <Pressable
              key={tier.id}
              style={[
                commonStyles.card,
                styles.tierCard,
                isSelected && styles.tierCardSelected,
              ]}
              onPress={() => setSelectedTier(tier.id)}
            >
              <View style={styles.tierHeader}>
                <View>
                  <Text style={styles.tierName}>{tier.name}</Text>
                  <Text style={styles.tierPrice}>
                    {tierPrice}
                    {tier.id !== 'free' && (
                      <Text style={styles.tierPeriod}>
                        /{billingPeriod === 'monthly' ? 'mo' : 'yr'}
                      </Text>
                    )}
                  </Text>
                </View>
                {isSelected && (
                  <View style={styles.selectedBadge}>
                    <IconSymbol name="checkmark.circle.fill" size={28} color={colors.secondary} />
                  </View>
                )}
              </View>

              <Text style={styles.tierCoverage}>{tier.serviceAreasAllowed}</Text>

              <View style={styles.divider} />

              <View style={styles.featuresList}>
                {tier.features.map((feature, index) => (
                  <View key={index} style={styles.featureItem}>
                    <IconSymbol name="checkmark" size={16} color={colors.secondary} />
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>
            </Pressable>
          );
        })}

        <View style={[commonStyles.card, styles.infoCard]}>
          <IconSymbol name="info.circle.fill" size={24} color={colors.primary} />
          <View style={styles.infoContent}>
            <Text style={styles.infoText}>
              Subscriptions are processed through {Platform.OS === 'ios' ? 'Apple App Store' : 'Google Play Store'}. 
              You can manage your subscription in your {Platform.OS === 'ios' ? 'Apple ID' : 'Google Play'} settings. 
              Changes will take effect at the start of your next billing cycle.
            </Text>
          </View>
        </View>

        <Pressable
          style={[buttonStyles.primary, styles.subscribeButton]}
          onPress={handleSubscribe}
          disabled={loading || productsLoading}
        >
          {loading ? (
            <ActivityIndicator color={colors.card} />
          ) : (
            <Text style={buttonStyles.text}>
              {selectedTier === 'free' 
                ? 'Continue with Free' 
                : `Subscribe - ${displayPrice}/${billingPeriod === 'monthly' ? 'mo' : 'yr'}`}
            </Text>
          )}
        </Pressable>

        <Pressable
          style={[buttonStyles.secondary, styles.restoreButton]}
          onPress={handleRestorePurchases}
          disabled={loading || productsLoading}
        >
          <Text style={[buttonStyles.text, { color: colors.primary }]}>
            Restore Purchases
          </Text>
        </Pressable>

        <Text style={styles.disclaimer}>
          By subscribing, you agree to our Terms of Service and Privacy Policy. 
          Subscriptions automatically renew unless cancelled at least 24 hours before the end of the current period.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: colors.textSecondary,
  },
  billingToggle: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 4,
    marginBottom: 24,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  billingOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
    position: 'relative',
  },
  billingOptionActive: {
    backgroundColor: colors.primary,
  },
  billingOptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  billingOptionTextActive: {
    color: colors.card,
  },
  savingsBadge: {
    position: 'absolute',
    top: -8,
    right: 8,
    backgroundColor: colors.accent,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  savingsText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.text,
  },
  tierCard: {
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  tierCardSelected: {
    borderColor: colors.primary,
  },
  tierHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  tierName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  tierPrice: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.primary,
  },
  tierPeriod: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  selectedBadge: {
    marginTop: 4,
  },
  tierCoverage: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: 16,
  },
  featuresList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    fontSize: 14,
    color: colors.text,
    flex: 1,
  },
  infoCard: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: colors.highlight,
    marginBottom: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  subscribeButton: {
    marginBottom: 12,
  },
  restoreButton: {
    marginBottom: 16,
  },
  disclaimer: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 20,
  },
});
