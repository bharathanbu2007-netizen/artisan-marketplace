export const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api';
export const SOCKET_URL = process.env.EXPO_PUBLIC_SOCKET_URL || 'http://localhost:5000';

export const colors = {
  background: '#FBF6EF',
  surface: '#FFFFFF',
  card: '#F5E9DA',
  border: '#E3D5C1',
  text: '#2B2118',
  muted: '#7A6E60',
  primary: '#C9702F',
  primaryDark: '#8B5E3C',
  success: '#3C8F5C',
  danger: '#C0392B',
  white: '#FFFFFF',
};

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };

export const radius = { sm: 8, md: 14, lg: 20, pill: 999 };

export const backgroundOptions = ['Original', 'White', 'Beige', 'Studio', 'Transparent', 'AI Recommended'] as const;

export const languages = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'Hindi' },
  { code: 'ta', label: 'Tamil' },
];
