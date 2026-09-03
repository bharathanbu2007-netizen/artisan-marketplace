import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet } from 'react-native';
import ProductCard from '../../components/ProductCard';
import LoadingState from '../../components/LoadingState';
import { COLORS, CATEGORIES } from '../../utils/constants';
import api from '../../services/api';
import { useAuthStore } from '../../store/authStore';

export default function HomeScreen({ navigation }) {
  const user = useAuthStore((s) => s.user);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const { data } = await api.get('/products', { params: { search, lang: user?.preferredLanguage || 'en' } });
      setProducts(data.products);
    } catch (e) {
      // Keep the list empty; a real app would surface a toast/error state here.
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [search]);

  if (loading && !products.length) return <LoadingState message="Finding handmade treasures…" />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Discover handmade crafts</Text>
      <TextInput
        style={styles.search}
        placeholder="Search products"
        value={search}
        onChangeText={setSearch}
      />
      <FlatList
        data={products}
        keyExtractor={(item) => item._id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        renderItem={({ item }) => (
          <ProductCard product={item} onPress={() => navigation.navigate('ProductDetail', { productId: item._id })} />
        )}
        ListEmptyComponent={<Text style={styles.empty}>No products yet — check back soon.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: 16 },
  title: { fontSize: 20, fontWeight: '700', color: COLORS.text, marginBottom: 12 },
  search: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    padding: 10,
    marginBottom: 14,
  },
  empty: { color: COLORS.muted, textAlign: 'center', marginTop: 40 },
});
