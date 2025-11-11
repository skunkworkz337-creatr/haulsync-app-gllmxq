
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, buttonStyles, commonStyles } from '@/styles/commonStyles';
import { useAuth } from '@/contexts/AuthContext';
import { IconSymbol } from '@/components/IconSymbol';
import { subscriptionTiers } from '@/data/subscriptionTiers';
import { SubscriptionTier } from '@/types/user';

export default function SubscriptionScreen() {
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier>('free');
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');
  const [loading, setLoading] = useState(false);
  const { updateUser } = useAuth();

  const handleSubscribe = async () => {
    if (selectedTier === 'free') {
      router.back();
      return;
    }

    setLoading(true);
    try {
      // In a real app, process payment via Stripe or similar
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + (billingPeriod === 'annual' ? 12 : 1));
      
      await updateUser({
        subscriptionTier: selectedTier,
        subscriptionExpiresAt: expiresAt,
      });
      
      Alert.alert(
        'Subscription Active',
        `You&apos;re now subscribed to the ${selectedTier.toUpperCase()} plan!`,
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      console.log('Error subscribing:', error);
      Alert.alert('Error', 'Failed to process subscription. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const selectedTierInfo = subscriptionTiers.find(t => t.id === selectedTier);
  const price = billingPeriod === 'monthly' 
    ? selectedTierInfo?.monthlyPrice 
    : selectedTierInfo?.annualPrice;

  return (
    <SafeAreaView style={commonStyles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={commonStyles.title}>Choose Your Plan</Text>
          <Text style={commonStyles.subtitle}>
            Select the subscription that fits your needs
          </Text>
        </View>

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
          const tierPrice = billingPeriod === 'monthly' ? tier.monthlyPrice : tier.annualPrice;
          
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
                    {tierPrice === 0 ? 'Free' : `$${tierPrice}`}
                    {tierPrice > 0 && (
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
              You can upgrade, downgrade, or cancel your subscription at any time. Changes will take effect at the start of your next billing cycle.
            </Text>
          </View>
        </View>

        <Pressable
          style={[buttonStyles.primary, styles.subscribeButton]}
          onPress={handleSubscribe}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.card} />
          ) : (
            <Text style={buttonStyles.text}>
              {selectedTier === 'free' 
                ? 'Continue with Free' 
                : `Subscribe for $${price}/${billingPeriod === 'monthly' ? 'mo' : 'yr'}`}
            </Text>
          )}
        </Pressable>
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
    marginBottom: 20,
  },
});
