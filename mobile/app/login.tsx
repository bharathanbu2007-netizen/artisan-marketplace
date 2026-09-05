import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Link, router } from 'expo-router';
import { useAuthStore } from '../store/authStore';
import { colors, radius, spacing } from '../constants/theme';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((s) => s.login);

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      router.replace('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Text style={styles.title}>Artisan Marketplace</Text>
      <Text style={styles.subtitle}>Point → Scan → AI Creates → You Set the Price → Publish</Text>

      {!!error && <Text style={styles.error}>{error}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={colors.muted}
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor={colors.muted}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Signing in…' : 'Sign In'}</Text>
      </TouchableOpacity>

      <Link href="/register" style={styles.link}>
        <Text>Don't have an account? Register</Text>
      </Link>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.lg, justifyContent: 'center' },
  title: { fontSize: 26, fontWeight: '800', color: colors.primaryDark, textAlign: 'center' },
  subtitle: { fontSize: 13, color: colors.muted, textAlign: 'center', marginTop: 6, marginBottom: spacing.xl },
  input: {
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.md, padding: 14, marginBottom: spacing.md, fontSize: 15,
  },
  button: { backgroundColor: colors.primary, borderRadius: radius.md, padding: 16, alignItems: 'center', marginTop: spacing.sm },
  buttonText: { color: colors.white, fontWeight: '700', fontSize: 15 },
  error: { color: colors.danger, marginBottom: spacing.md, textAlign: 'center' },
  link: { marginTop: spacing.lg, alignSelf: 'center' },
});
