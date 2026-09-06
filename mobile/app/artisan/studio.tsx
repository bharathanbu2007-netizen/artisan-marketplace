import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import ImageEditor from '../../components/ImageEditor';
import * as ai from '../../services/ai';
import { uploadImage } from '../../services/upload';
import { colors, radius, spacing } from '../../constants/theme';

/**
 * AI Artisan Studio — Product Scan workflow:
 * Camera -> compression -> Vision AI -> detection -> background removal ->
 * lighting/color correction -> crop/align -> preview -> continue to Product Info.
 */
export default function AiStudio() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [remoteImageUrl, setRemoteImageUrl] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [sceneSuggestion, setSceneSuggestion] = useState<any>(null);
  const [step, setStep] = useState<'capture' | 'edit' | 'review'>('capture');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pickImage = async (fromCamera: boolean) => {
    const permission = fromCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const result = fromCamera
      ? await ImagePicker.launchCameraAsync({ quality: 0.7 })
      : await ImagePicker.launchImageLibraryAsync({ quality: 0.7 });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImageUri(uri);
      setError(null);
      setLoading(true);
      try {
        const uploadedUrl = await uploadImage(uri);
        setRemoteImageUrl(uploadedUrl);

        const [{ data: productData }, { data: sceneData }] = await Promise.all([
          ai.analyzeProduct(uploadedUrl),
          ai.analyzeScene(uploadedUrl),
        ]);
        setAnalysis(productData.data.analysis);
        setSceneSuggestion(sceneData.data.scene ?? sceneData.data);
        setStep('edit');
      } catch (err: any) {
        console.error('[AiStudio] upload/analyze failed:', err);
        setError(
          err?.response?.data?.message ||
            err?.message ||
            'Upload failed. Check your connection and try again.'
        );
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBackgroundConfirm = async (background: string) => {
    setLoading(true);
    setError(null);
    try {
      await ai.enhanceImage(remoteImageUrl || imageUri!, background);
      setStep('review');
    } catch (err: any) {
      console.error('[AiStudio] enhance failed:', err);
      setError(err?.response?.data?.message || err?.message || 'Enhancement failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const proceedToCatalog = () => {
    router.push({
      pathname: '/artisan/create-product',
      params: {
        imageUri: remoteImageUrl || imageUri || '',
        detectedObject: analysis?.detectedObject || '',
        material: analysis?.material || '',
      },
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: spacing.md }}>
      <Text style={styles.title}>AI Artisan Studio</Text>

      {step === 'capture' && (
        <View>
          <Text style={styles.subtitle}>Take or upload a photo of your product to get started.</Text>
          <TouchableOpacity style={styles.primaryBtn} onPress={() => pickImage(true)}>
            <Text style={styles.primaryBtnText}>📷 Scan with Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryBtn} onPress={() => pickImage(false)}>
            <Text style={styles.secondaryBtnText}>Choose from Gallery</Text>
          </TouchableOpacity>
        </View>
      )}

      {loading && <Text style={styles.loadingText}>Analyzing…</Text>}
      {error && <Text style={styles.errorText}>{error}</Text>}

      {step === 'edit' && imageUri && !loading && (
        <View>
          {analysis && (
            <View style={styles.analysisBox}>
              <Text style={styles.analysisText}>Detected: {analysis.detectedObject}</Text>
              <Text style={styles.analysisText}>Material: {analysis.material}</Text>
              <Text style={styles.analysisText}>Confidence: {Math.round(analysis.confidence * 100)}%</Text>
            </View>
          )}
          {sceneSuggestion && (
            <View style={styles.analysisBox}>
              <Text style={styles.analysisText}>💡 AI Background Suggestion</Text>
              <Text style={styles.analysisText}>{sceneSuggestion.suggestion}</Text>
            </View>
          )}
          <ImageEditor
            imageUri={imageUri}
            recommendedBackground={sceneSuggestion?.recommendedBackground}
            onConfirm={handleBackgroundConfirm}
          />
        </View>
      )}

      {step === 'review' && !loading && (
        <View>
          <Text style={styles.subtitle}>Your professional e-commerce photo is ready.</Text>
          <TouchableOpacity style={styles.primaryBtn} onPress={proceedToCatalog}>
            <Text style={styles.primaryBtnText}>Continue to Product Info</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  title: { fontSize: 20, fontWeight: '800', color: colors.text, marginBottom: spacing.sm },
  subtitle: { fontSize: 14, color: colors.muted, marginBottom: spacing.lg },
  primaryBtn: { backgroundColor: colors.primary, borderRadius: radius.md, padding: 16, alignItems: 'center', marginBottom: spacing.sm },
  primaryBtnText: { color: colors.white, fontWeight: '700' },
  secondaryBtn: { borderWidth: 1, borderColor: colors.primary, borderRadius: radius.md, padding: 16, alignItems: 'center' },
  secondaryBtnText: { color: colors.primaryDark, fontWeight: '700' },
  loadingText: { textAlign: 'center', color: colors.muted, marginVertical: spacing.lg },
  errorText: { textAlign: 'center', color: '#B3261E', marginVertical: spacing.sm, fontWeight: '600' },
  analysisBox: { backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.md },
  analysisText: { fontSize: 13, color: colors.text },
});
