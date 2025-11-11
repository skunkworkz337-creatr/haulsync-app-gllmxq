
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
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
import { useFeatureAccess } from '@/hooks/useFeatureAccess';

const SERVICE_AREAS = [
  'Downtown',
  'North District',
  'South District',
  'East Side',
  'West Side',
  'Suburbs',
  'Industrial Zone',
  'Harbor Area',
];

export default function OnboardingScreen() {
  const [businessName, setBusinessName] = useState('');
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { updateUser } = useAuth();
  const { canAddServiceArea, tierFeatures, userTier } = useFeatureAccess();

  const toggleArea = (area: string) => {
    if (selectedAreas.includes(area)) {
      setSelectedAreas(selectedAreas.filter(a => a !== area));
    } else {
      // Check if user can add more service areas
      const access = canAddServiceArea(selectedAreas.length);
      
      if (!access.canAccessFeature) {
        Alert.alert(
          'Upgrade Required',
          access.reason || 'You have reached the maximum number of service areas for your plan.',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Upgrade',
              onPress: () => router.push('/hauler/subscription'),
            },
          ]
        );
        return;
      }
      
      setSelectedAreas([...selectedAreas, area]);
    }
  };

  const handleComplete = async () => {
    if (!businessName.trim()) {
      Alert.alert('Error', 'Please enter your business name');
      return;
    }

    if (selectedAreas.length === 0) {
      Alert.alert('Error', 'Please select at least one service area');
      return;
    }

    setLoading(true);
    try {
      await updateUser({
        businessName: businessName.trim(),
        serviceAreas: selectedAreas,
        status: 'active',
      });

      Alert.alert(
        'Onboarding Complete!',
        'Your account is now active. You can start accepting jobs.',
        [
          {
            text: 'Get Started',
            onPress: () => router.replace('/(tabs)/(home)'),
          },
        ]
      );
    } catch (error) {
      console.log('Error completing onboarding:', error);
      Alert.alert('Error', 'Failed to complete onboarding. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const maxAreas = tierFeatures.maxServiceAreas === -1 
    ? 'Unlimited' 
    : tierFeatures.maxServiceAreas;

  return (
    <SafeAreaView style={commonStyles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <IconSymbol name="checkmark.circle.fill" size={64} color={colors.secondary} />
          <Text style={commonStyles.title}>Complete Your Profile</Text>
          <Text style={commonStyles.subtitle}>
            Set up your business information and service areas
          </Text>
        </View>

        <View style={[commonStyles.card, styles.tierInfoCard]}>
          <View style={styles.tierInfoHeader}>
            <IconSymbol name="star.fill" size={20} color={colors.primary} />
            <Text style={styles.tierInfoTitle}>
              Current Plan: {userTier.toUpperCase()}
            </Text>
          </View>
          <Text style={styles.tierInfoText}>
            Service Areas: {selectedAreas.length} / {maxAreas}
          </Text>
          {tierFeatures.maxServiceAreas !== -1 && selectedAreas.length >= tierFeatures.maxServiceAreas && (
            <Pressable
              style={styles.upgradeLink}
              onPress={() => router.push('/hauler/subscription')}
            >
              <Text style={styles.upgradeLinkText}>Upgrade for more areas</Text>
              <IconSymbol name="arrow.right" size={16} color={colors.primary} />
            </Pressable>
          )}
        </View>

        <View style={commonStyles.card}>
          <Text style={styles.sectionTitle}>Business Information</Text>
          <Text style={styles.label}>Business Name *</Text>
          <TextInput
            style={commonStyles.input}
            placeholder="Enter your business name"
            placeholderTextColor={colors.textSecondary}
            value={businessName}
            onChangeText={setBusinessName}
            autoCapitalize="words"
          />
        </View>

        <View style={commonStyles.card}>
          <Text style={styles.sectionTitle}>Service Areas *</Text>
          <Text style={styles.description}>
            Select the areas where you want to provide hauling services
          </Text>

          <View style={styles.areasGrid}>
            {SERVICE_AREAS.map(area => {
              const isSelected = selectedAreas.includes(area);
              const canSelect = selectedAreas.length < tierFeatures.maxServiceAreas || 
                               tierFeatures.maxServiceAreas === -1 || 
                               isSelected;

              return (
                <Pressable
                  key={area}
                  style={[
                    styles.areaChip,
                    isSelected && styles.areaChipSelected,
                    !canSelect && styles.areaChipDisabled,
                  ]}
                  onPress={() => toggleArea(area)}
                  disabled={!canSelect && !isSelected}
                >
                  {isSelected && (
                    <IconSymbol name="checkmark" size={16} color={colors.card} />
                  )}
                  <Text
                    style={[
                      styles.areaChipText,
                      isSelected && styles.areaChipTextSelected,
                      !canSelect && styles.areaChipTextDisabled,
                    ]}
                  >
                    {area}
                  </Text>
                  {!canSelect && !isSelected && (
                    <IconSymbol name="lock.fill" size={14} color={colors.textSecondary} />
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>

        <Pressable
          style={[buttonStyles.primary, styles.completeButton]}
          onPress={handleComplete}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.card} />
          ) : (
            <Text style={buttonStyles.text}>Complete Onboarding</Text>
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
  tierInfoCard: {
    backgroundColor: colors.highlight,
    marginBottom: 16,
  },
  tierInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  tierInfoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  tierInfoText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  upgradeLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  upgradeLinkText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  areasGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  areaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: colors.border,
  },
  areaChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  areaChipDisabled: {
    opacity: 0.5,
  },
  areaChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  areaChipTextSelected: {
    color: colors.card,
  },
  areaChipTextDisabled: {
    color: colors.textSecondary,
  },
  completeButton: {
    marginTop: 24,
    marginBottom: 20,
  },
});
