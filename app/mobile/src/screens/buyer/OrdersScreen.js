import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import LoadingState from '../../components/LoadingState';
import { COLORS } from '../../utils/constants';
import api from '../../services/api';

export default function OrdersScreen() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      api.get('/buyer/orders').then(({ data }) => setOrders(data.orders)).finally(() => setLoading(false));
    }, [])
  );

  if (loading) return <LoadingState message="Loading your orders…" />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Orders</Text>
      <FlatList
        data={orders}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.orderId}>Order #{item._id.slice(-6).toUpperCase()}</Text>
            <Text style={styles.status}>{item.status}</Text>
            <Text style={styles.total}>₹{item.totalAmount}</Text>
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
  empty: { color: COLORS.muted, textAlign: 'center', marginTop: 40 },
});
