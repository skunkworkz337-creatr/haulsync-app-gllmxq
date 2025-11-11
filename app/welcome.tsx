
import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, buttonStyles, commonStyles } from '@/styles/commonStyles';
import { LinearGradient } from 'expo-linear-gradient';

export default function WelcomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[colors.primary, colors.secondary]}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.logo}>🚚</Text>
            <Text style={styles.title}>HaulHub</Text>
            <Text style={styles.subtitle}>
              Connect haulers with customers for seamless pickup and delivery services
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <Pressable
              style={[buttonStyles.primary, styles.button, { backgroundColor: colors.card }]}
              onPress={() => router.push('/register')}
            >
              <Text style={[buttonStyles.text, { color: colors.primary }]}>Get Started</Text>
            </Pressable>

            <Pressable
              style={[buttonStyles.outline, styles.button, { borderColor: colors.card }]}
              onPress={() => router.push('/login')}
            >
              <Text style={[buttonStyles.outlineText, { color: colors.card }]}>
                Sign In
              </Text>
            </Pressable>
          </View>

          <View style={styles.features}>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>✓</Text>
              <Text style={styles.featureText}>Verified Haulers</Text>
            </View>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>✓</Text>
              <Text style={styles.featureText}>Instant Matching</Text>
            </View>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>✓</Text>
              <Text style={styles.featureText}>Secure Payments</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 24,
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    fontSize: 80,
    marginBottom: 16,
  },
  title: {
    fontSize: 42,
    fontWeight: '800',
    color: colors.card,
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: colors.card,
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: 26,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    gap: 12,
  },
  button: {
    width: '100%',
  },
  features: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 20,
  },
  feature: {
    alignItems: 'center',
  },
  featureIcon: {
    fontSize: 24,
    color: colors.accent,
    marginBottom: 4,
  },
  featureText: {
    fontSize: 12,
    color: colors.card,
    opacity: 0.9,
  },
});
