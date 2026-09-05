import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '../../store/authStore';
import { colors, radius, spacing } from '../../constants/theme';

export default function BuyerProfile() {
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{user?.name}</Text>
      <Text style={styles.email}>{user?.email}</Text>
      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Log out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.lg },
  name: { fontSize: 20, fontWeight: '800', color: colors.text },
  email: { color: colors.muted, marginBottom: spacing.lg },
  button: { backgroundColor: colors.danger, borderRadius: radius.md, padding: 14, alignItems: 'center' },
  buttonText: { color: colors.white, fontWeight: '700' },
});
