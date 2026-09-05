import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import api from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import { colors, radius, spacing } from '../../constants/theme';

export default function ArtisanProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const user = useAuthStore((s) => s.user);

  const load = async () => {
    // In production, add GET /api/artisans/me/products (or filter client-side
    // after fetching your own artisan profile id) — here we reuse the public
    // artisan-products endpoint once you have your artisanId.
    const { data } = await api.get('/products', { params: { limit: 50 } });
    setProducts(data.data.products);
  };

  useEffect(() => { load(); }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Products</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => router.push('/artisan/create-product')}>
          <Text style={styles.addBtnText}>+ New</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={products}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.itemPrice}>₹{item.pricing?.manufacturerPrice}</Text>
            <Text style={styles.itemStatus}>{item.status}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={{ color: colors.muted }}>No products yet — scan one in AI Studio.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.md },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  title: { fontSize: 20, fontWeight: '800', color: colors.text },
  addBtn: { backgroundColor: colors.primary, borderRadius: radius.pill, paddingHorizontal: 14, paddingVertical: 8 },
  addBtnText: { color: colors.white, fontWeight: '700' },
  row: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: colors.surface, padding: spacing.sm, borderRadius: radius.md, marginBottom: spacing.sm, borderWidth: 1, borderColor: colors.border },
  itemTitle: { flex: 1, fontWeight: '600', color: colors.text },
  itemPrice: { fontWeight: '700', color: colors.primaryDark, marginRight: spacing.sm },
  itemStatus: { color: colors.muted, fontSize: 12 },
});
