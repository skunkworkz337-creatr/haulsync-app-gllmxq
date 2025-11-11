
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
import * as ImagePicker from 'expo-image-picker';
import { colors, buttonStyles, commonStyles } from '@/styles/commonStyles';
import { useAuth } from '@/contexts/AuthContext';
import { IconSymbol } from '@/components/IconSymbol';

interface Document {
  type: 'license' | 'registration' | 'insurance';
  title: string;
  description: string;
  uri?: string;
}

export default function DocumentsScreen() {
  const [loading, setLoading] = useState(false);
  const { updateUser } = useAuth();
  
  const [documents, setDocuments] = useState<Document[]>([
    {
      type: 'license',
      title: "Driver's License",
      description: 'Front and back of your valid driver&apos;s license',
    },
    {
      type: 'registration',
      title: 'Vehicle Registration',
      description: 'Current vehicle registration document',
    },
    {
      type: 'insurance',
      title: 'Insurance Certificate',
      description: 'Proof of vehicle insurance coverage',
    },
  ]);

  const pickDocument = async (type: Document['type']) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setDocuments(prev =>
          prev.map(doc =>
            doc.type === type ? { ...doc, uri: result.assets[0].uri } : doc
          )
        );
      }
    } catch (error) {
      console.log('Error picking document:', error);
      Alert.alert('Error', 'Failed to pick document. Please try again.');
    }
  };

  const handleSubmit = async () => {
    const allUploaded = documents.every(doc => doc.uri);
    
    if (!allUploaded) {
      Alert.alert('Missing Documents', 'Please upload all required documents.');
      return;
    }

    setLoading(true);
    try {
      // In a real app, upload documents to server
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      await updateUser({ status: 'documents_submitted' });
      
      Alert.alert(
        'Documents Submitted',
        'Your documents have been submitted for review. Please complete your onboarding.',
        [
          {
            text: 'Continue',
            onPress: () => router.replace('/hauler/onboarding'),
          },
        ]
      );
    } catch (error) {
      console.log('Error submitting documents:', error);
      Alert.alert('Error', 'Failed to submit documents. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <IconSymbol name="doc.text.fill" size={60} color={colors.primary} />
          </View>
          <Text style={commonStyles.title}>Upload Documents</Text>
          <Text style={commonStyles.subtitle}>
            Please upload the following required documents
          </Text>
        </View>

        {documents.map((doc, index) => (
          <View key={doc.type} style={commonStyles.card}>
            <View style={styles.documentHeader}>
              <View>
                <Text style={styles.documentTitle}>{doc.title}</Text>
                <Text style={styles.documentDescription}>{doc.description}</Text>
              </View>
              {doc.uri && (
                <IconSymbol name="checkmark.circle.fill" size={24} color={colors.secondary} />
              )}
            </View>

            {doc.uri ? (
              <View style={styles.uploadedContainer}>
                <View style={styles.uploadedInfo}>
                  <IconSymbol name="doc.fill" size={32} color={colors.primary} />
                  <Text style={styles.uploadedText}>Document uploaded</Text>
                </View>
                <Pressable
                  style={styles.changeButton}
                  onPress={() => pickDocument(doc.type)}
                >
                  <Text style={styles.changeButtonText}>Change</Text>
                </Pressable>
              </View>
            ) : (
              <Pressable
                style={styles.uploadButton}
                onPress={() => pickDocument(doc.type)}
              >
                <IconSymbol name="arrow.up.doc.fill" size={32} color={colors.primary} />
                <Text style={styles.uploadButtonText}>Upload Document</Text>
              </Pressable>
            )}
          </View>
        ))}

        <View style={[commonStyles.card, styles.infoCard]}>
          <IconSymbol name="info.circle.fill" size={24} color={colors.primary} />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Document Requirements</Text>
            <Text style={styles.infoText}>
              - All documents must be clear and legible{'\n'}
              - Documents must be current and not expired{'\n'}
              - File formats: JPG, PNG, or PDF{'\n'}
              - Maximum file size: 10MB per document
            </Text>
          </View>
        </View>

        <Pressable
          style={[
            buttonStyles.primary,
            styles.submitButton,
            !documents.every(doc => doc.uri) && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={loading || !documents.every(doc => doc.uri)}
        >
          {loading ? (
            <ActivityIndicator color={colors.card} />
          ) : (
            <Text style={buttonStyles.text}>Submit Documents</Text>
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
  documentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  documentTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  documentDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  uploadButton: {
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 24,
    alignItems: 'center',
    gap: 8,
  },
  uploadButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  uploadedContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.highlight,
    padding: 16,
    borderRadius: 8,
  },
  uploadedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  uploadedText: {
    fontSize: 16,
    color: colors.text,
  },
  changeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.card,
    borderRadius: 6,
  },
  changeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  infoCard: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: colors.highlight,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  submitButton: {
    marginTop: 8,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
});
