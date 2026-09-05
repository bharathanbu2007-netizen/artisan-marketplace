import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import api from '../../../services/api';
import { useCartStore } from '../../../store/cartStore';
import { useAuthStore } from '../../../store/authStore';
import { colors, radius, spacing } from '../../../constants/theme';

export default function ProductDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null);
  const addToCart = useCartStore((s) => s.addToCart);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    api.get(`/products/${id}`).then(({ data }) => setProduct(data.data.product));
  }, [id]);

  const messageArtisan = async () => {
    const artisanUserId = product.artisanId?.userId?._id || product.artisanId?.userId;
    const { data } = await api.post('/conversations', { otherUserId: artisanUserId, productId: product._id });
    router.push(`/chat/${data.data.conversation._id}`);
  };

  if (!product) return <View style={styles.container} />;

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: product.images?.[0]?.url }} style={styles.image} />
      <View style={{ padding: spacing.md }}>
        <Text style={styles.title}>{product.title}</Text>
        <Text style={styles.price}>₹{product.pricing?.manufacturerPrice}</Text>
        <Text style={styles.artisan}>
          {product.artisanId?.businessName} {product.artisanId?.verification?.status === 'verified' ? '✓ Verified' : ''}
        </Text>
        <Text style={styles.description}>{product.description?.english}</Text>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.secondaryBtn} onPress={messageArtisan}>
            <Text style={styles.secondaryBtnText}>Message Artisan</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={async () => {
              await addToCart(product._id, 1);
              router.push('/buyer/cart');
            }}
          >
            <Text style={styles.primaryBtnText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  image: { width: '100%', height: 320, backgroundColor: colors.card },
  title: { fontSize: 22, fontWeight: '800', color: colors.text },
  price: { fontSize: 20, fontWeight: '700', color: colors.primaryDark, marginTop: 4 },
  artisan: { fontSize: 14, color: colors.muted, marginTop: 6 },
  description: { fontSize: 14, color: colors.text, marginTop: spacing.md, lineHeight: 20 },
  actions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg },
  primaryBtn: { flex: 1, backgroundColor: colors.primary, borderRadius: radius.md, padding: 14, alignItems: 'center' },
  primaryBtnText: { color: colors.white, fontWeight: '700' },
  secondaryBtn: { flex: 1, borderWidth: 1, borderColor: colors.primary, borderRadius: radius.md, padding: 14, alignItems: 'center' },
  secondaryBtnText: { color: colors.primaryDark, fontWeight: '700' },
});
