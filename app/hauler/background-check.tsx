
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, buttonStyles, commonStyles } from '@/styles/commonStyles';
import { useAuth } from '@/contexts/AuthContext';
import { IconSymbol } from '@/components/IconSymbol';

export default function BackgroundCheckScreen() {
  const [loading, setLoading] = useState(false);
  const { updateUser } = useAuth();

  const handleStartBackgroundCheck = async () => {
    Alert.alert(
      'Background Check',
      'You will be redirected to Checkr to complete your background check. The cost is $35.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Continue',
          onPress: async () => {
            setLoading(true);
            try {
              // In a real app, generate Checkr link via API
              const checkrUrl = 'https://checkr.com';
              
              // Simulate API call
              await new Promise(resolve => setTimeout(resolve, 1000));
              
              // Open Checkr link
              const supported = await Linking.canOpenURL(checkrUrl);
              if (supported) {
                await Linking.openURL(checkrUrl);
              }
              
              // Update user status
              await updateUser({ status: 'background_check_in_progress' });
              
              Alert.alert(
                'Background Check Initiated',
                'Your background check has been initiated. You will receive an email notification once it is complete.',
                [
                  {
                    text: 'OK',
                    onPress: () => router.replace('/(tabs)/(home)'),
                  },
                ]
              );
            } catch (error) {
              console.log('Error starting background check:', error);
              Alert.alert('Error', 'Failed to start background check. Please try again.');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleSimulateApproval = async () => {
    // For demo purposes only
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      await updateUser({ status: 'background_check_approved' });
      
      Alert.alert(
        'Background Check Approved',
        'Your background check has been approved! Please upload your documents to continue.',
        [
          {
            text: 'Upload Documents',
            onPress: () => router.replace('/hauler/documents'),
          },
        ]
      );
    } catch (error) {
      console.log('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <IconSymbol name="checkmark.shield.fill" size={60} color={colors.primary} />
          </View>
          <Text style={commonStyles.title}>Background Check</Text>
          <Text style={commonStyles.subtitle}>
            Complete your background check to start accepting jobs
          </Text>
        </View>

        <View style={commonStyles.card}>
          <Text style={styles.sectionTitle}>What&apos;s Required</Text>
          <View style={styles.requirementItem}>
            <IconSymbol name="checkmark.circle.fill" size={24} color={colors.secondary} />
            <Text style={styles.requirementText}>Valid government-issued ID</Text>
          </View>
          <View style={styles.requirementItem}>
            <IconSymbol name="checkmark.circle.fill" size={24} color={colors.secondary} />
            <Text style={styles.requirementText}>Social Security Number</Text>
          </View>
          <View style={styles.requirementItem}>
            <IconSymbol name="checkmark.circle.fill" size={24} color={colors.secondary} />
            <Text style={styles.requirementText}>Current address information</Text>
          </View>
          <View style={styles.requirementItem}>
            <IconSymbol name="checkmark.circle.fill" size={24} color={colors.secondary} />
            <Text style={styles.requirementText}>Payment method ($35 fee)</Text>
          </View>
        </View>

        <View style={commonStyles.card}>
          <Text style={styles.sectionTitle}>What We Check</Text>
          <View style={styles.checkItem}>
            <Text style={styles.checkIcon}>🔍</Text>
            <View style={styles.checkContent}>
              <Text style={styles.checkTitle}>Criminal Records</Text>
              <Text style={styles.checkDescription}>
                National and county-level criminal record search
              </Text>
            </View>
          </View>
          <View style={styles.checkItem}>
            <Text style={styles.checkIcon}>🚗</Text>
            <View style={styles.checkContent}>
              <Text style={styles.checkTitle}>Driving Record</Text>
              <Text style={styles.checkDescription}>
                Motor vehicle records and driving history
              </Text>
            </View>
          </View>
          <View style={styles.checkItem}>
            <Text style={styles.checkIcon}>✅</Text>
            <View style={styles.checkContent}>
              <Text style={styles.checkTitle}>Identity Verification</Text>
              <Text style={styles.checkDescription}>
                Confirm your identity and right to work
              </Text>
            </View>
          </View>
        </View>

        <View style={[commonStyles.card, styles.infoCard]}>
          <IconSymbol name="info.circle.fill" size={24} color={colors.primary} />
          <Text style={styles.infoText}>
            Background checks typically take 3-5 business days to complete. You&apos;ll receive an email notification once your check is finished.
          </Text>
        </View>

        <Pressable
          style={[buttonStyles.primary, styles.button]}
          onPress={handleStartBackgroundCheck}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.card} />
          ) : (
            <Text style={buttonStyles.text}>Start Background Check ($35)</Text>
          )}
        </Pressable>

        {/* Demo button - remove in production */}
        <Pressable
          style={[buttonStyles.outline, styles.button, { marginTop: 12 }]}
          onPress={handleSimulateApproval}
          disabled={loading}
        >
          <Text style={buttonStyles.outlineText}>
            [Demo] Simulate Approval
          </Text>
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
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  requirementText: {
    fontSize: 16,
    color: colors.text,
  },
  checkItem: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  checkIcon: {
    fontSize: 32,
  },
  checkContent: {
    flex: 1,
  },
  checkTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  checkDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
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
