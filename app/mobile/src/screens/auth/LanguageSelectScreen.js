import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SUPPORTED_LANGUAGES, COLORS } from '../../utils/constants';

export default function LanguageSelectScreen({ navigation }) {
  const [selected, setSelected] = useState('en');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose your language</Text>
      {SUPPORTED_LANGUAGES.map((lang) => (
        <TouchableOpacity
          key={lang.code}
          style={[styles.option, selected === lang.code && styles.optionSelected]}
          onPress={() => setSelected(lang.code)}
        >
          <Text style={[styles.optionText, selected === lang.code && styles.optionTextSelected]}>{lang.label}</Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity
        style={styles.continueButton}
        onPress={() => navigation.navigate('Login', { preferredLanguage: selected })}
      >
        <Text style={styles.continueText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: 24, justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: '700', color: COLORS.text, marginBottom: 24, textAlign: 'center' },
  option: {
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    marginBottom: 12,
  },
  optionSelected: { borderColor: COLORS.primary, backgroundColor: '#FCEEE0' },
  optionText: { fontSize: 16, color: COLORS.text, textAlign: 'center' },
  optionTextSelected: { color: COLORS.primary, fontWeight: '700' },
  continueButton: { marginTop: 16, backgroundColor: COLORS.primary, padding: 16, borderRadius: 10 },
  continueText: { color: '#fff', textAlign: 'center', fontWeight: '700', fontSize: 16 },
});
