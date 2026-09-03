import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS } from '../../utils/constants';

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => navigation.replace('LanguageSelect'), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>🧶 Artisan Marketplace</Text>
      <Text style={styles.tagline}>Handcraft meets the world</Text>
      <ActivityIndicator style={{ marginTop: 24 }} color={COLORS.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.background },
  logo: { fontSize: 24, fontWeight: '700', color: COLORS.primary },
  tagline: { marginTop: 8, color: COLORS.muted },
});
