
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, buttonStyles, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { onboardingSteps } from '@/data/haulerOnboardingData';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function OnboardingPresentationScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const translateX = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      translateX.value = withSpring(-20, {}, () => {
        translateX.value = withSpring(0);
      });
      setCurrentStep(currentStep + 1);
    } else {
      router.push('/hauler/onboarding-quiz');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      translateX.value = withSpring(20, {}, () => {
        translateX.value = withSpring(0);
      });
      setCurrentStep(currentStep - 1);
    }
  };

  const step = onboardingSteps[currentStep];
  const progress = ((currentStep + 1) / onboardingSteps.length) * 100;

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Hauler Onboarding</Text>
          <Text style={styles.headerSubtitle}>
            Step {currentStep + 1} of {onboardingSteps.length}
          </Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBackground}>
            <Animated.View
              style={[
                styles.progressBarFill,
                { width: `${progress}%` },
              ]}
            />
          </View>
        </View>

        {/* Content */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={[styles.contentCard, animatedStyle]}>
            <View style={styles.stepHeader}>
              <View style={styles.stepNumberBadge}>
                <Text style={styles.stepNumberText}>{step.id}</Text>
              </View>
              <Text style={styles.stepTitle}>{step.title}</Text>
            </View>

            <View style={styles.contentBody}>
              {step.content.map((line, index) => {
                if (line === '') {
                  return <View key={index} style={styles.spacer} />;
                }
                
                const isIndented = line.startsWith('  ');
                const isBullet = line.trim().startsWith('•') || line.trim().startsWith('-');
                
                return (
                  <View
                    key={index}
                    style={[
                      styles.contentLine,
                      isIndented && styles.indentedLine,
                    ]}
                  >
                    {isBullet && (
                      <View style={styles.bulletContainer}>
                        <View style={styles.bullet} />
                      </View>
                    )}
                    <Text
                      style={[
                        styles.contentText,
                        line.includes(':') && !isBullet && styles.boldText,
                      ]}
                    >
                      {line.replace(/^[\s•-]+/, '')}
                    </Text>
                  </View>
                );
              })}
            </View>
          </Animated.View>
        </ScrollView>

        {/* Navigation Buttons */}
        <View style={styles.navigationContainer}>
          <Pressable
            style={[
              buttonStyles.outline,
              styles.navButton,
              currentStep === 0 && styles.navButtonDisabled,
            ]}
            onPress={handlePrevious}
            disabled={currentStep === 0}
          >
            <View style={styles.navButtonContent}>
              <IconSymbol
                name="chevron.left"
                size={20}
                color={currentStep === 0 ? colors.textSecondary : colors.primary}
              />
              <Text
                style={[
                  buttonStyles.outlineText,
                  currentStep === 0 && styles.navButtonTextDisabled,
                ]}
              >
                Previous
              </Text>
            </View>
          </Pressable>

          <Pressable
            style={[buttonStyles.primary, styles.navButton]}
            onPress={handleNext}
          >
            <View style={styles.navButtonContent}>
              <Text style={buttonStyles.text}>
                {currentStep === onboardingSteps.length - 1 ? 'Start Quiz' : 'Next'}
              </Text>
              <IconSymbol
                name={
                  currentStep === onboardingSteps.length - 1
                    ? 'checkmark.circle.fill'
                    : 'chevron.right'
                }
                size={20}
                color={colors.card}
              />
            </View>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  progressBarContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 0,
  },
  contentCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08)',
    elevation: 4,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 16,
  },
  stepNumberBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.card,
  },
  stepTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    lineHeight: 28,
  },
  contentBody: {
    gap: 12,
  },
  contentLine: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  indentedLine: {
    paddingLeft: 20,
  },
  bulletContainer: {
    paddingTop: 8,
    paddingRight: 8,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  contentText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    color: colors.text,
  },
  boldText: {
    fontWeight: '600',
  },
  spacer: {
    height: 8,
  },
  navigationContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.card,
  },
  navButton: {
    flex: 1,
  },
  navButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonTextDisabled: {
    color: colors.textSecondary,
  },
});
