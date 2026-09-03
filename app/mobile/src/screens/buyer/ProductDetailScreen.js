import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import LoadingState from '../../components/LoadingState';
import { COLORS } from '../../utils/constants';
import api from '../../services/api';
import { useAuthStore } from '../../store/authStore';

export default function ProductDetailScreen({ route, navigation }) {
  const { productId } = route.params;
  const user = useAuthStore((s) => s.user);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/products/${productId}`, { params: { lang: user?.preferredLanguage || 'en' } })
      .then(({ data }) => setProduct(data.product))
      .finally(() => setLoading(false));
  }, [productId]);

  async function addToCart() {
    try {
      await api.post('/buyer/cart', { productId, quantity: 1 });
      Alert.alert('Added to cart');
    } catch (err) {
      Alert.alert('Could not add to cart', err.message);
    }
  }

  async function messageSeller() {
    try {
      const { data } = await api.post('/chat/conversations', { sellerId: product.seller._id, productId });
      navigation.navigate('Chat', { conversationId: data.conversation._id, sellerName: product.seller.name });
    } catch (err) {
      Alert.alert('Could not start chat', err.message);
    }
  }

  if (loading || !product) return <LoadingState message="Loading product…" />;

  const imageUri = product.enhancedImages?.[0] || product.images?.[0];

  return (
    <ScrollView style={styles.container}>
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.imagePlaceholder]}>
          <Text style={{ color: COLORS.muted }}>No image</Text>
        </View>
      )}
      <View style={styles.body}>
        <Text style={styles.title}>{product.title}</Text>
        <Text style={styles.seller}>by {product.seller?.name}</Text>
        <Text style={styles.price}>₹{product.price}</Text>
        <Text style={styles.description}>{product.description}</Text>

        <TouchableOpacity style={styles.primaryButton} onPress={addToCart}>
          <Text style={styles.primaryButtonText}>Add to Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton} onPress={messageSeller}>
          <Text style={styles.secondaryButtonText}>Message Seller</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  image: { width: '100%', height: 280, backgroundColor: COLORS.border },
  imagePlaceholder: { alignItems: 'center', justifyContent: 'center' },
  body: { padding: 20 },
  title: { fontSize: 22, fontWeight: '700', color: COLORS.text },
  seller: { color: COLORS.muted, marginTop: 4 },
  price: { fontSize: 20, color: COLORS.primary, fontWeight: '700', marginTop: 10 },
  description: { color: COLORS.text, marginTop: 14, lineHeight: 20 },
  primaryButton: { marginTop: 24, backgroundColor: COLORS.primary, padding: 15, borderRadius: 10 },
  primaryButtonText: { color: '#fff', textAlign: 'center', fontWeight: '700' },
  secondaryButton: { marginTop: 10, padding: 15, borderRadius: 10, borderWidth: 1, borderColor: COLORS.primary },
  secondaryButtonText: { color: COLORS.primary, textAlign: 'center', fontWeight: '700' },
});
