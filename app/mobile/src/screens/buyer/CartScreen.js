import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import LoadingState from '../../components/LoadingState';
import { COLORS } from '../../utils/constants';
import api from '../../services/api';

export default function CartScreen() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/buyer/cart');
      setCart(data.cart);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  async function checkout() {
    try {
      await api.post('/buyer/orders', {
        shippingAddress: { line1: 'Default address', city: '', state: '', pincode: '' },
      });
      Alert.alert('Order placed!');
      load();
    } catch (err) {
      Alert.alert('Checkout failed', err.message);
    }
  }

  if (loading) return <LoadingState message="Loading your cart…" />;

  const items = cart?.items || [];
  const total = items.reduce((sum, i) => sum + i.priceAtAdd * i.quantity, 0);

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.product._id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.itemTitle}>{item.product.title}</Text>
            <Text style={styles.itemQty}>x{item.quantity}</Text>
            <Text style={styles.itemPrice}>₹{item.priceAtAdd * item.quantity}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Your cart is empty.</Text>}
      />
      {items.length > 0 && (
        <View style={styles.footer}>
          <Text style={styles.total}>Total: ₹{total}</Text>
          <TouchableOpacity style={styles.checkoutButton} onPress={checkout}>
            <Text style={styles.checkoutText}>Place Order</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: 16 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  itemTitle: { flex: 1, color: COLORS.text, fontWeight: '600' },
  itemQty: { color: COLORS.muted, marginHorizontal: 10 },
  itemPrice: { color: COLORS.primary, fontWeight: '700' },
  empty: { color: COLORS.muted, textAlign: 'center', marginTop: 40 },
  footer: { borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: 14 },
  total: { fontSize: 18, fontWeight: '700', color: COLORS.text, marginBottom: 10 },
  checkoutButton: { backgroundColor: COLORS.primary, padding: 15, borderRadius: 10 },
  checkoutText: { color: '#fff', textAlign: 'center', fontWeight: '700' },
});
