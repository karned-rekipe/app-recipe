/**
 * Version de diagnostic du service de stockage sécurisé
 * Utilise un chiffrement simple pour isoler le problème
 */

import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import type { AuthTokens } from '../types/Auth';

const STORAGE_KEYS = {
  ACCESS_TOKEN: 'auth_access_token',
  REFRESH_TOKEN: 'auth_refresh_token',
  TOKEN_TYPE: 'auth_token_type',
  EXPIRES_IN: 'auth_expires_in',
  EXPIRY_TIME: 'auth_expiry_time',
} as const;

// Chiffrement simple pour le diagnostic (Base64 + clé simple)
const simpleKey = 'RecipeApp2024Key';

const simpleEncrypt = (text: string): string => {
  try {
    // Simple XOR + Base64 pour le diagnostic
    const encrypted = text.split('').map((char, i) => 
      String.fromCharCode(char.charCodeAt(0) ^ simpleKey.charCodeAt(i % simpleKey.length))
    ).join('');
    
    if (typeof btoa !== 'undefined') {
      return btoa(encrypted);
    } else {
      return Buffer.from(encrypted, 'utf8').toString('base64');
    }
  } catch (error) {
    console.error('Erreur chiffrement simple:', error);
    return text; // Fallback sans chiffrement pour diagnostic
  }
};

const simpleDecrypt = (encrypted: string): string => {
  try {
    let decoded: string;
    if (typeof atob !== 'undefined') {
      decoded = atob(encrypted);
    } else {
      decoded = Buffer.from(encrypted, 'base64').toString('utf8');
    }
    
    return decoded.split('').map((char, i) => 
      String.fromCharCode(char.charCodeAt(0) ^ simpleKey.charCodeAt(i % simpleKey.length))
    ).join('');
  } catch (error) {
    console.error('Erreur déchiffrement simple:', error);
    return encrypted; // Fallback sans déchiffrement
  }
};

/**
 * Service de diagnostic pour le stockage sécurisé
 */
export class DiagnosticStorageService {
  /**
   * Test de stockage avec diagnostics détaillés
   */
  async storeTokensWithDiagnosis(tokens: AuthTokens): Promise<boolean> {
    console.log('🔐 Début diagnostic stockage tokens...');
    console.log('🔍 Platform.OS:', Platform.OS);
    console.log('🔍 Tokens à stocker:', {
      access_token: tokens.access_token ? tokens.access_token.substring(0, 20) + '...' : 'undefined',
      refresh_token: tokens.refresh_token ? tokens.refresh_token.substring(0, 20) + '...' : 'undefined',
      token_type: tokens.token_type || 'undefined',
      expires_in: tokens.expires_in || 'undefined'
    });
    
    const expiryTime = Date.now() + (tokens.expires_in * 1000);
    
    try {
      if (Platform.OS === 'web') {
        console.log('🌐 Test localStorage (web)...');
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.access_token);
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refresh_token);
        localStorage.setItem(STORAGE_KEYS.TOKEN_TYPE, tokens.token_type);
        localStorage.setItem(STORAGE_KEYS.EXPIRES_IN, tokens.expires_in.toString());
        localStorage.setItem(STORAGE_KEYS.EXPIRY_TIME, expiryTime.toString());
        console.log('✅ localStorage réussi');
        return true;
      } else {
        console.log('📱 Test SecureStore...');
        try {
          await SecureStore.setItemAsync(STORAGE_KEYS.ACCESS_TOKEN, tokens.access_token);
          await SecureStore.setItemAsync(STORAGE_KEYS.REFRESH_TOKEN, tokens.refresh_token);
          await SecureStore.setItemAsync(STORAGE_KEYS.TOKEN_TYPE, tokens.token_type);
          await SecureStore.setItemAsync(STORAGE_KEYS.EXPIRES_IN, tokens.expires_in.toString());
          await SecureStore.setItemAsync(STORAGE_KEYS.EXPIRY_TIME, expiryTime.toString());
          console.log('✅ SecureStore réussi');
          return true;
        } catch (secureError: any) {
          console.log('❌ SecureStore échoué:', secureError.message);
          console.log('🔍 Type d\'erreur:', secureError.name);
          console.log('🔍 Code d\'erreur:', secureError.code);
          
          console.log('🔄 Fallback vers AsyncStorage...');
          try {
            await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, simpleEncrypt(tokens.access_token));
            await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, simpleEncrypt(tokens.refresh_token));
            await AsyncStorage.setItem(STORAGE_KEYS.TOKEN_TYPE, simpleEncrypt(tokens.token_type));
            await AsyncStorage.setItem(STORAGE_KEYS.EXPIRES_IN, simpleEncrypt(tokens.expires_in.toString()));
            await AsyncStorage.setItem(STORAGE_KEYS.EXPIRY_TIME, simpleEncrypt(expiryTime.toString()));
            console.log('✅ AsyncStorage + chiffrement simple réussi');
            return true;
          } catch (asyncError: any) {
            console.log('❌ AsyncStorage aussi échoué:', asyncError.message);
            console.log('🔍 Type d\'erreur AsyncStorage:', asyncError.name);
            
            console.log('🔄 Test AsyncStorage sans chiffrement...');
            try {
              await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.access_token);
              await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refresh_token);
              await AsyncStorage.setItem(STORAGE_KEYS.TOKEN_TYPE, tokens.token_type);
              await AsyncStorage.setItem(STORAGE_KEYS.EXPIRES_IN, tokens.expires_in.toString());
              await AsyncStorage.setItem(STORAGE_KEYS.EXPIRY_TIME, expiryTime.toString());
              console.log('⚠️ AsyncStorage sans chiffrement réussi (moins sécurisé)');
              return true;
            } catch (plainError: any) {
              console.log('💥 Tous les stockages ont échoué:', plainError.message);
              return false;
            }
          }
        }
      }
    } catch (globalError: any) {
      console.error('💥 Erreur globale stockage:', globalError.message);
      console.error('🔍 Stack:', globalError.stack);
      return false;
    }
  }

  /**
   * Test de récupération des tokens
   */
  async getStoredTokens(): Promise<AuthTokens | null> {
    console.log('📖 Test récupération tokens...');
    
    try {
      let accessToken: string | null;
      let refreshToken: string | null;
      let tokenType: string | null;
      let expiresIn: string | null;

      if (Platform.OS === 'web') {
        accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
        tokenType = localStorage.getItem(STORAGE_KEYS.TOKEN_TYPE);
        expiresIn = localStorage.getItem(STORAGE_KEYS.EXPIRES_IN);
        console.log('📖 Récupération depuis localStorage');
      } else {
        try {
          accessToken = await SecureStore.getItemAsync(STORAGE_KEYS.ACCESS_TOKEN);
          refreshToken = await SecureStore.getItemAsync(STORAGE_KEYS.REFRESH_TOKEN);
          tokenType = await SecureStore.getItemAsync(STORAGE_KEYS.TOKEN_TYPE);
          expiresIn = await SecureStore.getItemAsync(STORAGE_KEYS.EXPIRES_IN);
          console.log('📖 Récupération depuis SecureStore');
        } catch (secureError) {
          console.log('⚠️ SecureStore récupération échouée, test AsyncStorage...');
          try {
            const encryptedTokens = await Promise.all([
              AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN),
              AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN),
              AsyncStorage.getItem(STORAGE_KEYS.TOKEN_TYPE),
              AsyncStorage.getItem(STORAGE_KEYS.EXPIRES_IN),
            ]);
            
            accessToken = encryptedTokens[0] ? simpleDecrypt(encryptedTokens[0]) : null;
            refreshToken = encryptedTokens[1] ? simpleDecrypt(encryptedTokens[1]) : null;
            tokenType = encryptedTokens[2] ? simpleDecrypt(encryptedTokens[2]) : null;
            expiresIn = encryptedTokens[3] ? simpleDecrypt(encryptedTokens[3]) : null;
            console.log('📖 Récupération depuis AsyncStorage chiffré');
          } catch (decryptError) {
            console.log('⚠️ Déchiffrement échoué, test AsyncStorage sans chiffrement...');
            accessToken = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
            refreshToken = await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
            tokenType = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN_TYPE);
            expiresIn = await AsyncStorage.getItem(STORAGE_KEYS.EXPIRES_IN);
            console.log('📖 Récupération depuis AsyncStorage sans chiffrement');
          }
        }
      }

      if (!accessToken || !refreshToken) {
        console.log('❌ Tokens manquants');
        return null;
      }

      console.log('✅ Tokens récupérés:', {
        access_token: accessToken ? accessToken.substring(0, 20) + '...' : 'undefined',
        refresh_token: refreshToken ? refreshToken.substring(0, 20) + '...' : 'undefined',
        token_type: tokenType || 'undefined',
        expires_in: expiresIn || 'undefined'
      });

      return {
        access_token: accessToken,
        refresh_token: refreshToken,
        token_type: tokenType || 'bearer',
        expires_in: expiresIn ? parseInt(expiresIn, 10) : 3600,
      };
    } catch (error: any) {
      console.error('💥 Erreur récupération tokens:', error.message);
      return null;
    }
  }
}

export const diagnosticStorageService = new DiagnosticStorageService();

// Export pour utilisation en console
if (typeof window !== 'undefined') {
  (window as any).diagnosticStorageService = diagnosticStorageService;
  console.log('🔧 Service de diagnostic disponible dans window.diagnosticStorageService');
}
