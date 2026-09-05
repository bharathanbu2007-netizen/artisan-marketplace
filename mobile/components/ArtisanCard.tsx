import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, radius, spacing } from '../constants/theme';

type Props = {
  artisan: {
    businessName: string;
    craftType?: string;
    location?: { village?: string; district?: string; state?: string };
    statistics?: { products?: number; orders?: number; rating?: number };
    verification?: { status: string };
  };
  onPress?: () => void;
};

export default function ArtisanCard({ artisan, onPress }: Props) {
  const place = [artisan.location?.village, artisan.location?.district, artisan.location?.state]
    .filter(Boolean)
    .join(', ');

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{artisan.businessName?.[0]?.toUpperCase() || 'A'}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>
          {artisan.businessName} {artisan.verification?.status === 'verified' ? '✓' : ''}
        </Text>
        <Text style={styles.craft}>{artisan.craftType}</Text>
        {!!place && <Text style={styles.location}>{place}</Text>}
        <Text style={styles.stats}>
          {artisan.statistics?.products ?? 0} products · {artisan.statistics?.orders ?? 0} orders · ⭐ {artisan.statistics?.rating ?? 0}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
  },
  avatar: {
    width: 48, height: 48, borderRadius: 24, backgroundColor: colors.card,
    alignItems: 'center', justifyContent: 'center', marginRight: spacing.md,
  },
  avatarText: { fontSize: 18, fontWeight: '700', color: colors.primaryDark },
  name: { fontSize: 15, fontWeight: '700', color: colors.text },
  craft: { fontSize: 13, color: colors.muted },
  location: { fontSize: 12, color: colors.muted },
  stats: { fontSize: 12, color: colors.primaryDark, marginTop: 2 },
});
