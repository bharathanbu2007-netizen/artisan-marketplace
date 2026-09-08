import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Audio } from 'expo-av';
import * as ai from '../../services/ai';
import api from '../../services/api';
import { uploadImage } from '../../services/upload';
import { colors, radius, spacing, languages } from '../../constants/theme';

/**
 * Create Product Workflow (steps 3-6 of guide section 18):
 * Product Information (voice-first via AI Cataloger) -> Set Price
 * (Dynamic Pricing Assistant) -> Marketplace Preview -> Publish.
 */
export default function CreateProduct() {
  const params = useLocalSearchParams<{ imageUri: string; detectedObject: string; material: string }>();
  const [transcript, setTranscript] = useState('');
  const [catalog, setCatalog] = useState<any>(null);
  const [price, setPrice] = useState('');
  const [suggested, setSuggested] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [voiceLanguage, setVoiceLanguage] = useState(languages[0].code);
  const [originalTranscript, setOriginalTranscript] = useState<string | null>(null);

  const startRecording = async () => {
    setError(null);
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) {
        setError('Microphone permission is required to record a voice note.');
        return;
      }
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
      const { recording: rec } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      setRecording(rec);
      setIsRecording(true);
    } catch (err: any) {
      console.error('[CreateProduct] startRecording failed:', err);
      setError(err?.message || 'Could not start recording.');
    }
  };

  const stopRecordingAndTranscribe = async () => {
    if (!recording) return;
    setIsRecording(false);
    setLoading(true);
    setError(null);
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);
      if (!uri) throw new Error('No recording found.');

      const audioUrl = await uploadImage(uri); // reuses the same upload service; backend accepts audio too
      const { data } = await ai.generateCatalog({
        audioUrl,
        sourceLanguage: voiceLanguage,
        detectedObject: params.detectedObject,
        material: params.material,
      });
      setTranscript(data.data.transcript || '');
      setOriginalTranscript(data.data.originalTranscript || null);
      setCatalog(data.data.catalog);
    } catch (err: any) {
      console.error('[CreateProduct] voice transcription failed:', err);
      setError(err?.response?.data?.message || err?.message || 'Voice transcription failed. Try typing instead.');
    } finally {
      setLoading(false);
    }
  };

  const runCataloger = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await ai.generateCatalog({
        transcript,
        detectedObject: params.detectedObject,
        material: params.material,
      });
      setCatalog(data.data.catalog);
    } catch (err: any) {
      console.error('[CreateProduct] generateCatalog failed:', err);
      setError(err?.response?.data?.message || err?.message || 'Failed to generate catalog. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const runPricing = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await ai.suggestPrice({
        category: catalog?.category,
        material: catalog?.material,
        rawMaterialEstimate: 320,
      });
      setSuggested(data.data.pricing);
      setPrice(String(Math.round((data.data.pricing.aiSuggestedMin + data.data.pricing.aiSuggestedMax) / 2)));
    } catch (err: any) {
      console.error('[CreateProduct] suggestPrice failed:', err);
      setError(err?.response?.data?.message || err?.message || 'Failed to get price suggestion. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const publish = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: created } = await api.post('/products', {
        title: catalog?.title,
        description: catalog?.description,
        category: catalog?.category,
        material: catalog?.material,
        craftType: catalog?.craftType,
        keywords: catalog?.keywords,
        images: params.imageUri ? [{ url: params.imageUri }] : [],
        pricing: {
          manufacturerPrice: Number(price),
          aiSuggestedMin: suggested?.aiSuggestedMin,
          aiSuggestedMax: suggested?.aiSuggestedMax,
          rawMaterialEstimate: suggested?.rawMaterialEstimate,
        },
      });
      await api.post(`/products/${created.data.product._id}/publish`);
      router.replace('/artisan/products');
    } catch (err: any) {
      console.error('[CreateProduct] publish failed:', err);
      setError(err?.response?.data?.message || err?.message || 'Failed to publish product. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: spacing.md }}>
      <Text style={styles.title}>Product Information</Text>

      {!!params.imageUri && <Image source={{ uri: params.imageUri }} style={styles.image} />}
      {error && <Text style={styles.errorText}>{error}</Text>}

      {!catalog && (
        <View>
          <Text style={styles.label}>Speak in your language</Text>
          <View style={styles.langRow}>
            {languages.map((l) => (
              <TouchableOpacity
                key={l.code}
                style={[styles.langChip, voiceLanguage === l.code && styles.langChipActive]}
                onPress={() => setVoiceLanguage(l.code)}
              >
                <Text style={[styles.langChipText, voiceLanguage === l.code && styles.langChipTextActive]}>{l.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.recordBtn, isRecording && styles.recordBtnActive]}
            onPress={isRecording ? stopRecordingAndTranscribe : startRecording}
            disabled={loading}
          >
            <Text style={[styles.recordBtnText, isRecording && styles.recordBtnTextActive]}>
              {isRecording ? '⏹ Stop & Transcribe' : loading ? 'Processing…' : '🎙 Record Voice Note'}
            </Text>
          </TouchableOpacity>
          {originalTranscript && originalTranscript !== transcript && (
            <Text style={styles.hint}>Original ({languages.find((l) => l.code === voiceLanguage)?.label}): {originalTranscript}</Text>
          )}

          <Text style={styles.label}>Or type your description directly</Text>
          <TextInput
            style={styles.textArea}
            multiline
            placeholder="e.g. Handmade terracotta pot, fired in a wood kiln…"
            value={transcript}
            onChangeText={setTranscript}
          />
          <Text style={styles.hint}>Supports {languages.map((l) => l.label).join(', ')} — speak, and the AI Cataloger writes the listing for you.</Text>
          <TouchableOpacity style={styles.primaryBtn} onPress={runCataloger} disabled={loading}>
            <Text style={styles.primaryBtnText}>{loading ? 'Generating…' : 'Generate Catalog with AI'}</Text>
          </TouchableOpacity>
        </View>
      )}

      {catalog && !suggested && (
        <View>
          <View style={styles.previewBox}>
            <Text style={styles.previewTitle}>{catalog.title}</Text>
            <Text style={styles.previewText}>{catalog.description.english}</Text>
            <Text style={styles.previewMeta}>{catalog.category} · {catalog.material}</Text>
          </View>
          <TouchableOpacity style={styles.primaryBtn} onPress={runPricing} disabled={loading}>
            <Text style={styles.primaryBtnText}>{loading ? 'Analyzing market…' : 'Get AI Price Suggestion'}</Text>
          </TouchableOpacity>
        </View>
      )}

      {suggested && (
        <View>
          <View style={styles.previewBox}>
            <Text style={styles.previewText}>
              AI Suggested Range: ₹{suggested.aiSuggestedMin} - ₹{suggested.aiSuggestedMax}
            </Text>
            <Text style={styles.previewText}>Similar products: {suggested.similarProducts.map((p: number) => `₹${p}`).join(' / ')}</Text>
            <Text style={styles.previewText}>Raw material estimate: ₹{suggested.rawMaterialEstimate}</Text>
          </View>
          <Text style={styles.label}>Your final selling price (you decide)</Text>
          <TextInput style={styles.priceInput} keyboardType="numeric" value={price} onChangeText={setPrice} />
          <TouchableOpacity style={styles.primaryBtn} onPress={publish} disabled={loading || !price}>
            <Text style={styles.primaryBtnText}>{loading ? 'Publishing…' : 'Confirm Price & Publish'}</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  title: { fontSize: 20, fontWeight: '800', color: colors.text, marginBottom: spacing.md },
  image: { width: '100%', height: 200, borderRadius: radius.md, marginBottom: spacing.md, backgroundColor: colors.card },
  label: { fontSize: 13, color: colors.muted, marginBottom: spacing.xs },
  errorText: { textAlign: 'center', color: '#B3261E', marginVertical: spacing.sm, fontWeight: '600' },
  hint: { fontSize: 12, color: colors.muted, marginBottom: spacing.md },
  textArea: {
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.md, padding: 14, minHeight: 100, textAlignVertical: 'top', marginBottom: spacing.sm,
  },
  priceInput: {
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.md, padding: 14, marginBottom: spacing.md, fontSize: 18, fontWeight: '700',
  },
  primaryBtn: { backgroundColor: colors.primary, borderRadius: radius.md, padding: 16, alignItems: 'center', marginBottom: spacing.md },
  primaryBtnText: { color: colors.white, fontWeight: '700' },
  previewBox: { backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.md },
  previewTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 4 },
  previewText: { fontSize: 13, color: colors.text, marginBottom: 4 },
  previewMeta: { fontSize: 12, color: colors.muted },
  langRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: spacing.sm },
  langChip: { borderWidth: 1, borderColor: colors.border, borderRadius: radius.pill, paddingVertical: 6, paddingHorizontal: 14 },
  langChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  langChipText: { fontSize: 13, color: colors.text },
  langChipTextActive: { color: colors.white, fontWeight: '700' },
  recordBtn: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.primary, borderRadius: radius.md, padding: 16, alignItems: 'center', marginBottom: spacing.md },
  recordBtnActive: { backgroundColor: '#B3261E', borderColor: '#B3261E' },
  recordBtnText: { color: colors.primaryDark, fontWeight: '700' },
  recordBtnTextActive: { color: colors.white },
});
