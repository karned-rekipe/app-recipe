/**
 * Service de stockage sécurisé selon le principe SRP
 * Responsabilité unique : Orchestrer le stockage de tokens en utilisant le meilleur adaptateur disponible
 * 
 * Architecture:
 * - Utilise une stratégie de fallback (SecureStore → AsyncStorage chiffré)
 * - Délègue les responsabilités spécifiques aux services appropriés
 * - Respecte le principe de responsabilité unique
 */

import type { AuthTokens } from '../types/Auth';
import type { ITokenStorageAdapter } from './interfaces/ITokenStorageAdapter';
import type { ITokenValidator } from './interfaces/ITokenValidator';

import { StorageDetectionService } from './storage/StorageDetectionService';
import { SimpleCryptoService } from './crypto/SimpleCryptoService';
import { TokenValidator } from './validation/TokenValidator';
import { SecureStoreAdapter } from './adapters/SecureStoreAdapter';
import { AsyncStorageAdapter } from './adapters/AsyncStorageAdapter';

// Erreur personnalisée pour le stockage
export class StorageError extends Error {
  constructor(message: string, public originalError?: string) {
    super(message);
    this.name = 'StorageError';
  }
}

/**
 * Service principal de stockage de tokens avec architecture modulaire
 */
class SecureStorageService {
  private readonly storageAdapters: ITokenStorageAdapter[];
  private readonly tokenValidator: ITokenValidator;

  constructor() {
    // Injection des dépendances
    const storageDetection = new StorageDetectionService();
    const cryptoService = new SimpleCryptoService();
    this.tokenValidator = new TokenValidator();

    // Configuration des adaptateurs par ordre de préférence
    this.storageAdapters = [
      new SecureStoreAdapter(storageDetection),
      new AsyncStorageAdapter(cryptoService, storageDetection)
    ];
  }

  /**
   * Stocke les tokens en utilisant le premier adaptateur disponible
   */
  async storeTokens(tokens: AuthTokens): Promise<void> {
    // Validation préalable
    if (!this.tokenValidator.validateTokens(tokens)) {
      throw new Error('Tokens invalides: access_token et refresh_token doivent être des chaînes de caractères non vides');
    }

    console.log('🔐 [SecureStorage] Début du stockage des tokens', {
      hasAccess: !!tokens.access_token,
      hasRefresh: !!tokens.refresh_token,
      accessLength: tokens.access_token.length,
      refreshLength: tokens.refresh_token.length
    });

    // Tentative de stockage avec le premier adaptateur disponible
    for (const adapter of this.storageAdapters) {
      try {
        if (await adapter.isAvailable()) {
          await adapter.storeTokens(tokens);
        console.log(`✅ [SecureStorage] Tokens stockés via ${adapter.name}`);
        return;
      } else {
        console.log(`⚠️  [SecureStorage] ${adapter.name} non disponible, passage au suivant`);
      }
    } catch (error) {
      console.warn(`❌ [SecureStorage] Échec ${adapter.name}, tentative suivante:`, error);
      // Continue avec l'adaptateur suivant
    }
  }

  throw new Error('Aucun adaptateur de stockage disponible');
}  /**
   * Récupère les tokens depuis le premier adaptateur qui en contient
   */
  async getTokens(): Promise<AuthTokens | null> {
    console.log('📖 [SecureStorage] Récupération des tokens');

    for (const adapter of this.storageAdapters) {
      try {
        if (await adapter.isAvailable()) {
          const tokens = await adapter.getTokens();
          if (tokens && this.tokenValidator.validateTokens(tokens)) {
            console.log(`✅ [SecureStorage] Tokens récupérés via ${adapter.name}`);
            return tokens;
          }
        }
      } catch (error) {
        console.warn(`⚠️  [SecureStorage] Erreur ${adapter.name}:`, error);
        // Continue avec l'adaptateur suivant
      }
    }

    console.log('ℹ️  [SecureStorage] Aucun token valide trouvé');
    return null;
  }

  /**
   * Vérifie si les tokens stockés ont expiré
   */
  async isTokenExpired(): Promise<boolean> {
    try {
      const tokens = await this.getTokens();
      return this.tokenValidator.areTokensExpired(tokens);
    } catch (error) {
      console.error('❌ [SecureStorage] Erreur lors de la vérification d\'expiration:', error);
      return true; // En cas d'erreur, considérer comme expiré pour forcer la reconnexion
    }
  }

  /**
   * Supprime tous les tokens de tous les adaptateurs
   */
  async clearTokens(): Promise<void> {
    console.log('🗑️  [SecureStorage] Suppression de tous les tokens');

    const errors: string[] = [];

    // Suppression sur tous les adaptateurs pour assurer un nettoyage complet
    for (const adapter of this.storageAdapters) {
      try {
        if (await adapter.isAvailable()) {
          await adapter.clearTokens();
          console.log(`✅ [SecureStorage] Tokens supprimés de ${adapter.name}`);
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        errors.push(`${adapter.name}: ${errorMsg}`);
        console.warn(`⚠️  [SecureStorage] Erreur suppression ${adapter.name}:`, error);
      }
    }

    if (errors.length === this.storageAdapters.length) {
      throw new Error(`Erreur lors de la suppression: ${errors.join(', ')}`);
    }

    console.log('✅ [SecureStorage] Nettoyage terminé');
  }
}

// Export de l'instance singleton pour la compatibilité avec l'API existante
export const secureStorageService = new SecureStorageService();
