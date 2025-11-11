
import React from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { router } from 'expo-router';
import { IconSymbol } from './IconSymbol';
import { colors, buttonStyles } from '@/styles/commonStyles';
import { SubscriptionTier } from '@/types/user';

interface FeatureGateProps {
  hasAccess: boolean;
  reason?: string;
  requiredTier?: SubscriptionTier;
  children: React.ReactNode;
  showUpgradePrompt?: boolean;
}

export function FeatureGate({
  hasAccess,
  reason,
  requiredTier,
  children,
  showUpgradePrompt = true,
}: FeatureGateProps) {
  if (hasAccess) {
    return <>{children}</>;
  }

  const handleUpgrade = () => {
    Alert.alert(
      'Upgrade Required',
      reason || `This feature requires the ${requiredTier?.toUpperCase()} plan.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'View Plans',
          onPress: () => router.push('/hauler/subscription'),
        },
      ]
    );
  };

  if (!showUpgradePrompt) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <IconSymbol name="lock.fill" size={48} color={colors.textSecondary} />
        <Text style={styles.title}>Premium Feature</Text>
        <Text style={styles.message}>
          {reason || `This feature requires the ${requiredTier?.toUpperCase()} plan.`}
        </Text>
        <Pressable style={[buttonStyles.primary, styles.upgradeButton]} onPress={handleUpgrade}>
          <IconSymbol name="arrow.up.circle.fill" size={20} color={colors.card} />
          <Text style={[buttonStyles.text, styles.upgradeButtonText]}>Upgrade Now</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
    maxWidth: 300,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  upgradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  upgradeButtonText: {
    marginLeft: 0,
  },
});
