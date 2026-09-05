import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import api from '../../services/api';
import SearchBar from '../../components/SearchBar';
import ProductCard from '../../components/ProductCard';
import { colors, spacing } from '../../constants/theme';

export default function BuyerHome() {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [recommended, setRecommended] = useState<any[]>([]);

  const loadProducts = async () => {
    const { data } = await api.get('/products', { params: { limit: 20 } });
    setProducts(data.data.products);
    setRecommended(data.data.products.slice(0, 6));
  };

  useEffect(() => { loadProducts(); }, []);

  const search = async () => {
    const { data } = await api.get('/products', { params: { q: query, limit: 20 } });
    setProducts(data.data.products);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: spacing.md }}>
      <Text style={styles.greeting}>Discover Artisan Crafts</Text>
      <SearchBar value={query} onChangeText={setQuery} onSubmit={search} />

      <Text style={styles.sectionTitle}>AI Recommended for You</Text>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={recommended}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <ProductCard product={item} onPress={() => router.push(`/buyer/product/${item._id}`)} />
        )}
        style={{ marginBottom: spacing.lg }}
      />

      <Text style={styles.sectionTitle}>New Arrivals</Text>
      <View style={styles.grid}>
        {products.map((item) => (
          <View key={item._id} style={{ marginBottom: spacing.md }}>
            <ProductCard product={item} onPress={() => router.push(`/buyer/product/${item._id}`)} />
          </View>
        ))}
        {!products.length && <Text style={{ color: colors.muted }}>No products published yet.</Text>}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  greeting: { fontSize: 22, fontWeight: '800', color: colors.text, marginBottom: spacing.md },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: spacing.sm },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
});
