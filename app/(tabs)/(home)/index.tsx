
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Platform } from 'react-native';
import { router, Redirect } from 'expo-router';
import { colors, commonStyles } from '@/styles/commonStyles';
import { useAuth } from '@/contexts/AuthContext';
import { IconSymbol } from '@/components/IconSymbol';
import { Hauler } from '@/types/user';

export default function HomeScreen() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={[commonStyles.container, styles.centered]}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/welcome" />;
  }

  const isHauler = user?.role === 'hauler';
  const hauler = isHauler ? (user as Hauler) : null;

  return (
    <View style={commonStyles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          Platform.OS !== 'ios' && styles.scrollContentWithTabBar,
        ]}
      >
        <View style={styles.header}>
          <Text style={styles.greeting}>
            Welcome back, {user?.firstName}! 👋
          </Text>
          <Text style={styles.subGreeting}>
            {isHauler ? 'Ready to take on new jobs?' : 'Need something hauled?'}
          </Text>
        </View>

        {isHauler && hauler && (
          <View style={[commonStyles.card, styles.statusCard]}>
            <View style={styles.statusHeader}>
              <Text style={styles.statusTitle}>Account Status</Text>
              <View
                style={[
                  styles.statusBadge,
                  hauler.status === 'active' && styles.statusBadgeActive,
                ]}
              >
                <Text
                  style={[
                    styles.statusBadgeText,
                    hauler.status === 'active' && styles.statusBadgeTextActive,
                  ]}
                >
                  {hauler.status.replace(/_/g, ' ').toUpperCase()}
                </Text>
              </View>
            </View>

            {hauler.status === 'pending_background_check' && (
              <View style={styles.actionContainer}>
                <Text style={styles.actionText}>
                  Complete your background check to start accepting jobs
                </Text>
                <Pressable
                  style={styles.actionButton}
                  onPress={() => router.push('/hauler/background-check')}
                >
                  <Text style={styles.actionButtonText}>Start Background Check</Text>
                  <IconSymbol name="chevron.right" size={20} color={colors.primary} />
                </Pressable>
              </View>
            )}

            {hauler.status === 'background_check_approved' && (
              <View style={styles.actionContainer}>
                <Text style={styles.actionText}>
                  Upload required documents to continue
                </Text>
                <Pressable
                  style={styles.actionButton}
                  onPress={() => router.push('/hauler/documents')}
                >
                  <Text style={styles.actionButtonText}>Upload Documents</Text>
                  <IconSymbol name="chevron.right" size={20} color={colors.primary} />
                </Pressable>
              </View>
            )}

            {hauler.status === 'documents_submitted' && (
              <View style={styles.actionContainer}>
                <Text style={styles.actionText}>
                  Review onboarding material and complete the quiz
                </Text>
                <Pressable
                  style={styles.actionButton}
                  onPress={() => router.push('/hauler/onboarding-presentation')}
                >
                  <Text style={styles.actionButtonText}>Start Onboarding</Text>
                  <IconSymbol name="chevron.right" size={20} color={colors.primary} />
                </Pressable>
              </View>
            )}

            {hauler.status === 'pending_onboarding' && (
              <View style={styles.actionContainer}>
                <Text style={styles.actionText}>
                  Complete your profile setup to start working
                </Text>
                <Pressable
                  style={styles.actionButton}
                  onPress={() => router.push('/hauler/onboarding')}
                >
                  <Text style={styles.actionButtonText}>Complete Profile</Text>
                  <IconSymbol name="chevron.right" size={20} color={colors.primary} />
                </Pressable>
              </View>
            )}
          </View>
        )}

        {isHauler && hauler?.status === 'active' && (
          <View style={[commonStyles.card, styles.subscriptionCard]}>
            <View style={styles.subscriptionHeader}>
              <Text style={styles.subscriptionTitle}>Current Plan</Text>
              <Text style={styles.subscriptionTier}>
                {hauler.subscriptionTier.toUpperCase()}
              </Text>
            </View>
            <Pressable
              style={styles.upgradeButton}
              onPress={() => router.push('/hauler/subscription')}
            >
              <Text style={styles.upgradeButtonText}>Upgrade Plan</Text>
            </Pressable>
          </View>
        )}

        <View style={commonStyles.card}>
          <Text style={styles.sectionTitle}>
            {isHauler ? 'Available Jobs' : 'Your Jobs'}
          </Text>
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>📋</Text>
            <Text style={styles.emptyStateText}>
              {isHauler ? 'No jobs available right now' : 'You haven&apos;t posted any jobs yet'}
            </Text>
            {!isHauler && (
              <Pressable style={styles.emptyStateButton}>
                <Text style={styles.emptyStateButtonText}>Post a Job</Text>
              </Pressable>
            )}
          </View>
        </View>

        <View style={[commonStyles.card, styles.statsCard]}>
          <Text style={styles.sectionTitle}>Quick Stats</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>
                {isHauler ? 'Jobs Completed' : 'Jobs Posted'}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>
                {isHauler ? 'Earnings' : 'Active Jobs'}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>-</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  scrollContent: {
    padding: 20,
  },
  scrollContentWithTabBar: {
    paddingBottom: 100,
  },
  header: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  subGreeting: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  statusCard: {
    marginBottom: 16,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  statusBadge: {
    backgroundColor: colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusBadgeActive: {
    backgroundColor: colors.secondary,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
  },
  statusBadgeTextActive: {
    color: colors.card,
  },
  actionContainer: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 16,
  },
  actionText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  actionButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.highlight,
    padding: 16,
    borderRadius: 8,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  subscriptionCard: {
    marginBottom: 16,
  },
  subscriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  subscriptionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  subscriptionTier: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  upgradeButton: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  upgradeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.card,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  emptyStateButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.card,
  },
  statsCard: {
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
