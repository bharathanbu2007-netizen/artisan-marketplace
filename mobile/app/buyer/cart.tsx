import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import { useCartStore } from '../../store/cartStore';
import api from '../../services/api';
import { colors, radius, spacing } from '../../constants/theme';

export default function CartScreen() {
  const { items, fetchCart, removeFromCart, total } = useCartStore();

  useEffect(() => { fetchCart(); }, []);

  const checkout = async () => {
    const orderItems = items.map((i) => ({ productId: i.productId, quantity: i.quantity }));
    await api.post('/orders', { items: orderItems, shippingAddress: {} });
    router.push('/buyer/orders');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Cart</Text>
      <FlatList
        data={items}
        keyExtractor={(item) => item.productId}
        renderItem={({ item }) => (
          <View style={styles.row}>
            {item.product?.images?.[0]?.url && (
              <Image source={{ uri: item.product.images[0].url }} style={styles.thumb} />
            )}
            <View style={{ flex: 1 }}>
              <Text style={styles.itemTitle}>{item.product?.title}</Text>
              <Text style={styles.itemPrice}>₹{item.product?.pricing?.manufacturerPrice} × {item.quantity}</Text>
            </View>
            <TouchableOpacity onPress={() => removeFromCart(item.productId)}>
              <Text style={styles.remove}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text style={{ color: colors.muted }}>Your cart is empty.</Text>}
      />
      <View style={styles.footer}>
        <Text style={styles.total}>Total: ₹{total()}</Text>
        <TouchableOpacity style={styles.checkoutBtn} onPress={checkout} disabled={!items.length}>
          <Text style={styles.checkoutText}>Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.md },
  title: { fontSize: 20, fontWeight: '800', color: colors.text, marginBottom: spacing.md },
  row: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface,
    borderRadius: radius.md, padding: spacing.sm, marginBottom: spacing.sm, borderWidth: 1, borderColor: colors.border,
  },
  thumb: { width: 56, height: 56, borderRadius: radius.sm, marginRight: spacing.sm, backgroundColor: colors.card },
  itemTitle: { fontSize: 14, fontWeight: '600', color: colors.text },
  itemPrice: { fontSize: 13, color: colors.muted },
  remove: { color: colors.danger, fontSize: 13 },
  footer: { borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing.md },
  total: { fontSize: 16, fontWeight: '700', marginBottom: spacing.sm },
  checkoutBtn: { backgroundColor: colors.primary, borderRadius: radius.md, padding: 14, alignItems: 'center' },
  checkoutText: { color: colors.white, fontWeight: '700' },
});
