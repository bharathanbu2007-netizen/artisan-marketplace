import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import api from '../../services/api';
import { colors, radius, spacing } from '../../constants/theme';

export default function Earnings() {
  const [orders, setOrders] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get('/orders')
      .then(({ data }) => setOrders(data.data.orders))
      .catch((err) => {
        console.error('[Earnings] load failed:', err);
        setError(err?.response?.data?.message || err?.message || 'Failed to load earnings.');
      });
  }, []);

  const total = orders.filter((o) => o.status === 'delivered').reduce((sum, o) => sum + o.totalAmount, 0);
  const pending = orders.filter((o) => o.status !== 'delivered' && o.status !== 'cancelled').reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Earnings</Text>
      {error && <Text style={styles.errorText}>{error}</Text>}
      <View style={styles.card}>
        <Text style={styles.label}>Delivered (paid out)</Text>
        <Text style={styles.value}>₹{total}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>In progress</Text>
        <Text style={styles.value}>₹{pending}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.md },
  title: { fontSize: 20, fontWeight: '800', color: colors.text, marginBottom: spacing.md },
  card: { backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.lg, marginBottom: spacing.sm, borderWidth: 1, borderColor: colors.border },
  label: { color: colors.muted, marginBottom: 6 },
  value: { fontSize: 22, fontWeight: '800', color: colors.primaryDark },
  errorText: { textAlign: 'center', color: '#B3261E', marginBottom: spacing.sm, fontWeight: '600' },
});
