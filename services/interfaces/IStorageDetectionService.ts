/**
 * Interface pour la détection des services de stockage
 * Responsabilité unique : Détection de la disponibilité des services de stockage
 */
export interface IStorageDetectionService {
  /**
   * Vérifie si SecureStore est disponible sur la plateforme actuelle
   * @returns true si SecureStore est disponible et fonctionnel
   */
  isSecureStoreAvailable(): Promise<boolean>;

  /**
   * Vérifie si AsyncStorage est disponible
   * @returns true si AsyncStorage est disponible
   */
  isAsyncStorageAvailable(): Promise<boolean>;
}
