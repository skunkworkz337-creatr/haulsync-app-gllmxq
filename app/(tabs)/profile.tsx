
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { useAuth } from '@/contexts/AuthContext';
import { IconSymbol } from '@/components/IconSymbol';
import { Hauler } from '@/types/user';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  if (!user) {
    return null;
  }

  const isHauler = user.role === 'hauler';
  const hauler = isHauler ? (user as Hauler) : null;

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

  return (
    <SafeAreaView style={commonStyles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          Platform.OS !== 'ios' && styles.scrollContentWithTabBar,
        ]}
      >
        <View style={[commonStyles.card, styles.profileHeader]}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user.firstName[0]}
              {user.lastName[0]}
            </Text>
          </View>
          <Text style={styles.name}>
            {user.firstName} {user.lastName}
          </Text>
          <Text style={styles.email}>{user.email}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleBadgeText}>
              {user.role === 'hauler' ? '🚚 Hauler' : '📦 Customer'}
            </Text>
          </View>
        </View>

        {isHauler && hauler && (
          <View style={commonStyles.card}>
            <Text style={styles.sectionTitle}>Hauler Information</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Status:</Text>
              <Text style={styles.infoValue}>
                {hauler.status.replace(/_/g, ' ')}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Subscription:</Text>
              <Text style={[styles.infoValue, { color: colors.primary }]}>
                {hauler.subscriptionTier.toUpperCase()}
              </Text>
            </View>
            {hauler.businessName && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Business:</Text>
                <Text style={styles.infoValue}>{hauler.businessName}</Text>
              </View>
            )}
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

        <View style={commonStyles.card}>
          <Text style={styles.sectionTitle}>Account Settings</Text>
          
          <Pressable style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <IconSymbol name="person.fill" size={20} color={colors.textSecondary} />
              <Text style={styles.menuItemText}>Edit Profile</Text>
            </View>
            <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
          </Pressable>

          {isHauler && (
            <Pressable
              style={styles.menuItem}
              onPress={() => router.push('/hauler/subscription')}
            >
              <View style={styles.menuItemLeft}>
                <IconSymbol name="creditcard.fill" size={20} color={colors.textSecondary} />
                <Text style={styles.menuItemText}>Subscription</Text>
              </View>
              <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
            </Pressable>
          )}

          <Pressable style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <IconSymbol name="bell.fill" size={20} color={colors.textSecondary} />
              <Text style={styles.menuItemText}>Notifications</Text>
            </View>
            <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
          </Pressable>

          <Pressable style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <IconSymbol name="lock.fill" size={20} color={colors.textSecondary} />
              <Text style={styles.menuItemText}>Privacy & Security</Text>
            </View>
            <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
          </Pressable>
        </View>

        <View style={commonStyles.card}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <Pressable style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <IconSymbol name="questionmark.circle.fill" size={20} color={colors.textSecondary} />
              <Text style={styles.menuItemText}>Help Center</Text>
            </View>
            <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
          </Pressable>

          <Pressable style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <IconSymbol name="doc.text.fill" size={20} color={colors.textSecondary} />
              <Text style={styles.menuItemText}>Terms of Service</Text>
            </View>
            <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
          </Pressable>

          <Pressable style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <IconSymbol name="shield.fill" size={20} color={colors.textSecondary} />
              <Text style={styles.menuItemText}>Privacy Policy</Text>
            </View>
            <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
          </Pressable>
        </View>

        <Pressable
          style={[buttonStyles.outline, styles.logoutButton]}
          onPress={handleLogout}
        >
          <Text style={[buttonStyles.outlineText, { color: colors.error }]}>
            Logout
          </Text>
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
  scrollContentWithTabBar: {
    paddingBottom: 100,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.card,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  roleBadge: {
    backgroundColor: colors.highlight,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  roleBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    textTransform: 'capitalize',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuItemText: {
    fontSize: 16,
    color: colors.text,
  },
  logoutButton: {
    marginTop: 8,
    marginBottom: 16,
    borderColor: colors.error,
  },
  version: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
});
