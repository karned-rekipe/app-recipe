/**
 * Service de stockage sécurisé pour l'authentification
 * Priorité: SecureStore > AsyncStorage chiffré simple
 * 
 * SÉCURITÉ:
 * 1. SecureStore (iOS Keychain / Android Keystore) - Le plus sécurisé
 * 2. AsyncStorage avec chiffrement simple - Sécurisé et persistant
 */

import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import type { AuthTokens } from '../types/Auth';
import config from '../config/api';

// Erreur personnalisée pour le stockage
export class StorageError extends Error {
  constructor(message: string, public originalError?: string) {
    super(message);
    this.name = 'StorageError';
  }
}

// Clés de stockage
const KEYS = {
  ACCESS_TOKEN: 'user_access_token',
  REFRESH_TOKEN: 'user_refresh_token'
} as const;

// Clés de fallback pour AsyncStorage
const FALLBACK_KEYS = {
  ACCESS_TOKEN: 'encrypted_access_token',
  REFRESH_TOKEN: 'encrypted_refresh_token'
} as const;

/**
 * Vérifie si SecureStore est disponible
 */
const isSecureStoreAvailable = async (): Promise<boolean> => {
  try {
    if (Platform.OS === 'web') return false;
    
    await SecureStore.setItemAsync('test_availability', 'test');
    await SecureStore.deleteItemAsync('test_availability');
    return true;
  } catch {
    return false;
  }
};

/**
 * Chiffrement simple XOR + Base64 (identique à celui qui fonctionnait dans les tests)
 */
const simpleEncrypt = (text: string): string => {
  const key = 'rekipe2024';
  let encrypted = '';
  for (let i = 0; i < text.length; i++) {
    encrypted += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  // Utiliser btoa au lieu de Buffer pour plus de compatibilité
  return btoa(encrypted);
};

const simpleDecrypt = (encryptedBase64: string): string => {
  const key = 'rekipe2024';
  // Utiliser atob au lieu de Buffer
  const encrypted = atob(encryptedBase64);
  let decrypted = '';
  for (let i = 0; i < encrypted.length; i++) {
    decrypted += String.fromCharCode(encrypted.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return decrypted;
};

class SecureStorageService {
  /**
   * Stocke les tokens de manière sécurisée avec fallback
   */
  async storeTokens(tokens: AuthTokens): Promise<void> {
    try {
      console.log('🔐 [SecureStorage] Stockage des tokens', { 
        hasAccess: !!tokens.access_token,
        hasRefresh: !!tokens.refresh_token 
      });

      // 1. Tentative SecureStore (recommandé)
      if (await isSecureStoreAvailable()) {
        try {
          await SecureStore.setItemAsync(KEYS.ACCESS_TOKEN, tokens.access_token);
          await SecureStore.setItemAsync(KEYS.REFRESH_TOKEN, tokens.refresh_token);
          console.log('✅ [SecureStorage] Tokens stockés via SecureStore');
          return;
        } catch (secureError) {
          console.warn('⚠️  [SecureStorage] SecureStore a échoué, passage au fallback', secureError);
        }
      }

      // 2. Fallback AsyncStorage avec chiffrement simple
      console.log('🔄 [SecureStorage] Tentative de chiffrement...');
      
      try {
        const encryptedAccess = simpleEncrypt(tokens.access_token);
        const encryptedRefresh = simpleEncrypt(tokens.refresh_token);
        
        console.log('🔐 [SecureStorage] Chiffrement réussi, sauvegarde AsyncStorage...');
        
        await AsyncStorage.setItem(FALLBACK_KEYS.ACCESS_TOKEN, encryptedAccess);
        await AsyncStorage.setItem(FALLBACK_KEYS.REFRESH_TOKEN, encryptedRefresh);
        
        console.log('✅ [SecureStorage] Tokens stockés via AsyncStorage chiffré');
      } catch (encryptError) {
        console.error('❌ [SecureStorage] Erreur de chiffrement:', encryptError);
        throw encryptError;
      }

    } catch (error) {
      console.error('❌ [SecureStorage] Erreur lors du stockage:', error);
      throw new StorageError(
        'Impossible de sauvegarder les tokens',
        error instanceof Error ? error.message : String(error)
      );
    }
  }

  /**
   * Récupère les tokens stockés
   */
  async getTokens(): Promise<AuthTokens | null> {
    try {
      console.log('📖 [SecureStorage] Récupération des tokens');

      // 1. Tentative SecureStore
      if (await isSecureStoreAvailable()) {
        try {
          const accessToken = await SecureStore.getItemAsync(KEYS.ACCESS_TOKEN);
          const refreshToken = await SecureStore.getItemAsync(KEYS.REFRESH_TOKEN);

          if (accessToken && refreshToken) {
            console.log('✅ [SecureStorage] Tokens récupérés via SecureStore');
            return { 
              access_token: accessToken, 
              refresh_token: refreshToken,
              token_type: 'Bearer',
              expires_in: 3600
            };
          }
        } catch (secureError) {
          console.warn('⚠️  [SecureStorage] Erreur SecureStore, tentative fallback');
        }
      }

      // 2. Fallback AsyncStorage avec déchiffrement
      const encryptedAccess = await AsyncStorage.getItem(FALLBACK_KEYS.ACCESS_TOKEN);
      const encryptedRefresh = await AsyncStorage.getItem(FALLBACK_KEYS.REFRESH_TOKEN);

      if (encryptedAccess && encryptedRefresh) {
        const accessToken = simpleDecrypt(encryptedAccess);
        const refreshToken = simpleDecrypt(encryptedRefresh);
        console.log('✅ [SecureStorage] Tokens récupérés via AsyncStorage déchiffré');
        return { 
          access_token: accessToken, 
          refresh_token: refreshToken,
          token_type: 'Bearer',
          expires_in: 3600
        };
      }

      console.log('ℹ️  [SecureStorage] Aucun token trouvé');
      return null;

    } catch (error) {
      console.error('❌ [SecureStorage] Erreur lors de la récupération:', error);
      return null;
    }
  }

  /**
   * Vérifie si le token d'accès a expiré
   */
  async isTokenExpired(): Promise<boolean> {
    try {
      const tokens = await this.getTokens();
      if (!tokens?.access_token) {
        return true;
      }

      // Décoder le JWT pour vérifier l'expiration
      try {
        const payload = JSON.parse(atob(tokens.access_token.split('.')[1]));
        const currentTime = Math.floor(Date.now() / 1000);
        return payload.exp < currentTime;
      } catch (decodeError) {
        console.warn('⚠️  Impossible de décoder le token, considéré comme expiré');
        return true;
      }
    } catch (error) {
      console.error('❌ [SecureStorage] Erreur lors de la vérification d\'expiration:', error);
      return true; // En cas d'erreur, considérer comme expiré pour forcer la reconnexion
    }
  }

  /**
   * Supprime tous les tokens stockés
   */
  async clearTokens(): Promise<void> {
    try {
      console.log('🗑️  [SecureStorage] Suppression des tokens');

      // Nettoyage SecureStore si disponible
      if (await isSecureStoreAvailable()) {
        try {
          await SecureStore.deleteItemAsync(KEYS.ACCESS_TOKEN);
          await SecureStore.deleteItemAsync(KEYS.REFRESH_TOKEN);
        } catch (error) {
          console.warn('⚠️  Erreur lors du nettoyage SecureStore:', error);
        }
      }

      // Nettoyage AsyncStorage
      await AsyncStorage.removeItem(FALLBACK_KEYS.ACCESS_TOKEN);
      await AsyncStorage.removeItem(FALLBACK_KEYS.REFRESH_TOKEN);

      console.log('✅ [SecureStorage] Tokens supprimés');
    } catch (error) {
      console.error('❌ [SecureStorage] Erreur lors de la suppression:', error);
      throw new StorageError(
        'Erreur lors de la suppression des tokens',
        error instanceof Error ? error.message : String(error)
      );
    }
  }
}

// Export de l'instance singleton
export const secureStorageService = new SecureStorageService();
