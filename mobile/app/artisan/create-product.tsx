import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import * as ai from '../../services/ai';
import api from '../../services/api';
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

  const runCataloger = async () => {
    setLoading(true);
    try {
      const { data } = await ai.generateCatalog({
        transcript,
        detectedObject: params.detectedObject,
        material: params.material,
      });
      setCatalog(data.data.catalog);
    } finally {
      setLoading(false);
    }
  };

  const runPricing = async () => {
    setLoading(true);
    try {
      const { data } = await ai.suggestPrice({
        category: catalog?.category,
        material: catalog?.material,
        rawMaterialEstimate: 320,
      });
      setSuggested(data.data.pricing);
      setPrice(String(Math.round((data.data.pricing.aiSuggestedMin + data.data.pricing.aiSuggestedMax) / 2)));
    } finally {
      setLoading(false);
    }
  };

  const publish = async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: spacing.md }}>
      <Text style={styles.title}>Product Information</Text>

      {!!params.imageUri && <Image source={{ uri: params.imageUri }} style={styles.image} />}

      {!catalog && (
        <View>
          <Text style={styles.label}>Describe your product (type or use voice-to-text)</Text>
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
});
