
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, buttonStyles, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { quizQuestions } from '@/data/haulerOnboardingData';
import { useAuth } from '@/contexts/AuthContext';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInRight,
  SlideOutLeft,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

interface QuestionState {
  selectedAnswer: string | null;
  isAnswered: boolean;
  isCorrect: boolean | null;
}

export default function OnboardingQuizScreen() {
  const { updateUser } = useAuth();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questionStates, setQuestionStates] = useState<QuestionState[]>(
    quizQuestions.map(() => ({
      selectedAnswer: null,
      isAnswered: false,
      isCorrect: null,
    }))
  );
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);

  const currentQuestion = quizQuestions[currentQuestionIndex];
  const currentState = questionStates[currentQuestionIndex];

  const handleAnswerSelect = (answer: string) => {
    if (currentState.isAnswered) return;

    const isCorrect = answer === currentQuestion.correctAnswer;
    
    // Haptic feedback
    if (isCorrect) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }

    const newStates = [...questionStates];
    newStates[currentQuestionIndex] = {
      selectedAnswer: answer,
      isAnswered: true,
      isCorrect,
    };
    setQuestionStates(newStates);
  };

  const handleNext = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      calculateResults();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const calculateResults = () => {
    const correctAnswers = questionStates.filter(state => state.isCorrect).length;
    const percentage = (correctAnswers / quizQuestions.length) * 100;
    const passed = percentage >= 80; // 80% passing score

    setShowResults(true);

    setTimeout(async () => {
      if (passed) {
        // Update user status to pending_onboarding
        try {
          await updateUser({ status: 'pending_onboarding' });
        } catch (error) {
          console.log('Error updating user status:', error);
        }
        
        Alert.alert(
          'Congratulations! 🎉',
          `You passed with ${correctAnswers}/${quizQuestions.length} correct answers (${percentage.toFixed(0)}%)!\n\nYou can now complete your profile setup.`,
          [
            {
              text: 'Continue',
              onPress: () => router.replace('/hauler/onboarding'),
            },
          ]
        );
      } else {
        Alert.alert(
          'Quiz Not Passed',
          `You scored ${correctAnswers}/${quizQuestions.length} (${percentage.toFixed(0)}%). You need 80% to pass.\n\nPlease review the material and try again.`,
          [
            {
              text: 'Retake Quiz',
              onPress: resetQuiz,
            },
            {
              text: 'Review Material',
              onPress: () => router.back(),
            },
          ]
        );
      }
    }, 500);
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setQuestionStates(
      quizQuestions.map(() => ({
        selectedAnswer: null,
        isAnswered: false,
        isCorrect: null,
      }))
    );
    setShowResults(false);
  };

  const progress = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;
  const answeredCount = questionStates.filter(state => state.isAnswered).length;

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={styles.headerTitle}>Onboarding Quiz</Text>
            <View style={styles.scoreContainer}>
              <Text style={styles.scoreText}>
                {answeredCount}/{quizQuestions.length}
              </Text>
            </View>
          </View>
          <Text style={styles.headerSubtitle}>
            Question {currentQuestionIndex + 1} of {quizQuestions.length}
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

        {/* Question Content */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            key={currentQuestionIndex}
            entering={SlideInRight}
            exiting={SlideOutLeft}
            style={styles.questionCard}
          >
            <View style={styles.questionHeader}>
              <View style={styles.questionNumberBadge}>
                <Text style={styles.questionNumberText}>
                  {currentQuestion.id}
                </Text>
              </View>
            </View>

            <Text style={styles.questionText}>{currentQuestion.question}</Text>

            <View style={styles.optionsContainer}>
              {currentQuestion.options.map((option, index) => {
                const optionLetter = option.charAt(0);
                const isSelected = currentState.selectedAnswer === optionLetter;
                const isCorrectAnswer = optionLetter === currentQuestion.correctAnswer;
                const showCorrect = currentState.isAnswered && isCorrectAnswer;
                const showIncorrect = currentState.isAnswered && isSelected && !isCorrectAnswer;

                return (
                  <Pressable
                    key={index}
                    style={[
                      styles.optionButton,
                      isSelected && !currentState.isAnswered && styles.optionButtonSelected,
                      showCorrect && styles.optionButtonCorrect,
                      showIncorrect && styles.optionButtonIncorrect,
                    ]}
                    onPress={() => handleAnswerSelect(optionLetter)}
                    disabled={currentState.isAnswered}
                  >
                    <View style={styles.optionContent}>
                      <View
                        style={[
                          styles.optionRadio,
                          isSelected && !currentState.isAnswered && styles.optionRadioSelected,
                          showCorrect && styles.optionRadioCorrect,
                          showIncorrect && styles.optionRadioIncorrect,
                        ]}
                      >
                        {showCorrect && (
                          <IconSymbol name="checkmark" size={16} color={colors.card} />
                        )}
                        {showIncorrect && (
                          <IconSymbol name="xmark" size={16} color={colors.card} />
                        )}
                      </View>
                      <Text
                        style={[
                          styles.optionText,
                          (showCorrect || showIncorrect) && styles.optionTextAnswered,
                        ]}
                      >
                        {option}
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>

            {/* Show explanation after answering */}
            {currentState.isAnswered && currentQuestion.explanation && (
              <Animated.View
                entering={FadeIn.delay(200)}
                style={[
                  styles.explanationCard,
                  currentState.isCorrect
                    ? styles.explanationCardCorrect
                    : styles.explanationCardIncorrect,
                ]}
              >
                <View style={styles.explanationHeader}>
                  <IconSymbol
                    name={currentState.isCorrect ? 'checkmark.circle.fill' : 'xmark.circle.fill'}
                    size={24}
                    color={currentState.isCorrect ? colors.success : colors.error}
                  />
                  <Text
                    style={[
                      styles.explanationTitle,
                      { color: currentState.isCorrect ? colors.success : colors.error },
                    ]}
                  >
                    {currentState.isCorrect ? 'Correct!' : 'Incorrect'}
                  </Text>
                </View>
                <Text style={styles.explanationText}>
                  {currentQuestion.explanation}
                </Text>
              </Animated.View>
            )}
          </Animated.View>
        </ScrollView>

        {/* Navigation Buttons */}
        <View style={styles.navigationContainer}>
          <Pressable
            style={[
              buttonStyles.outline,
              styles.navButton,
              currentQuestionIndex === 0 && styles.navButtonDisabled,
            ]}
            onPress={handlePrevious}
            disabled={currentQuestionIndex === 0}
          >
            <View style={styles.navButtonContent}>
              <IconSymbol
                name="chevron.left"
                size={20}
                color={currentQuestionIndex === 0 ? colors.textSecondary : colors.primary}
              />
              <Text
                style={[
                  buttonStyles.outlineText,
                  currentQuestionIndex === 0 && styles.navButtonTextDisabled,
                ]}
              >
                Previous
              </Text>
            </View>
          </Pressable>

          <Pressable
            style={[
              buttonStyles.primary,
              styles.navButton,
              !currentState.isAnswered && styles.navButtonDisabled,
            ]}
            onPress={handleNext}
            disabled={!currentState.isAnswered}
          >
            <View style={styles.navButtonContent}>
              <Text style={buttonStyles.text}>
                {currentQuestionIndex === quizQuestions.length - 1 ? 'Finish' : 'Next'}
              </Text>
              <IconSymbol
                name={
                  currentQuestionIndex === quizQuestions.length - 1
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
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  scoreContainer: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  scoreText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.card,
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
  questionCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08)',
    elevation: 4,
  },
  questionHeader: {
    marginBottom: 16,
  },
  questionNumberBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.highlight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  questionNumberText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    lineHeight: 26,
    marginBottom: 24,
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    backgroundColor: colors.card,
  },
  optionButtonSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.highlight,
  },
  optionButtonCorrect: {
    borderColor: colors.success,
    backgroundColor: '#e8f5e9',
  },
  optionButtonIncorrect: {
    borderColor: colors.error,
    backgroundColor: '#ffebee',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  optionRadio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionRadioSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  optionRadioCorrect: {
    borderColor: colors.success,
    backgroundColor: colors.success,
  },
  optionRadioIncorrect: {
    borderColor: colors.error,
    backgroundColor: colors.error,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    lineHeight: 22,
  },
  optionTextAnswered: {
    fontWeight: '600',
  },
  explanationCard: {
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
  },
  explanationCardCorrect: {
    backgroundColor: '#e8f5e9',
    borderColor: colors.success,
  },
  explanationCardIncorrect: {
    backgroundColor: '#ffebee',
    borderColor: colors.error,
  },
  explanationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  explanationTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  explanationText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
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
