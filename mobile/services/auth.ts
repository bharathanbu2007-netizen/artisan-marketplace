import AsyncStorageShim from './asyncStorageShim';
import api from './api';

const TOKEN_KEY = 'artisan_marketplace_token';
const USER_KEY = 'artisan_marketplace_user';

export async function getToken(): Promise<string | null> {
  return AsyncStorageShim.getItem(TOKEN_KEY);
}

export async function login(email: string, password: string) {
  const { data } = await api.post('/auth/login', { email, password });
  await AsyncStorageShim.setItem(TOKEN_KEY, data.data.token);
  await AsyncStorageShim.setItem(USER_KEY, JSON.stringify(data.data.user));
  return data.data;
}

export async function register(payload: {
  name: string;
  email: string;
  phone?: string;
  password: string;
  role: 'buyer' | 'artisan';
  businessName?: string;
  craftType?: string;
}) {
  const { data } = await api.post('/auth/register', payload);
  await AsyncStorageShim.setItem(TOKEN_KEY, data.data.token);
  await AsyncStorageShim.setItem(USER_KEY, JSON.stringify(data.data.user));
  return data.data;
}

export async function logout() {
  await AsyncStorageShim.removeItem(TOKEN_KEY);
  await AsyncStorageShim.removeItem(USER_KEY);
}

export async function getStoredUser() {
  const raw = await AsyncStorageShim.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}
