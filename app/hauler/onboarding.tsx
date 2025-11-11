
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

const SERVICE_AREAS = [
  'Downtown',
  'North Side',
  'South Side',
  'East Side',
  'West Side',
  'Suburbs',
  'County-wide',
];

export default function OnboardingScreen() {
  const [businessName, setBusinessName] = useState('');
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { updateUser } = useAuth();

  const toggleArea = (area: string) => {
    setSelectedAreas(prev =>
      prev.includes(area)
        ? prev.filter(a => a !== area)
        : [...prev, area]
    );
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
      // In a real app, save to server
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await updateUser({
        status: 'active',
        businessName,
        serviceAreas: selectedAreas,
      });
      
      Alert.alert(
        'Onboarding Complete!',
        'Your account is now active. Choose a subscription plan to start accepting jobs.',
        [
          {
            text: 'Choose Plan',
            onPress: () => router.replace('/hauler/subscription'),
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

  return (
    <SafeAreaView style={commonStyles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <IconSymbol name="checkmark.circle.fill" size={60} color={colors.secondary} />
          </View>
          <Text style={commonStyles.title}>Almost There!</Text>
          <Text style={commonStyles.subtitle}>
            Complete your profile to start accepting jobs
          </Text>
        </View>

        <View style={commonStyles.card}>
          <Text style={styles.sectionTitle}>Business Information</Text>
          <Text style={commonStyles.label}>Business Name</Text>
          <TextInput
            style={commonStyles.input}
            placeholder="Enter your business name"
            placeholderTextColor={colors.textSecondary}
            value={businessName}
            onChangeText={setBusinessName}
          />
          <Text style={styles.helperText}>
            This will be displayed to customers when you&apos;re assigned jobs
          </Text>
        </View>

        <View style={commonStyles.card}>
          <Text style={styles.sectionTitle}>Service Areas</Text>
          <Text style={styles.description}>
            Select the areas where you&apos;re willing to provide services
          </Text>
          <View style={styles.areasGrid}>
            {SERVICE_AREAS.map(area => (
              <Pressable
                key={area}
                style={[
                  styles.areaChip,
                  selectedAreas.includes(area) && styles.areaChipSelected,
                ]}
                onPress={() => toggleArea(area)}
              >
                <Text
                  style={[
                    styles.areaChipText,
                    selectedAreas.includes(area) && styles.areaChipTextSelected,
                  ]}
                >
                  {area}
                </Text>
                {selectedAreas.includes(area) && (
                  <IconSymbol name="checkmark" size={16} color={colors.card} />
                )}
              </Pressable>
            ))}
          </View>
        </View>

        <View style={[commonStyles.card, styles.infoCard]}>
          <IconSymbol name="info.circle.fill" size={24} color={colors.primary} />
          <Text style={styles.infoText}>
            You can update your service areas later in your profile settings. Your subscription tier will determine how many areas you can serve.
          </Text>
        </View>

        <Pressable
          style={[buttonStyles.primary, styles.button]}
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
    marginBottom: 32,
  },
  iconContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  helperText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: -8,
    lineHeight: 18,
  },
  areasGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  areaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  areaChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  areaChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  areaChipTextSelected: {
    color: colors.card,
  },
  infoCard: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: colors.highlight,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  button: {
    marginTop: 8,
  },
});
