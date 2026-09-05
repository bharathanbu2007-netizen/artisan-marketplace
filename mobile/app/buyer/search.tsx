import React, { useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import api from '../../services/api';
import SearchBar from '../../components/SearchBar';
import ProductCard from '../../components/ProductCard';
import { colors, spacing } from '../../constants/theme';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);

  const search = async () => {
    const { data } = await api.get('/products', { params: { q: query, limit: 30 } });
    setResults(data.data.products);
  };

  return (
    <View style={styles.container}>
      <SearchBar value={query} onChangeText={setQuery} onSubmit={search} />
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
});
