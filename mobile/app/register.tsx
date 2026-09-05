import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '../store/authStore';
import { colors, radius, spacing } from '../constants/theme';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'buyer' | 'artisan'>('buyer');
  const [businessName, setBusinessName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const registerUser = useAuthStore((s) => s.register);

  const handleRegister = async () => {
    setError('');
    setLoading(true);
    try {
      await registerUser({ name, email, password, role, businessName: role === 'artisan' ? businessName : undefined });
      router.replace('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      {!!error && <Text style={styles.error}>{error}</Text>}

      <View style={styles.roleRow}>
        <TouchableOpacity style={[styles.roleBtn, role === 'buyer' && styles.roleBtnActive]} onPress={() => setRole('buyer')}>
          <Text style={[styles.roleText, role === 'buyer' && styles.roleTextActive]}>I'm a Buyer</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.roleBtn, role === 'artisan' && styles.roleBtnActive]} onPress={() => setRole('artisan')}>
          <Text style={[styles.roleText, role === 'artisan' && styles.roleTextActive]}>I'm an Artisan</Text>
        </TouchableOpacity>
      </View>

      <TextInput style={styles.input} placeholder="Full name" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Email" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
      {role === 'artisan' && (
        <TextInput style={styles.input} placeholder="Business / craft name" value={businessName} onChangeText={setBusinessName} />
      )}

      <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Creating…' : 'Create Account'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: colors.background, padding: spacing.lg, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: '800', color: colors.primaryDark, textAlign: 'center', marginBottom: spacing.lg },
  roleRow: { flexDirection: 'row', marginBottom: spacing.lg, gap: spacing.sm },
  roleBtn: { flex: 1, padding: 12, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, alignItems: 'center' },
  roleBtnActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  roleText: { color: colors.text, fontWeight: '600' },
  roleTextActive: { color: colors.white },
  input: {
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.md, padding: 14, marginBottom: spacing.md, fontSize: 15,
  },
  button: { backgroundColor: colors.primary, borderRadius: radius.md, padding: 16, alignItems: 'center', marginTop: spacing.sm },
  buttonText: { color: colors.white, fontWeight: '700', fontSize: 15 },
  error: { color: colors.danger, marginBottom: spacing.md, textAlign: 'center' },
});
