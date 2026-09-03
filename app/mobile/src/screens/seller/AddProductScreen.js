import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import AIStudioScreen from './AIStudioScreen';
import { COLORS, CATEGORIES } from '../../utils/constants';
import api from '../../services/api';

export default function AddProductScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [basePrice, setBasePrice] = useState('');
  const [suggestedPrice, setSuggestedPrice] = useState(null);
  const [saving, setSaving] = useState(false);

  async function fetchSuggestedPrice() {
    if (!basePrice) return;
    try {
      const { data } = await api.post('/ai/pricing/suggest', { category, basePrice: Number(basePrice), materials: [] });
      setSuggestedPrice(data.suggestedPrice);
    } catch (err) {
      // Non-fatal — seller can still enter price manually.
    }
  }

  async function handleSubmit() {
    if (!title || !basePrice) return Alert.alert('Title and price are required');
    setSaving(true);
    try {
      const form = new FormData();
      form.append('title', title);
      form.append('description', description);
      form.append('category', category);
      form.append('basePrice', basePrice);
      form.append('price', suggestedPrice || basePrice);

      await api.post('/seller/products', form, { headers: { 'Content-Type': 'multipart/form-data' } });
      Alert.alert('Product submitted for review');
      navigation.goBack();
    } catch (err) {
      Alert.alert('Could not create product', err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Add Product</Text>

      <AIStudioScreen
        onCatalogReady={async () => {
          Alert.alert('Voice captured', 'Upload it via AI Studio to auto-fill title & description (wire multipart upload to POST /api/ai/catalog/voice).');
        }}
      />

      <Text style={styles.label}>Title</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="e.g. Hand-painted Madhubani wall art" />

      <Text style={styles.label}>Description</Text>
      <TextInput style={[styles.input, styles.textArea]} value={description} onChangeText={setDescription} multiline placeholder="Describe the materials, technique, story" />

      <Text style={styles.label}>Category</Text>
      <View style={styles.chipRow}>
        {CATEGORIES.map((c) => (
          <TouchableOpacity key={c} style={[styles.chip, category === c && styles.chipActive]} onPress={() => setCategory(c)}>
            <Text style={[styles.chipText, category === c && styles.chipTextActive]}>{c}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Your price (₹)</Text>
      <TextInput
        style={styles.input}
        value={basePrice}
        onChangeText={setBasePrice}
        onBlur={fetchSuggestedPrice}
        keyboardType="numeric"
        placeholder="e.g. 1200"
      />
      {suggestedPrice != null && (
        <Text style={styles.suggestion}>AI suggested price: ₹{suggestedPrice}</Text>
      )}

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={saving}>
        <Text style={styles.submitText}>{saving ? 'Submitting…' : 'Submit for Review'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: 16 },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: COLORS.text, marginBottom: 12 },
  label: { color: COLORS.muted, marginTop: 16, marginBottom: 6 },
  input: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, padding: 12 },
  textArea: { minHeight: 90, textAlignVertical: 'top' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 999, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.surface },
  chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipText: { color: COLORS.text },
  chipTextActive: { color: '#fff', fontWeight: '700' },
  suggestion: { color: COLORS.secondary, marginTop: 8, fontWeight: '600' },
  submitButton: { marginTop: 28, marginBottom: 40, backgroundColor: COLORS.primary, padding: 16, borderRadius: 10 },
  submitText: { color: '#fff', textAlign: 'center', fontWeight: '700', fontSize: 16 },
});
