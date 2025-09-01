/**
 * En-tête moderne pour l'écran de connexion
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';

export function LoginHeader() {
  return (
    <View style={styles.container}>
      {/* Logo ou icône */}
      <View style={styles.logoContainer}>
        <Ionicons 
          name="restaurant-outline" 
          size={48} 
          color="rgba(255, 255, 255, 0.9)" 
        />
      </View>
      
      {/* Titre de l'app */}
      <Text style={styles.appName}>Rekipe</Text>
      
      {/* Sous-titre minimaliste */}
      <Text style={styles.tagline}>Vos recettes</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 0.95)',
    marginBottom: 4,
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '300',
    letterSpacing: 0.5,
  },
});
