import type { AuthTokens } from '../../types/Auth';

/**
 * Interface pour les adaptateurs de stockage de tokens
 * Responsabilité unique : Stockage et récupération de tokens
 */
export interface ITokenStorageAdapter {
  /**
   * Stocke les tokens de manière sécurisée
   * @param tokens - Les tokens à stocker
   * @throws StorageError si le stockage échoue
   */
  storeTokens(tokens: AuthTokens): Promise<void>;

  /**
   * Récupère les tokens stockés
   * @returns Les tokens ou null si aucun n'est trouvé
   */
  getTokens(): Promise<AuthTokens | null>;

  /**
   * Supprime tous les tokens stockés
   * @throws StorageError si la suppression échoue
   */
  clearTokens(): Promise<void>;

  /**
   * Vérifie si ce mode de stockage est disponible
   * @returns true si le stockage est disponible
   */
  isAvailable(): Promise<boolean>;

  /**
   * Nom de l'adaptateur pour les logs
   */
  readonly name: string;
}
