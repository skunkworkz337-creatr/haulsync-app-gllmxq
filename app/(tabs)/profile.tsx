
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { useAuth } from '@/contexts/AuthContext';
import { IconSymbol } from '@/components/IconSymbol';
import { Hauler } from '@/types/user';
import { useFeatureAccess } from '@/hooks/useFeatureAccess';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { userTier, tierFeatures } = useFeatureAccess();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/welcome');
        },
      },
    ]);
  };

  const handleManageSubscription = () => {
    if (user?.role === 'hauler') {
      router.push('/hauler/subscription');
    }
  };

  const formatDate = (date?: Date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const hauler = user?.role === 'hauler' ? (user as Hauler) : null;
  const subscriptionExpires = hauler?.subscriptionExpiresAt;
  const isSubscriptionActive = subscriptionExpires && new Date(subscriptionExpires) > new Date();

  return (
    <SafeAreaView style={commonStyles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <IconSymbol name="person.circle.fill" size={80} color={colors.primary} />
          </View>
          <Text style={styles.name}>
            {user?.firstName} {user?.lastName}
          </Text>
          <Text style={styles.email}>{user?.email}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>{user?.role?.toUpperCase()}</Text>
          </View>
        </View>

        {user?.role === 'hauler' && (
          <>
            <View style={[commonStyles.card, styles.subscriptionCard]}>
              <View style={styles.subscriptionHeader}>
                <IconSymbol name="star.fill" size={24} color={colors.primary} />
                <Text style={styles.subscriptionTitle}>Subscription</Text>
              </View>

              <View style={styles.subscriptionInfo}>
                <View style={styles.tierBadge}>
                  <Text style={styles.tierBadgeText}>{userTier.toUpperCase()}</Text>
                </View>
                
                {isSubscriptionActive && (
                  <View style={styles.subscriptionDetail}>
                    <Text style={styles.subscriptionLabel}>Expires:</Text>
                    <Text style={styles.subscriptionValue}>
                      {formatDate(subscriptionExpires)}
                    </Text>
                  </View>
                )}

                <View style={styles.divider} />

                <Text style={styles.featuresTitle}>Your Benefits:</Text>
                <View style={styles.featuresList}>
                  <View style={styles.featureItem}>
                    <IconSymbol name="checkmark.circle.fill" size={16} color={colors.secondary} />
                    <Text style={styles.featureText}>
                      Service Areas: {tierFeatures.maxServiceAreas === -1 ? 'Unlimited' : tierFeatures.maxServiceAreas}
                    </Text>
                  </View>
                  <View style={styles.featureItem}>
                    <IconSymbol name="checkmark.circle.fill" size={16} color={colors.secondary} />
                    <Text style={styles.featureText}>
                      Job Requests: {tierFeatures.maxJobRequests === -1 ? 'Unlimited' : `${tierFeatures.maxJobRequests}/month`}
                    </Text>
                  </View>
                  {tierFeatures.hasAdFreeExperience && (
                    <View style={styles.featureItem}>
                      <IconSymbol name="checkmark.circle.fill" size={16} color={colors.secondary} />
                      <Text style={styles.featureText}>Ad-free experience</Text>
                    </View>
                  )}
                  {tierFeatures.hasPriorityAssignment && (
                    <View style={styles.featureItem}>
                      <IconSymbol name="checkmark.circle.fill" size={16} color={colors.secondary} />
                      <Text style={styles.featureText}>Priority job assignment</Text>
                    </View>
                  )}
                  {tierFeatures.hasAdvancedAnalytics && (
                    <View style={styles.featureItem}>
                      <IconSymbol name="checkmark.circle.fill" size={16} color={colors.secondary} />
                      <Text style={styles.featureText}>Advanced analytics</Text>
                    </View>
                  )}
                  {tierFeatures.hasPremiumSupport && (
                    <View style={styles.featureItem}>
                      <IconSymbol name="checkmark.circle.fill" size={16} color={colors.secondary} />
                      <Text style={styles.featureText}>Premium support</Text>
                    </View>
                  )}
                </View>
              </View>

              <Pressable
                style={[buttonStyles.primary, styles.manageButton]}
                onPress={handleManageSubscription}
              >
                <Text style={buttonStyles.text}>
                  {userTier === 'free' ? 'Upgrade Plan' : 'Manage Subscription'}
                </Text>
              </Pressable>
            </View>

            {hauler?.businessName && (
              <View style={commonStyles.card}>
                <Text style={styles.sectionTitle}>Business Information</Text>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Business Name:</Text>
                  <Text style={styles.infoValue}>{hauler.businessName}</Text>
                </View>
                {hauler.serviceAreas && hauler.serviceAreas.length > 0 && (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Service Areas:</Text>
                    <Text style={styles.infoValue}>
                      {hauler.serviceAreas.join(', ')}
                    </Text>
                  </View>
                )}
              </View>
            )}
          </>
        )}

        <View style={commonStyles.card}>
          <Text style={styles.sectionTitle}>Account Settings</Text>
          
          <Pressable style={styles.settingItem}>
            <IconSymbol name="person.fill" size={20} color={colors.text} />
            <Text style={styles.settingText}>Edit Profile</Text>
            <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
          </Pressable>

          <Pressable style={styles.settingItem}>
            <IconSymbol name="bell.fill" size={20} color={colors.text} />
            <Text style={styles.settingText}>Notifications</Text>
            <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
          </Pressable>

          <Pressable style={styles.settingItem}>
            <IconSymbol name="lock.fill" size={20} color={colors.text} />
            <Text style={styles.settingText}>Privacy & Security</Text>
            <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
          </Pressable>

          <Pressable style={styles.settingItem}>
            <IconSymbol name="questionmark.circle.fill" size={20} color={colors.text} />
            <Text style={styles.settingText}>Help & Support</Text>
            <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
          </Pressable>
        </View>

        <Pressable
          style={[buttonStyles.secondary, styles.logoutButton]}
          onPress={handleLogout}
        >
          <IconSymbol name="arrow.right.square.fill" size={20} color={colors.error} />
          <Text style={[buttonStyles.text, { color: colors.error }]}>Logout</Text>
        </Pressable>

        <Text style={styles.version}>Version 1.0.0</Text>
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
  avatarContainer: {
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  roleBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.card,
  },
  subscriptionCard: {
    marginBottom: 16,
  },
  subscriptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  subscriptionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  subscriptionInfo: {
    marginBottom: 16,
  },
  tierBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 12,
  },
  tierBadgeText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.card,
  },
  subscriptionDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  subscriptionLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  subscriptionValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 16,
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  featuresList: {
    gap: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureText: {
    fontSize: 14,
    color: colors.text,
  },
  manageButton: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  infoRow: {
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: colors.text,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
    marginBottom: 24,
  },
  version: {
    textAlign: 'center',
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 20,
  },
});
