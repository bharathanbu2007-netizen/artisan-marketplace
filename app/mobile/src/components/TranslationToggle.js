import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SUPPORTED_LANGUAGES, COLORS } from '../utils/constants';

export default function TranslationToggle({ value, onChange }) {
  return (
    <View style={styles.row}>
      {SUPPORTED_LANGUAGES.map((lang) => (
        <TouchableOpacity
          key={lang.code}
          style={[styles.pill, value === lang.code && styles.pillActive]}
          onPress={() => onChange(lang.code)}
        >
          <Text style={[styles.label, value === lang.code && styles.labelActive]}>{lang.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8 },
  pill: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  pillActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  label: { color: COLORS.text, fontSize: 13 },
  labelActive: { color: '#fff', fontWeight: '600' },
});
