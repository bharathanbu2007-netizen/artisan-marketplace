import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../utils/constants';

export default function ProductCard({ product, onPress }) {
  const imageUri = product.enhancedImages?.[0] || product.images?.[0];
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.imagePlaceholder]}>
          <Text style={styles.placeholderText}>No image</Text>
        </View>
      )}
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>{product.title}</Text>
        <Text style={styles.category}>{product.category}</Text>
        <Text style={styles.price}>₹{product.price}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    marginBottom: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  image: { width: '100%', height: 130, backgroundColor: COLORS.border },
  imagePlaceholder: { alignItems: 'center', justifyContent: 'center' },
  placeholderText: { color: COLORS.muted, fontSize: 12 },
  info: { padding: 8 },
  title: { fontWeight: '600', color: COLORS.text, fontSize: 14 },
  category: { color: COLORS.muted, fontSize: 12, marginTop: 2 },
  price: { color: COLORS.primary, fontWeight: '700', marginTop: 4 },
});
