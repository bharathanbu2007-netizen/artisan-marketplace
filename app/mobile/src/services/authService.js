import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';

export async function register({ phone, name, role, preferredLanguage }) {
  const { data } = await api.post('/auth/register', { phone, name, role, preferredLanguage });
  return data;
}

export async function requestOtp(phone) {
  const { data } = await api.post('/auth/request-otp', { phone });
  return data;
}

export async function verifyOtp(phone, otp) {
  const { data } = await api.post('/auth/verify-otp', { phone, otp });
  if (data.token) {
    await AsyncStorage.setItem('auth_token', data.token);
    await AsyncStorage.setItem('auth_user', JSON.stringify(data.user));
  }
  return data;
}

export async function getStoredUser() {
  const raw = await AsyncStorage.getItem('auth_user');
  return raw ? JSON.parse(raw) : null;
}

export async function logout() {
  await AsyncStorage.multiRemove(['auth_token', 'auth_user']);
}
