import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { colors, radius, spacing } from '../constants/theme';

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
};

export default function SearchBar({ value, onChangeText, onSubmit, placeholder = 'Search products, artisans, crafts…' }: Props) {
  return (
    <View style={styles.container}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        style={styles.input}
        returnKeyType="search"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  input: { height: 44, fontSize: 15, color: colors.text },
});
