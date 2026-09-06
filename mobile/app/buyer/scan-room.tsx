import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, FlatList } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import * as ai from '../../services/ai';
import { uploadImage } from '../../services/upload';
import api from '../../services/api';
import ProductCard from '../../components/ProductCard';
import { colors, radius, spacing } from '../../constants/theme';

/**
 * Buyer-side "Match My Space" — the buyer photographs a room, shelf, or
 * wall where they want to place a product. The AI Scene analyzer (the same
 * one artisans use to pick a background for their product photos) looks at
 * the surface/lighting and recommends a category + background style, and
 * this screen then pulls matching products from that category.
 */
export default function ScanRoom() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [scene, setScene] = useState<any>(null);
  const [matches, setMatches] = useState<any[]>([]);
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

    if (result.canceled) return;

    const uri = result.assets[0].uri;
    setImageUri(uri);
    setError(null);
    setScene(null);
    setMatches([]);
    setLoading(true);
    try {
      const uploadedUrl = await uploadImage(uri);
      const { data: sceneData } = await ai.analyzeScene(uploadedUrl);
      const sceneResult = sceneData.data.scene ?? sceneData.data;
      setScene(sceneResult);

      const { data: productData } = await api.get('/products', {
        params: { category: sceneResult.recommendedCategory, limit: 12 },
      });
      setMatches(productData.data.products);
    } catch (err: any) {
      console.error('[ScanRoom] scan failed:', err);
      setError(
        err?.response?.data?.message || err?.message || 'Could not analyze this photo. Try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: spacing.md }}>
      <Text style={styles.title}>Match My Space</Text>
      <Text style={styles.subtitle}>
        Take a photo of a room, shelf, or wall — AI will suggest handcrafted pieces that fit.
      </Text>

      {imageUri && <Image source={{ uri: imageUri }} style={styles.preview} />}

      <TouchableOpacity style={styles.primaryBtn} onPress={() => pickImage(true)}>
        <Text style={styles.primaryBtnText}>📷 Scan a Space</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.secondaryBtn} onPress={() => pickImage(false)}>
        <Text style={styles.secondaryBtnText}>Choose from Gallery</Text>
      </TouchableOpacity>

      {loading && <Text style={styles.loadingText}>Analyzing your space…</Text>}
      {error && <Text style={styles.errorText}>{error}</Text>}

      {scene && !loading && (
        <View style={styles.sceneBox}>
          <Text style={styles.sceneText}>💡 {scene.suggestion}</Text>
        </View>
      )}

      {matches.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Recommended for this space</Text>
          <View style={styles.grid}>
            {matches.map((item) => (
              <View key={item._id} style={{ marginBottom: spacing.md }}>
                <ProductCard product={item} onPress={() => router.push(`/buyer/product/${item._id}`)} />
              </View>
            ))}
          </View>
        </>
      )}

      {scene && !loading && matches.length === 0 && (
        <Text style={{ color: colors.muted, marginTop: spacing.md }}>
          No published products match "{scene.recommendedCategory}" yet — check back soon.
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  title: { fontSize: 20, fontWeight: '800', color: colors.text, marginBottom: spacing.sm },
  subtitle: { fontSize: 14, color: colors.muted, marginBottom: spacing.lg },
  preview: { width: '100%', height: 200, borderRadius: radius.md, marginBottom: spacing.md, backgroundColor: colors.card },
  primaryBtn: { backgroundColor: colors.primary, borderRadius: radius.md, padding: 16, alignItems: 'center', marginBottom: spacing.sm },
  primaryBtnText: { color: colors.white, fontWeight: '700' },
  secondaryBtn: { borderWidth: 1, borderColor: colors.primary, borderRadius: radius.md, padding: 16, alignItems: 'center' },
  secondaryBtnText: { color: colors.primaryDark, fontWeight: '700' },
  loadingText: { textAlign: 'center', color: colors.muted, marginVertical: spacing.lg },
  errorText: { textAlign: 'center', color: '#B3261E', marginVertical: spacing.sm, fontWeight: '600' },
  sceneBox: { backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.md, marginVertical: spacing.md },
  sceneText: { fontSize: 13, color: colors.text },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginTop: spacing.md, marginBottom: spacing.sm },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
});
