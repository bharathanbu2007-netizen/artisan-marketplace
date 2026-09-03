import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import LoadingState from '../../components/LoadingState';
import { COLORS } from '../../utils/constants';
import api from '../../services/api';

const NEXT_STATUS = { placed: 'confirmed', confirmed: 'shipped', shipped: 'delivered' };

export default function SellerOrdersScreen() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    api.get('/seller/orders').then(({ data }) => setOrders(data.orders)).finally(() => setLoading(false));
  }, []);

  useFocusEffect(load);

  async function advanceStatus(order) {
    const next = NEXT_STATUS[order.status];
    if (!next) return;
    await api.patch(`/seller/orders/${order._id}/status`, { status: next });
    load();
  }

  if (loading) return <LoadingState message="Loading orders…" />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Orders</Text>
      <FlatList
        data={orders}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.orderId}>#{item._id.slice(-6).toUpperCase()}</Text>
            <Text style={styles.status}>{item.status}</Text>
            <Text style={styles.total}>₹{item.totalAmount}</Text>
            {NEXT_STATUS[item.status] && (
              <TouchableOpacity style={styles.advanceButton} onPress={() => advanceStatus(item)}>
                <Text style={styles.advanceText}>Mark as {NEXT_STATUS[item.status]}</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No orders yet.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: 16 },
  title: { fontSize: 20, fontWeight: '700', color: COLORS.text, marginBottom: 12 },
  card: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, padding: 14, marginBottom: 10 },
  orderId: { fontWeight: '700', color: COLORS.text },
  status: { color: COLORS.secondary, marginTop: 4, textTransform: 'capitalize' },
  total: { color: COLORS.primary, fontWeight: '700', marginTop: 4 },
  advanceButton: { marginTop: 10, backgroundColor: COLORS.primary, padding: 10, borderRadius: 8 },
  advanceText: { color: '#fff', textAlign: 'center', fontWeight: '600', fontSize: 13 },
  empty: { color: COLORS.muted, textAlign: 'center', marginTop: 40 },
});
