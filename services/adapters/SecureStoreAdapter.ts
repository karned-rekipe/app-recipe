import * as SecureStore from 'expo-secure-store';
import type { AuthTokens } from '../../types/Auth';
import type { ITokenStorageAdapter } from '../interfaces/ITokenStorageAdapter';
import type { IStorageDetectionService } from '../interfaces/IStorageDetectionService';
import { StorageError } from '../SecureStorageService';

/**
 * Adaptateur de stockage utilisant Expo SecureStore
 * Responsabilité unique : Stockage sécurisé via le Keychain iOS / Keystore Android
 */
export class SecureStoreAdapter implements ITokenStorageAdapter {
  public readonly name = 'SecureStore';

  private readonly KEYS = {
    ACCESS_TOKEN: 'user_access_token',
    REFRESH_TOKEN: 'user_refresh_token'
  } as const;

  constructor(private readonly storageDetection: IStorageDetectionService) {}

  private maskToken(token: string): string {
    if (token.length <= 20) return '***';
    return `${token.substring(0, 10)}...${token.substring(token.length - 10)}`;
  }

  async isAvailable(): Promise<boolean> {
    return this.storageDetection.isSecureStoreAvailable();
  }

  async storeTokens(tokens: AuthTokens): Promise<void> {
    try {
      console.log('🔐 [SecureStoreAdapter] Stockage via SecureStore', {
        accessToken: this.maskToken(tokens.access_token),
        refreshToken: this.maskToken(tokens.refresh_token)
      });
      
      await SecureStore.setItemAsync(this.KEYS.ACCESS_TOKEN, tokens.access_token);
      await SecureStore.setItemAsync(this.KEYS.REFRESH_TOKEN, tokens.refresh_token);
      
      console.log('✅ [SecureStoreAdapter] Tokens stockés avec succès');
    } catch (error) {
      console.error('❌ [SecureStoreAdapter] Erreur lors du stockage:', error);
      throw new StorageError(
        'Erreur lors du stockage via SecureStore',
        error instanceof Error ? error.message : String(error)
      );
    }
  }

  async getTokens(): Promise<AuthTokens | null> {
    try {
      console.log('📖 [SecureStoreAdapter] Récupération via SecureStore');
      
      const accessToken = await SecureStore.getItemAsync(this.KEYS.ACCESS_TOKEN);
      const refreshToken = await SecureStore.getItemAsync(this.KEYS.REFRESH_TOKEN);

      if (!accessToken || !refreshToken) {
        console.log('ℹ️  [SecureStoreAdapter] Tokens non trouvés');
        return null;
      }

      console.log('✅ [SecureStoreAdapter] Tokens récupérés avec succès', {
        accessToken: this.maskToken(accessToken),
        refreshToken: this.maskToken(refreshToken)
      });
      return {
        access_token: accessToken,
        refresh_token: refreshToken,
        token_type: 'Bearer',
        expires_in: 3600
      };
    } catch (error) {
      console.error('❌ [SecureStoreAdapter] Erreur lors de la récupération:', error);
      return null;
    }
  }

  async clearTokens(): Promise<void> {
    try {
      console.log('🗑️  [SecureStoreAdapter] Suppression des tokens');
      
      await SecureStore.deleteItemAsync(this.KEYS.ACCESS_TOKEN);
      await SecureStore.deleteItemAsync(this.KEYS.REFRESH_TOKEN);
      
      console.log('✅ [SecureStoreAdapter] Tokens supprimés');
    } catch (error) {
      console.warn('⚠️  [SecureStoreAdapter] Erreur lors de la suppression:', error);
      throw new StorageError(
        'Erreur lors de la suppression via SecureStore',
        error instanceof Error ? error.message : String(error)
      );
    }
  }
}
