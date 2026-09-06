import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import api from '../../services/api';
import { colors, radius, spacing } from '../../constants/theme';

export default function BuyerOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get('/orders')
      .then(({ data }) => setOrders(data.data.orders))
      .catch((err) => {
        console.error('[BuyerOrders] load failed:', err);
        setError(err?.response?.data?.message || err?.message || 'Failed to load orders.');
      });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Orders</Text>
      {error && <Text style={styles.errorText}>{error}</Text>}
      <FlatList
        data={orders}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.orderId}>Order #{item._id.slice(-6)}</Text>
            <Text style={styles.status}>{item.status.toUpperCase()}</Text>
            <Text style={styles.total}>₹{item.totalAmount}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={{ color: colors.muted }}>No orders yet.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.md },
  title: { fontSize: 20, fontWeight: '800', color: colors.text, marginBottom: spacing.md },
  card: { backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.sm, borderWidth: 1, borderColor: colors.border },
  orderId: { fontWeight: '700', color: colors.text },
  status: { color: colors.primaryDark, marginTop: 2 },
  total: { marginTop: 4, fontWeight: '600' },
  errorText: { textAlign: 'center', color: '#B3261E', marginBottom: spacing.sm, fontWeight: '600' },
});
