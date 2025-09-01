/**
 * Composant d'en-tête utilisateur pour afficher les infos de connexion
 */

import React from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { theme } from '../../constants/theme';

export function UserHeader() {
  const { user, signOut, isLoading } = useAuth();

  const handleSignOut = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Se déconnecter',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
            } catch {
              Alert.alert('Erreur', 'Problème lors de la déconnexion');
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.userInfo}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={20} color={theme.colors.white} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.welcomeText}>Bonjour,</Text>
          <Text style={styles.username}>
            {user?.username || 'Utilisateur'}
          </Text>
        </View>
      </View>
      
      <TouchableOpacity
        style={styles.signOutButton}
        onPress={handleSignOut}
        testID="sign-out-button"
      >
        <Ionicons name="log-out-outline" size={20} color={theme.colors.text.secondary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: theme.colors.background.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    justifyContent: 'center',
  },
  welcomeText: {
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  signOutButton: {
    padding: 8,
    borderRadius: 8,
  },
});
