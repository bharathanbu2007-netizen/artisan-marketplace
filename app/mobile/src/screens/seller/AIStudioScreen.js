import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import VoiceRecorder from '../../components/VoiceRecorder';
import { COLORS } from '../../utils/constants';

/**
 * AI Studio: the smart-cataloging entry point. A seller records a spoken
 * description in whichever language they're comfortable with, and the
 * backend's catalogFromVoice pipeline returns a structured, multilingual
 * title/description ready to prefill the Add Product form.
 */
export default function AIStudioScreen({ onCatalogReady }) {
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);

  async function handleRecorded(uri) {
    setProcessing(true);
    try {
      // In production: upload `uri` as multipart/form-data to
      // POST /api/ai/catalog/voice, then use the returned title/description/
      // translations to prefill the product form.
      // Kept as a manual call site here so AddProductScreen controls the flow.
      onCatalogReady ? await onCatalogReady(uri) : setResult({ note: 'Recording captured — ready to catalog.' });
    } catch (err) {
      Alert.alert('Cataloging failed', err.message);
    } finally {
      setProcessing(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AI Studio</Text>
      <Text style={styles.subtitle}>Describe your product out loud in any language — we'll auto-fill the listing.</Text>

      <View style={styles.recorderWrap}>
        <VoiceRecorder onRecorded={handleRecorded} />
        <Text style={styles.hint}>Hold to record</Text>
      </View>

      {processing && <ActivityIndicator style={{ marginTop: 16 }} color={COLORS.primary} />}
      {result && <Text style={styles.result}>{result.note}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', padding: 20 },
  title: { fontSize: 18, fontWeight: '700', color: COLORS.text },
  subtitle: { color: COLORS.muted, textAlign: 'center', marginTop: 6, marginBottom: 20 },
  recorderWrap: { alignItems: 'center' },
  hint: { color: COLORS.muted, marginTop: 8, fontSize: 12 },
  result: { marginTop: 14, color: COLORS.secondary },
});
