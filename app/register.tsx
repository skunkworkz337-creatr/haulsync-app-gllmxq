
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, buttonStyles, commonStyles } from '@/styles/commonStyles';
import { useAuth } from '@/contexts/AuthContext';
import { IconSymbol } from '@/components/IconSymbol';
import { UserRole } from '@/types/user';

export default function RegisterScreen() {
  const [role, setRole] = useState<UserRole | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleRegister = async () => {
    if (!role) {
      Alert.alert('Error', 'Please select your role');
      return;
    }

    if (!firstName || !lastName || !email || !phone || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    try {
      await register({
        role,
        firstName,
        lastName,
        email,
        phone,
        password,
      });

      // Show success message
      Alert.alert(
        'Success',
        role === 'customer'
          ? 'Account created successfully! You can now start posting jobs.'
          : 'Account created! Please complete the background check to continue.',
        [
          {
            text: 'OK',
            onPress: () => {
              if (role === 'hauler') {
                router.replace('/hauler/background-check');
              } else {
                router.replace('/(tabs)/(home)');
              }
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!role) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <IconSymbol name="chevron.left" size={24} color={colors.primary} />
          </Pressable>

          <View style={styles.header}>
            <Text style={styles.logo}>🚚</Text>
            <Text style={commonStyles.title}>Join HaulHub</Text>
            <Text style={commonStyles.subtitle}>Choose your account type</Text>
          </View>

          <View style={styles.roleContainer}>
            <Pressable
              style={[commonStyles.card, styles.roleCard]}
              onPress={() => setRole('customer')}
            >
              <Text style={styles.roleIcon}>📦</Text>
              <Text style={styles.roleTitle}>I&apos;m a Customer</Text>
              <Text style={styles.roleDescription}>
                I need hauling services for pickup and delivery
              </Text>
              <View style={styles.roleBadge}>
                <Text style={styles.roleBadgeText}>Instant Access</Text>
              </View>
            </Pressable>

            <Pressable
              style={[commonStyles.card, styles.roleCard]}
              onPress={() => setRole('hauler')}
            >
              <Text style={styles.roleIcon}>🚚</Text>
              <Text style={styles.roleTitle}>I&apos;m a Hauler</Text>
              <Text style={styles.roleDescription}>
                I want to provide hauling services and earn money
              </Text>
              <View style={[styles.roleBadge, { backgroundColor: colors.accent }]}>
                <Text style={[styles.roleBadgeText, { color: colors.text }]}>
                  Background Check Required
                </Text>
              </View>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={commonStyles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Pressable style={styles.backButton} onPress={() => setRole(null)}>
          <IconSymbol name="chevron.left" size={24} color={colors.primary} />
        </Pressable>

        <View style={styles.header}>
          <Text style={styles.logo}>{role === 'customer' ? '📦' : '🚚'}</Text>
          <Text style={commonStyles.title}>
            {role === 'customer' ? 'Customer' : 'Hauler'} Registration
          </Text>
          <Text style={commonStyles.subtitle}>Create your account</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.row}>
            <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
              <Text style={commonStyles.label}>First Name</Text>
              <TextInput
                style={commonStyles.input}
                placeholder="John"
                placeholderTextColor={colors.textSecondary}
                value={firstName}
                onChangeText={setFirstName}
                autoCapitalize="words"
              />
            </View>

            <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
              <Text style={commonStyles.label}>Last Name</Text>
              <TextInput
                style={commonStyles.input}
                placeholder="Doe"
                placeholderTextColor={colors.textSecondary}
                value={lastName}
                onChangeText={setLastName}
                autoCapitalize="words"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={commonStyles.label}>Email</Text>
            <TextInput
              style={commonStyles.input}
              placeholder="john.doe@example.com"
              placeholderTextColor={colors.textSecondary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={commonStyles.label}>Phone</Text>
            <TextInput
              style={commonStyles.input}
              placeholder="+1 (555) 123-4567"
              placeholderTextColor={colors.textSecondary}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              autoComplete="tel"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={commonStyles.label}>Password</Text>
            <TextInput
              style={commonStyles.input}
              placeholder="At least 8 characters"
              placeholderTextColor={colors.textSecondary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={commonStyles.label}>Confirm Password</Text>
            <TextInput
              style={commonStyles.input}
              placeholder="Re-enter your password"
              placeholderTextColor={colors.textSecondary}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          <Pressable
            style={[buttonStyles.primary, styles.registerButton]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.card} />
            ) : (
              <Text style={buttonStyles.text}>Create Account</Text>
            )}
          </Pressable>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <Pressable onPress={() => router.push('/login')}>
              <Text style={styles.linkText}>Sign In</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    marginBottom: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    fontSize: 60,
    marginBottom: 16,
  },
  roleContainer: {
    gap: 16,
  },
  roleCard: {
    alignItems: 'center',
    padding: 24,
  },
  roleIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  roleTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  roleDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  roleBadge: {
    backgroundColor: colors.highlight,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  roleBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  form: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
  },
  inputContainer: {
    marginBottom: 20,
  },
  registerButton: {
    marginTop: 8,
    marginBottom: 24,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  linkText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
});
