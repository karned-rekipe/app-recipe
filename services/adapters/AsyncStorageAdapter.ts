import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AuthTokens } from '../../types/Auth';
import type { ITokenStorageAdapter } from '../interfaces/ITokenStorageAdapter';
import type { ICryptoService } from '../interfaces/ICryptoService';
import type { IStorageDetectionService } from '../interfaces/IStorageDetectionService';
import { StorageError } from '../SecureStorageService';

/**
 * Adaptateur de stockage utilisant AsyncStorage avec chiffrement
 * Responsabilité unique : Stockage persistant avec chiffrement via AsyncStorage
 */
export class AsyncStorageAdapter implements ITokenStorageAdapter {
  public readonly name = 'AsyncStorage (chiffré)';

  private readonly KEYS = {
    ACCESS_TOKEN: 'encrypted_access_token',
    REFRESH_TOKEN: 'encrypted_refresh_token'
  } as const;

  constructor(
    private readonly cryptoService: ICryptoService,
    private readonly storageDetection: IStorageDetectionService
  ) {}

  private maskToken(token: string): string {
    if (token.length <= 20) return '***';
    return `${token.substring(0, 10)}...${token.substring(token.length - 10)}`;
  }

  async isAvailable(): Promise<boolean> {
    return this.storageDetection.isAsyncStorageAvailable();
  }

  async storeTokens(tokens: AuthTokens): Promise<void> {
    try {
      console.log('🔐 [AsyncStorageAdapter] Chiffrement et stockage via AsyncStorage', {
        accessToken: this.maskToken(tokens.access_token),
        refreshToken: this.maskToken(tokens.refresh_token)
      });
      
      const encryptedAccess = this.cryptoService.encrypt(tokens.access_token);
      const encryptedRefresh = this.cryptoService.encrypt(tokens.refresh_token);
      
      await AsyncStorage.setItem(this.KEYS.ACCESS_TOKEN, encryptedAccess);
      await AsyncStorage.setItem(this.KEYS.REFRESH_TOKEN, encryptedRefresh);
      
      console.log('✅ [AsyncStorageAdapter] Tokens chiffrés et stockés avec succès');
    } catch (error) {
      console.error('❌ [AsyncStorageAdapter] Erreur lors du stockage:', error);
      throw new StorageError(
        'Erreur lors du stockage chiffré via AsyncStorage',
        error instanceof Error ? error.message : String(error)
      );
    }
  }

  async getTokens(): Promise<AuthTokens | null> {
    try {
      console.log('📖 [AsyncStorageAdapter] Récupération et déchiffrement via AsyncStorage');
      
      const encryptedAccess = await AsyncStorage.getItem(this.KEYS.ACCESS_TOKEN);
      const encryptedRefresh = await AsyncStorage.getItem(this.KEYS.REFRESH_TOKEN);

      if (!encryptedAccess || !encryptedRefresh) {
        console.log('ℹ️  [AsyncStorageAdapter] Tokens chiffrés non trouvés');
        return null;
      }

      const accessToken = this.cryptoService.decrypt(encryptedAccess);
      const refreshToken = this.cryptoService.decrypt(encryptedRefresh);

      console.log('✅ [AsyncStorageAdapter] Tokens déchiffrés et récupérés avec succès', {
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
      console.error('❌ [AsyncStorageAdapter] Erreur lors de la récupération:', error);
      return null;
    }
  }

  async clearTokens(): Promise<void> {
    try {
      console.log('🗑️  [AsyncStorageAdapter] Suppression des tokens chiffrés');
      
      await AsyncStorage.removeItem(this.KEYS.ACCESS_TOKEN);
      await AsyncStorage.removeItem(this.KEYS.REFRESH_TOKEN);
      
      console.log('✅ [AsyncStorageAdapter] Tokens chiffrés supprimés');
    } catch (error) {
      console.warn('⚠️  [AsyncStorageAdapter] Erreur lors de la suppression:', error);
      throw new StorageError(
        'Erreur lors de la suppression via AsyncStorage',
        error instanceof Error ? error.message : String(error)
      );
    }
  }
}
