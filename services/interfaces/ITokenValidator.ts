import type { AuthTokens } from '../../types/Auth';

/**
 * Interface pour la validation des tokens
 * Responsabilité unique : Validation et vérification de l'expiration des tokens
 */
export interface ITokenValidator {
  /**
   * Valide la structure des tokens
   * @param tokens - Les tokens à valider
   * @returns true si les tokens sont valides
   */
  validateTokens(tokens: AuthTokens): boolean;

  /**
   * Vérifie si le token d'accès a expiré
   * @param accessToken - Le token d'accès à vérifier
   * @returns true si le token est expiré
   */
  isTokenExpired(accessToken: string): boolean;

  /**
   * Vérifie si les tokens sont expirés
   * @param tokens - Les tokens à vérifier
   * @returns true si les tokens sont expirés
   */
  areTokensExpired(tokens: AuthTokens | null): boolean;
}
