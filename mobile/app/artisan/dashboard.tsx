import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import api from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import { colors, radius, spacing } from '../../constants/theme';

export default function ArtisanDashboard() {
  const user = useAuthStore((s) => s.user);
  const [stats, setStats] = useState({ products: 0, orders: 0, rating: 0 });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([api.get('/orders'), api.get('/products/mine')])
      .then(([ordersRes, productsRes]) => {
        setStats((prev) => ({
          ...prev,
          orders: ordersRes.data.data.orders.length,
          products: productsRes.data.data.products.length,
        }));
      })
      .catch((err) => {
        console.error('[ArtisanDashboard] load failed:', err);
        setError(err?.response?.data?.message || err?.message || 'Failed to load dashboard stats.');
      });
  }, []);

  const actions = [
    { label: 'AI Studio — Scan a Product', href: '/artisan/studio' },
    { label: 'My Products', href: '/artisan/products' },
    { label: 'Orders', href: '/artisan/orders' },
    { label: 'Earnings', href: '/artisan/earnings' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: spacing.md }}>
      <Text style={styles.greeting}>Welcome back, {user?.name?.split(' ')[0]}</Text>
      {error && <Text style={styles.errorText}>{error}</Text>}
      <View style={styles.statsRow}>
        <View style={styles.statCard}><Text style={styles.statValue}>{stats.products}</Text><Text style={styles.statLabel}>Products</Text></View>
        <View style={styles.statCard}><Text style={styles.statValue}>{stats.orders}</Text><Text style={styles.statLabel}>Orders</Text></View>
        <View style={styles.statCard}><Text style={styles.statValue}>{stats.rating}</Text><Text style={styles.statLabel}>Rating</Text></View>
      </View>

      {actions.map((a) => (
        <TouchableOpacity key={a.href} style={styles.actionCard} onPress={() => router.push(a.href as any)}>
          <Text style={styles.actionText}>{a.label}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  greeting: { fontSize: 20, fontWeight: '800', color: colors.text, marginBottom: spacing.md },
  statsRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
  statCard: { flex: 1, backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md, alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  statValue: { fontSize: 20, fontWeight: '800', color: colors.primaryDark },
  statLabel: { fontSize: 12, color: colors.muted },
  actionCard: { backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.sm },
  actionText: { fontSize: 15, fontWeight: '600', color: colors.text },
  errorText: { textAlign: 'center', color: '#B3261E', marginBottom: spacing.sm, fontWeight: '600' },
});
