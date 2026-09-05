import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { colors, radius, spacing, backgroundOptions } from '../constants/theme';

type Props = {
  imageUri: string;
  onConfirm: (background: string) => void;
};

/**
 * Preview + background picker for the AI Studio "Automatic Product Photo
 * Editor" step. The actual pixel transform (background removal, lighting,
 * crop) happens server-side (see backend/src/services/image) — this
 * component just lets the artisan pick a look and confirm.
 */
export default function ImageEditor({ imageUri, onConfirm }: Props) {
  const [selected, setSelected] = useState<string>('AI Recommended');

  return (
    <View style={styles.container}>
      <Image source={{ uri: imageUri }} style={styles.preview} />
      <Text style={styles.label}>Choose a background</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: spacing.md }}>
        {backgroundOptions.map((bg) => (
          <TouchableOpacity
            key={bg}
            onPress={() => setSelected(bg)}
            style={[styles.chip, selected === bg && styles.chipActive]}
          >
            <Text style={[styles.chipText, selected === bg && styles.chipTextActive]}>{bg}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <TouchableOpacity style={styles.confirmBtn} onPress={() => onConfirm(selected)}>
        <Text style={styles.confirmText}>Use this look</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.md },
  preview: { width: '100%', height: 260, borderRadius: radius.md, backgroundColor: colors.card, marginBottom: spacing.md },
  label: { fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: spacing.sm },
  chip: {
    paddingVertical: 8, paddingHorizontal: 14, borderRadius: radius.pill,
    borderWidth: 1, borderColor: colors.border, marginRight: 8, backgroundColor: colors.surface,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: 13, color: colors.text },
  chipTextActive: { color: colors.white, fontWeight: '600' },
  confirmBtn: { backgroundColor: colors.primaryDark, borderRadius: radius.md, paddingVertical: 14, alignItems: 'center' },
  confirmText: { color: colors.white, fontWeight: '700' },
});
