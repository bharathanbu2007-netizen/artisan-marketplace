import React, { useEffect } from 'react';
import { Redirect } from 'expo-router';
import { useAuthStore } from '../store/authStore';
import Loading from '../components/Loading';

// Entry point: routes to the right home screen based on auth + role.
export default function Index() {
  const { user, isLoading } = useAuthStore();

  if (isLoading) return <Loading />;
  if (!user) return <Redirect href="/login" />;
  if (user.role === 'artisan') return <Redirect href="/artisan/dashboard" />;
  return <Redirect href="/buyer/home" />;
}
