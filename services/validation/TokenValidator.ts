import type { AuthTokens } from '../../types/Auth';
import type { ITokenValidator } from '../interfaces/ITokenValidator';

/**
 * Service de validation des tokens
 * Responsabilité unique : Validation et vérification de l'expiration des tokens JWT
 */
export class TokenValidator implements ITokenValidator {
  /**
   * Valide la structure des tokens
   */
  validateTokens(tokens: AuthTokens): boolean {
    if (!tokens || typeof tokens !== 'object') {
      return false;
    }

    if (typeof tokens.access_token !== 'string' || typeof tokens.refresh_token !== 'string') {
      return false;
    }

    if (!tokens.access_token.trim() || !tokens.refresh_token.trim()) {
      return false;
    }

    return true;
  }

  /**
   * Vérifie si un token JWT a expiré en analysant sa payload
   */
  isTokenExpired(accessToken: string): boolean {
    if (!accessToken || typeof accessToken !== 'string') {
      return true;
    }

    try {
      // Décoder le JWT pour vérifier l'expiration
      const parts = accessToken.split('.');
      if (parts.length !== 3) {
        console.warn('⚠️  [TokenValidator] Format JWT invalide');
        return true;
      }

      const payload = JSON.parse(atob(parts[1]));
      
      if (!payload.exp || typeof payload.exp !== 'number') {
        console.warn('⚠️  [TokenValidator] Token sans date d\'expiration, considéré comme expiré');
        return true;
      }

      const currentTime = Math.floor(Date.now() / 1000);
      const isExpired = payload.exp < currentTime;
      
      if (isExpired) {
        console.log('⏰ [TokenValidator] Token expiré');
      } else {
        const expiresIn = payload.exp - currentTime;
        console.log(`✅ [TokenValidator] Token valide, expire dans ${expiresIn} secondes`);
      }
      
      return isExpired;
    } catch (error) {
      console.warn('⚠️  [TokenValidator] Impossible de décoder le token:', error);
      return true; // En cas d'erreur, considérer comme expiré pour forcer la reconnexion
    }
  }

  /**
   * Vérifie si les tokens sont expirés
   */
  areTokensExpired(tokens: AuthTokens | null): boolean {
    if (!tokens || !this.validateTokens(tokens)) {
      return true;
    }

    return this.isTokenExpired(tokens.access_token);
  }
}
