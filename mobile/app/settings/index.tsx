import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '../../store/authStore';
import { colors, radius, spacing, languages } from '../../constants/theme';

export default function Settings() {
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Account</Text>
        <Text style={styles.value}>{user?.name} ({user?.role})</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>App language</Text>
        <Text style={styles.value}>{languages.map((l) => l.label).join(' · ')}</Text>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.md },
  title: { fontSize: 20, fontWeight: '800', color: colors.text, marginBottom: spacing.md },
  card: { backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.sm, borderWidth: 1, borderColor: colors.border },
  label: { color: colors.muted, fontSize: 12, marginBottom: 4 },
  value: { color: colors.text, fontWeight: '600' },
  logoutBtn: { backgroundColor: colors.danger, borderRadius: radius.md, padding: 14, alignItems: 'center', marginTop: spacing.md },
  logoutText: { color: colors.white, fontWeight: '700' },
});
