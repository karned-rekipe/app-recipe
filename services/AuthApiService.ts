/**
 * Service API pour l'authentification
 * Responsable de la communication avec l'API d'authentification
 */

import type { AuthResponse, AuthTokens, LoginCredentials, AuthError } from '../types/Auth';
import config from '../config/api';

const API_BASE_URL = config.AUTH_API_URL;

class AuthApiError extends Error {
  code: string;
  details?: string;

  constructor(code: string, message: string, details?: string) {
    super(message);
    this.name = 'AuthApiError';
    this.code = code;
    this.details = details;
  }
}

/**
 * Service pour gérer les appels API d'authentification
 */
export class AuthApiService {
  private static instance: AuthApiService;

  private constructor() {}

  public static getInstance(): AuthApiService {
    if (!AuthApiService.instance) {
      AuthApiService.instance = new AuthApiService();
    }
    return AuthApiService.instance;
  }

  /**
   * Connexion utilisateur
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}${config.auth.token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json',
        },
        body: JSON.stringify({
          username: credentials.username,
          password: credentials.password,
        }),
      });

      const data = await response.json();
      
      console.log('🔍 [AuthAPI] Réponse de l\'API login:', { 
        status: response.status,
        data: data,
        hasAccessToken: !!data.access_token,
        hasRefreshToken: !!data.refresh_token
      });

      if (!response.ok) {
        throw new AuthApiError(
          data.error || 'AUTH_ERROR',
          data.error_description || 'Erreur d\'authentification',
          data.detail
        );
      }

      // L'API renvoie { status: "success", data: { tokens... }, message: "..." }
      // Il faut extraire les tokens du champ data.data
      const tokensData = data.data || data;

      const finalTokens = {
        tokens: {
          access_token: tokensData.access_token,
          refresh_token: tokensData.refresh_token,
          token_type: tokensData.token_type || 'bearer',
          expires_in: tokensData.expires_in || 3600,
        },
      };
      
      console.log('🎯 [AuthAPI] Tokens finaux à retourner:', {
        hasAccess: !!finalTokens.tokens.access_token,
        hasRefresh: !!finalTokens.tokens.refresh_token,
        accessLength: finalTokens.tokens.access_token?.length || 0,
        refreshLength: finalTokens.tokens.refresh_token?.length || 0
      });

      return finalTokens;
    } catch (error) {
      if (error instanceof AuthApiError) {
        throw error;
      }

      if (error instanceof TypeError && error.message === 'Network request failed') {
        throw new AuthApiError(
          'NETWORK_ERROR',
          'Problème de connexion réseau'
        );
      }

      throw new AuthApiError(
        'UNKNOWN_ERROR',
        'Une erreur inattendue s\'est produite'
      );
    }
  }

  /**
   * Rafraîchissement du token
   */
  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    try {
      const response = await fetch(`${API_BASE_URL}${config.auth.refresh}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json',
        },
        body: JSON.stringify({
          refresh_token: refreshToken,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new AuthApiError(
          data.error || 'REFRESH_ERROR',
          data.error_description || 'Erreur lors du rafraîchissement du token',
          data.detail
        );
      }

      return {
        access_token: data.access_token,
        refresh_token: data.refresh_token || refreshToken, // Garder l'ancien si pas de nouveau
        token_type: data.token_type || 'bearer',
        expires_in: data.expires_in || 3600,
      };
    } catch (error) {
      if (error instanceof AuthApiError) {
        throw error;
      }

      if (error instanceof TypeError && error.message === 'Network request failed') {
        throw new AuthApiError(
          'NETWORK_ERROR',
          'Problème de connexion réseau'
        );
      }

      throw new AuthApiError(
        'REFRESH_ERROR',
        'Impossible de rafraîchir le token'
      );
    }
  }

  /**
   * Récupération des informations utilisateur (endpoint non disponible)
   * Retourne null car l'endpoint /me n'est pas implémenté dans l'API
   */
  async getUserInfo(accessToken: string): Promise<any> {
    // L'endpoint /me n'existe pas dans cette API
    // Retourner null pour indiquer que les informations utilisateur ne sont pas disponibles
    console.warn('[AuthApiService] Endpoint /me non disponible - informations utilisateur non récupérées');
    return null;
  }
}

export const authApiService = AuthApiService.getInstance();
