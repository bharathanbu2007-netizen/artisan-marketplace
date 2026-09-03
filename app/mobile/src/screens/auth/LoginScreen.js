import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { COLORS } from '../../utils/constants';
import * as authService from '../../services/authService';

export default function LoginScreen({ navigation, route }) {
  const preferredLanguage = route.params?.preferredLanguage || 'en';
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('buyer');
  const [loading, setLoading] = useState(false);

  async function handleContinue() {
    if (!phone) return Alert.alert('Enter your phone number');
    setLoading(true);
    try {
      // Try registering (idempotent-ish on the backend); if the account
      // already exists we simply proceed to OTP request.
      if (name) {
        try {
          await authService.register({ phone, name, role, preferredLanguage });
        } catch (e) {
          // Already registered — fine, continue to OTP.
        }
      }
      await authService.requestOtp(phone);
      navigation.navigate('OTP', { phone });
    } catch (err) {
      Alert.alert('Something went wrong', err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome</Text>

      <Text style={styles.label}>Phone number</Text>
      <TextInput
        style={styles.input}
        placeholder="+91XXXXXXXXXX"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />

      <Text style={styles.label}>Name (first time only)</Text>
      <TextInput style={styles.input} placeholder="Your name" value={name} onChangeText={setName} />

      <Text style={styles.label}>I am a</Text>
      <View style={styles.roleRow}>
        {['buyer', 'seller'].map((r) => (
          <TouchableOpacity key={r} style={[styles.roleChip, role === r && styles.roleChipActive]} onPress={() => setRole(r)}>
            <Text style={[styles.roleText, role === r && styles.roleTextActive]}>{r === 'buyer' ? 'Buyer' : 'Artisan / Seller'}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleContinue} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Please wait…' : 'Send OTP'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: 24, justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: '700', color: COLORS.text, marginBottom: 24 },
  label: { color: COLORS.muted, marginBottom: 6, marginTop: 12 },
  input: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, padding: 12 },
  roleRow: { flexDirection: 'row', gap: 10 },
  roleChip: { flex: 1, padding: 12, borderRadius: 10, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center' },
  roleChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  roleText: { color: COLORS.text },
  roleTextActive: { color: '#fff', fontWeight: '700' },
  button: { marginTop: 28, backgroundColor: COLORS.primary, padding: 16, borderRadius: 10 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: '700', fontSize: 16 },
});
