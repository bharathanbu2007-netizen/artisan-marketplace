import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { COLORS } from '../../utils/constants';
import * as authService from '../../services/authService';
import { useAuthStore } from '../../store/authStore';

export default function OTPScreen({ route }) {
  const { phone } = route.params;
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const loginSuccess = useAuthStore((s) => s.loginSuccess);

  async function handleVerify() {
    if (otp.length < 4) return Alert.alert('Enter the OTP you received');
    setLoading(true);
    try {
      const data = await authService.verifyOtp(phone, otp);
      loginSuccess(data.user); // triggers RootNavigator to switch to buyer/seller stack
    } catch (err) {
      Alert.alert('Verification failed', err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter OTP</Text>
      <Text style={styles.subtitle}>Sent to {phone}</Text>
      <TextInput
        style={styles.input}
        placeholder="6-digit code"
        keyboardType="number-pad"
        value={otp}
        onChangeText={setOtp}
        maxLength={6}
      />
      <TouchableOpacity style={styles.button} onPress={handleVerify} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Verifying…' : 'Verify'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: 24, justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: '700', color: COLORS.text },
  subtitle: { color: COLORS.muted, marginTop: 6, marginBottom: 24 },
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    padding: 14,
    fontSize: 20,
    letterSpacing: 6,
    textAlign: 'center',
  },
  button: { marginTop: 24, backgroundColor: COLORS.primary, padding: 16, borderRadius: 10 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: '700', fontSize: 16 },
});
