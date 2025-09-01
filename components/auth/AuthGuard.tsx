/**
 * Composant de protection des routes
 * Vérifie l'authentification et redirige si nécessaire
 */

import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter, useSegments } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { theme } from '../../constants/theme';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    // Attendre que le chargement soit terminé
    if (isLoading) return;

    const currentRoute = segments.join('/');
    const isLoginScreen = currentRoute === 'login' || currentRoute.includes('login');

    if (!isAuthenticated && !isLoginScreen) {
      // L'utilisateur n'est pas authentifié et n'est pas sur l'écran de connexion
      router.replace('/login');
    } else if (isAuthenticated && isLoginScreen) {
      // L'utilisateur est authentifié mais sur un écran de connexion
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, isLoading, segments, router]);

  // Afficher un indicateur de chargement pendant la vérification
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background.white,
  },
});
