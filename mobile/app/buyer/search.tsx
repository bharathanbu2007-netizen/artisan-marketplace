import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import api from '../../services/api';
import SearchBar from '../../components/SearchBar';
import ProductCard from '../../components/ProductCard';
import { colors, spacing } from '../../constants/theme';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const search = async () => {
    setError(null);
    try {
      const { data } = await api.get('/products', { params: { q: query, limit: 30 } });
      setResults(data.data.products);
    } catch (err: any) {
      console.error('[Search] failed:', err);
      setError(err?.response?.data?.message || err?.message || 'Search failed. Try again.');
    }
  };

  return (
    <View style={styles.container}>
      <SearchBar value={query} onChangeText={setQuery} onSubmit={search} />
      {error && <Text style={styles.errorText}>{error}</Text>}
      <FlatList
        data={results}
        keyExtractor={(item) => item._id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        renderItem={({ item }) => (
          <ProductCard product={item} onPress={() => router.push(`/buyer/product/${item._id}`)} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.md },
  errorText: { textAlign: 'center', color: '#B3261E', marginVertical: spacing.sm, fontWeight: '600' },
});
