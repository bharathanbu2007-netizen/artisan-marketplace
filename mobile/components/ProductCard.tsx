import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, radius, spacing } from '../constants/theme';

type Props = {
  product: {
    _id: string;
    title: string;
    images?: { url: string }[];
    pricing?: { manufacturerPrice: number; currency?: string };
    artisanId?: { businessName?: string; verification?: { status: string } };
  };
  onPress?: () => void;
  onMessage?: () => void;
};

export default function ProductCard({ product, onPress, onMessage }: Props) {
  const image = product.images?.[0]?.url;
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      {image ? (
        <Image source={{ uri: image }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.placeholder]} />
      )}
      <Text style={styles.title} numberOfLines={1}>{product.title}</Text>
      <Text style={styles.price}>
        {product.pricing?.currency === 'INR' || !product.pricing?.currency ? '₹' : ''}
        {product.pricing?.manufacturerPrice}
      </Text>
      <View style={styles.row}>
        <Text style={styles.artisan} numberOfLines={1}>
          {product.artisanId?.businessName || 'Artisan'}
          {product.artisanId?.verification?.status === 'verified' ? ' ✓' : ''}
        </Text>
      </View>
      {onMessage && (
        <TouchableOpacity style={styles.messageBtn} onPress={onMessage}>
          <Text style={styles.messageBtnText}>Message Artisan</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 160,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.sm,
    marginRight: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  image: { width: '100%', height: 120, borderRadius: radius.sm, marginBottom: spacing.xs, backgroundColor: colors.card },
  placeholder: { alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 14, fontWeight: '600', color: colors.text },
  price: { fontSize: 15, fontWeight: '700', color: colors.primaryDark, marginTop: 2 },
  row: { flexDirection: 'row', marginTop: 4 },
  artisan: { fontSize: 12, color: colors.muted, flex: 1 },
  messageBtn: {
    marginTop: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingVertical: 6,
    alignItems: 'center',
  },
  messageBtnText: { color: colors.white, fontSize: 12, fontWeight: '600' },
});
