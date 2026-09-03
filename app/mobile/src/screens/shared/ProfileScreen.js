import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../../utils/constants';
import { useAuthStore } from '../../store/authStore';

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();

  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{user?.name?.[0]?.toUpperCase() || '?'}</Text>
      </View>
      <Text style={styles.name}>{user?.name}</Text>
      <Text style={styles.phone}>{user?.phone}</Text>
      <Text style={styles.role}>{user?.role === 'seller' ? 'Artisan / Seller' : 'Buyer'}</Text>

      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>Log out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, alignItems: 'center', padding: 24, paddingTop: 60 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  avatarText: { color: '#fff', fontSize: 28, fontWeight: '700' },
  name: { fontSize: 20, fontWeight: '700', color: COLORS.text },
  phone: { color: COLORS.muted, marginTop: 4 },
  role: { color: COLORS.secondary, marginTop: 4, fontWeight: '600' },
  logoutButton: { marginTop: 40, borderWidth: 1, borderColor: COLORS.danger, paddingVertical: 12, paddingHorizontal: 24, borderRadius: 10 },
  logoutText: { color: COLORS.danger, fontWeight: '700' },
});
