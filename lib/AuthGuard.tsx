// lib/AuthGuard.tsx
import React, { ReactNode, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';

interface AuthGuardProps {
  children: ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('../(auth)/sign-in'); // redirect if not logged in
    }
  }, [user, loading]);

  if (loading || !user) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#A6192E" />
      </View>
    );
  }

  return <>{children}</>;
};
