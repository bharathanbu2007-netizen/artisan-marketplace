import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import LoadingState from '../../components/LoadingState';
import { COLORS } from '../../utils/constants';
import api from '../../services/api';

export default function SellerDashboard({ navigation }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      api.get('/seller/products').then(({ data }) => setProducts(data.products)).finally(() => setLoading(false));
    }, [])
  );

  if (loading) return <LoadingState message="Loading your shop…" />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Seller Dashboard</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddProduct')}>
          <Text style={styles.addButtonText}>+ Add Product</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={products}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.productTitle}>{item.title}</Text>
            <View style={styles.rowBetween}>
              <Text style={[styles.badge, statusStyle(item.status)]}>{item.status.replace('_', ' ')}</Text>
              <Text style={styles.price}>₹{item.price}</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No listings yet. Add your first product!</Text>}
      />
    </View>
  );
}

function statusStyle(status) {
  if (status === 'active') return { color: COLORS.success };
  if (status === 'rejected') return { color: COLORS.danger };
  return { color: COLORS.muted };
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  title: { fontSize: 20, fontWeight: '700', color: COLORS.text },
  addButton: { backgroundColor: COLORS.primary, paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20 },
  addButtonText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  card: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, padding: 14, marginBottom: 10 },
  productTitle: { fontWeight: '600', color: COLORS.text, marginBottom: 6 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between' },
  badge: { textTransform: 'capitalize', fontSize: 12, fontWeight: '600' },
  price: { color: COLORS.primary, fontWeight: '700' },
  empty: { color: COLORS.muted, textAlign: 'center', marginTop: 40 },
});
