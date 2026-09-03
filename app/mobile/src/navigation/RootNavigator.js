import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/auth/SplashScreen';
import LanguageSelectScreen from '../screens/auth/LanguageSelectScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import OTPScreen from '../screens/auth/OTPScreen';
import BuyerNavigator from './BuyerNavigator';
import SellerNavigator from './SellerNavigator';
import { useAuth } from '../hooks/useAuth';
import LoadingState from '../components/LoadingState';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { user, isLoading } = useAuth();

  if (isLoading) return <LoadingState message="Starting Artisan Marketplace…" />;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <>
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="LanguageSelect" component={LanguageSelectScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="OTP" component={OTPScreen} />
          </>
        ) : user.role === 'seller' ? (
          <Stack.Screen name="SellerApp" component={SellerNavigator} />
        ) : (
          <Stack.Screen name="BuyerApp" component={BuyerNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
