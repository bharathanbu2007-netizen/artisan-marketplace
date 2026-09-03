import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';

export function useAuth() {
  const { user, isLoading, hydrate, loginSuccess, logout } = useAuthStore();

  useEffect(() => {
    hydrate();
  }, []);

  return { user, isLoading, loginSuccess, logout };
}
