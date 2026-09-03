import Constants from 'expo-constants';

export const API_URL = Constants.expoConfig?.extra?.apiUrl || 'http://localhost:4000/api';
export const SOCKET_URL = Constants.expoConfig?.extra?.socketUrl || 'http://localhost:4000';

export const COLORS = {
  primary: '#B5651D',      // terracotta - evokes handcraft/pottery
  primaryDark: '#8C4A14',
  secondary: '#4A7C59',    // artisan green
  background: '#FFF8F0',
  surface: '#FFFFFF',
  text: '#2B2118',
  muted: '#8A7A6D',
  border: '#EBDFCF',
  danger: '#B3261E',
  success: '#2E7D32',
};

export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'ta', label: 'தமிழ்' },
];

export const CATEGORIES = ['Textiles', 'Pottery', 'Jewelry', 'Woodwork', 'Painting'];
