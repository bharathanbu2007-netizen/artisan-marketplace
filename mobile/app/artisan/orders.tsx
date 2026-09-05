import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import api from '../../services/api';
import { colors, radius, spacing } from '../../constants/theme';

const STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

export default function ArtisanOrders() {
  const [orders, setOrders] = useState<any[]>([]);

  const load = async () => {
    const { data } = await api.get('/orders');
    setOrders(data.data.orders);
  };

  useEffect(() => { load(); }, []);

  const advance = async (id: string, current: string) => {
    const idx = STATUSES.indexOf(current);
    const next = STATUSES[Math.min(idx + 1, STATUSES.length - 2)];
    await api.patch(`/orders/${id}`, { status: next });
    load();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Orders</Text>
      <FlatList
        data={orders}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.orderId}>#{item._id.slice(-6)} · ₹{item.totalAmount}</Text>
            <Text style={styles.status}>{item.status}</Text>
            {item.status !== 'delivered' && item.status !== 'cancelled' && (
              <TouchableOpacity style={styles.advanceBtn} onPress={() => advance(item._id, item.status)}>
                <Text style={styles.advanceText}>Mark next stage</Text>
              </TouchableOpacity>
            )}
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
  status: { color: colors.primaryDark, marginVertical: 4 },
  advanceBtn: { backgroundColor: colors.primary, borderRadius: radius.pill, paddingVertical: 6, alignItems: 'center', marginTop: 4 },
  advanceText: { color: colors.white, fontSize: 12, fontWeight: '600' },
});
