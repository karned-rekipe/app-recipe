/**
 * Service API pour l'authentification
 * Architecture refactorisée respectant le principe de responsabilité unique (SRP)
 */

import type { AuthResponse, AuthTokens, LoginCredentials } from '../types/Auth';
import config from '../config/api';
import { maskToken } from '../utils/maskingUtils';

// ==================== GESTION DES ERREURS ====================

export class AuthApiError extends Error {
  code: string;
  details?: string;

  constructor(code: string, message: string, details?: string) {
    super(message);
    this.name = 'AuthApiError';
    this.code = code;
    this.details = details;
  }
}

class AuthErrorHandler {
  static handleApiError(data: any, defaultCode: string, defaultMessage: string): AuthApiError {
    return new AuthApiError(
      data.error || defaultCode,
      data.error_description || defaultMessage,
      data.detail
    );
  }

  static handleNetworkError(): AuthApiError {
    return new AuthApiError(
      'NETWORK_ERROR',
      'Problème de connexion réseau'
    );
  }

  static handleUnknownError(context: string): AuthApiError {
    return new AuthApiError(
      'UNKNOWN_ERROR',
      `Une erreur inattendue s'est produite lors de ${context}`
    );
  }
}

// ==================== VALIDATION DES DONNÉES ====================

class AuthDataValidator {
  static validateLoginCredentials(credentials: LoginCredentials): void {
    console.log('🔍 [AuthDataValidator] Validation des credentials:', {
      credentials,
      hasUsername: !!credentials?.username,
      hasPassword: !!credentials?.password,
      usernameType: typeof credentials?.username,
      passwordType: typeof credentials?.password,
      usernameLength: credentials?.username?.length || 0,
      passwordLength: credentials?.password?.length || 0
    });

    if (!credentials?.username || typeof credentials.username !== 'string' || !credentials.username.trim()) {
      throw new AuthApiError('INVALID_CREDENTIALS', 'Nom d\'utilisateur requis');
    }
    if (!credentials?.password || typeof credentials.password !== 'string' || !credentials.password.trim()) {
      throw new AuthApiError('INVALID_CREDENTIALS', 'Mot de passe requis');
    }
    
    console.log('✅ [AuthDataValidator] Credentials valides');
  }

  static validateRefreshToken(refreshToken: string): void {
    if (!refreshToken || typeof refreshToken !== 'string' || !refreshToken.trim()) {
      throw new AuthApiError('INVALID_REFRESH_TOKEN', 'Refresh token invalide ou manquant');
    }
  }

  static validateTokensResponse(tokensData: any): void {
    if (!tokensData.access_token || !tokensData.refresh_token) {
      throw new AuthApiError(
        'INVALID_RESPONSE',
        'Réponse de l\'API invalide: tokens manquants'
      );
    }

    if (typeof tokensData.access_token !== 'string' || typeof tokensData.refresh_token !== 'string') {
      throw new AuthApiError(
        'INVALID_RESPONSE',
        'Réponse de l\'API invalide: tokens non conformes'
      );
    }
  }

  static validateAccessToken(accessToken: string): void {
    if (!accessToken || typeof accessToken !== 'string') {
      throw new AuthApiError(
        'INVALID_RESPONSE',
        'Access token invalide reçu de l\'API'
      );
    }
  }
}

// ==================== LOGGING SPÉCIALISÉ ====================

class AuthLogger {
  static logLoginResponse(status: number, data: any): void {
    console.log('🔍 [AuthAPI] Réponse de l\'API login:', {
      status,
      data: {
        ...data,
        access_token: data.access_token ? maskToken(data.access_token) : undefined,
        refresh_token: data.refresh_token ? maskToken(data.refresh_token) : undefined
      },
      hasAccessToken: !!data.access_token,
      hasRefreshToken: !!data.refresh_token
    });
  }

  static logTokenValidationError(tokensData: any): void {
    console.error('❌ [AuthAPI] Tokens manquants dans la réponse:', tokensData);
  }

  static logTokenTypeError(tokensData: any): void {
    console.error('❌ [AuthAPI] Tokens invalides (pas des chaînes):', {
      accessType: typeof tokensData.access_token,
      refreshType: typeof tokensData.refresh_token
    });
  }

  static logFinalTokens(tokens: AuthTokens): void {
    console.log('🎯 [AuthAPI] Tokens finaux à retourner:', {
      hasAccess: !!tokens.access_token,
      hasRefresh: !!tokens.refresh_token,
      accessToken: maskToken(tokens.access_token),
      refreshToken: maskToken(tokens.refresh_token),
      accessLength: tokens.access_token?.length || 0,
      refreshLength: tokens.refresh_token?.length || 0
    });
  }

  static logRefreshTokens(tokens: AuthTokens): void {
    console.log('🔄 [AuthAPI] Nouveaux tokens après refresh:', {
      hasAccess: !!tokens.access_token,
      hasRefresh: !!tokens.refresh_token,
      accessToken: maskToken(tokens.access_token),
      refreshToken: maskToken(tokens.refresh_token),
      accessLength: tokens.access_token?.length || 0,
      refreshLength: tokens.refresh_token?.length || 0
    });
  }

  static logUserInfoWarning(): void {
    console.warn('[AuthApiService] Endpoint /me non disponible - informations utilisateur non récupérées');
  }
}

// ==================== TRANSFORMATION DES DONNÉES ====================

class AuthDataTransformer {
  static extractTokensFromResponse(data: any): any {
    // L'API renvoie { status: "success", data: { tokens... }, message: "..." }
    // Il faut extraire les tokens du champ data.data
    return data.data || data;
  }

  static createAuthResponse(tokensData: any): AuthResponse {
    const tokens: AuthTokens = {
      access_token: tokensData.access_token,
      refresh_token: tokensData.refresh_token,
      token_type: tokensData.token_type || 'bearer',
      expires_in: tokensData.expires_in || 3600,
    };

    return { tokens };
  }

  static createRefreshTokensResponse(data: any, fallbackRefreshToken: string): AuthTokens {
    return {
      access_token: data.access_token,
      refresh_token: data.refresh_token || fallbackRefreshToken,
      token_type: data.token_type || 'bearer',
      expires_in: data.expires_in || 3600,
    };
  }
}

// ==================== CLIENT HTTP SPÉCIALISÉ ====================

class AuthHttpClient {
  private readonly baseUrl = config.AUTH_API_URL;

  private createHeaders(): HeadersInit {
    return {
      'Content-Type': 'application/json',
      'accept': 'application/json',
    };
  }

  async post(endpoint: string, body: any): Promise<{ response: Response; data: any }> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: this.createHeaders(),
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return { response, data };
  }
}

// ==================== SERVICE PRINCIPAL ====================

/**
 * Service principal pour l'authentification
 * Coordonne les différentes responsabilités
 */
export class AuthApiService {
  private static instance: AuthApiService;
  private httpClient = new AuthHttpClient();

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
      console.log('🔐 [AuthApiService] Début de la connexion...');
      AuthDataValidator.validateLoginCredentials(credentials);

      console.log('🌐 [AuthApiService] Envoi de la requête HTTP...');
      const { response, data } = await this.httpClient.post(config.auth.token, {
        username: credentials.username,
        password: credentials.password,
      });

      console.log('📡 [AuthApiService] Réponse HTTP reçue');
      AuthLogger.logLoginResponse(response.status, data);

      if (!response.ok) {
        console.log('❌ [AuthApiService] Réponse HTTP non OK, lancement d\'erreur API');
        throw AuthErrorHandler.handleApiError(data, 'AUTH_ERROR', 'Erreur d\'authentification');
      }

      console.log('🔍 [AuthApiService] Extraction des tokens...');
      const tokensData = AuthDataTransformer.extractTokensFromResponse(data);
      
      console.log('✅ [AuthApiService] Validation des tokens...');
      AuthDataValidator.validateTokensResponse(tokensData);

      console.log('🏗️ [AuthApiService] Création de la réponse d\'authentification...');
      const authResponse = AuthDataTransformer.createAuthResponse(tokensData);
      
      console.log('📝 [AuthApiService] Log des tokens finaux...');
      AuthLogger.logFinalTokens(authResponse.tokens);

      console.log('✅ [AuthApiService] Connexion réussie');
      return authResponse;
    } catch (error) {
      console.log('🚨 [AuthApiService] Erreur capturée dans login()');
      console.error('🔥 [AuthApiService] Erreur brute:', error);
      console.error('🔥 [AuthApiService] Type d\'erreur:', typeof error);
      console.error('🔥 [AuthApiService] Constructeur:', error?.constructor?.name);
      
      this.handleError(error, 'la connexion');
    }
  }

  /**
   * Rafraîchissement du token
   */
  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    try {
      AuthDataValidator.validateRefreshToken(refreshToken);

      const { response, data } = await this.httpClient.post(config.auth.refresh, {
        refresh_token: refreshToken,
      });

      if (!response.ok) {
        throw AuthErrorHandler.handleApiError(
          data,
          'REFRESH_ERROR',
          'Erreur lors du rafraîchissement du token'
        );
      }

      AuthDataValidator.validateAccessToken(data.access_token);

      const newTokens = AuthDataTransformer.createRefreshTokensResponse(data, refreshToken);
      AuthLogger.logRefreshTokens(newTokens);

      return newTokens;
    } catch (error) {
      this.handleError(error, 'le rafraîchissement du token');
    }
  }

  /**
   * Récupération des informations utilisateur
   * Retourne null car l'endpoint /me n'est pas implémenté dans l'API
   */
  async getUserInfo(accessToken: string): Promise<any> {
    AuthLogger.logUserInfoWarning();
    return null;
  }

  private handleError(error: unknown, context: string): never {
    console.error(`🚨 [AuthApiService] Erreur dans ${context}:`, {
      error,
      errorType: typeof error,
      errorName: error instanceof Error ? error.name : 'Unknown',
      errorMessage: error instanceof Error ? error.message : String(error),
      isAuthApiError: error instanceof AuthApiError,
      isTypeError: error instanceof TypeError,
      stack: error instanceof Error ? error.stack : undefined
    });

    if (error instanceof AuthApiError) {
      throw error;
    }

    if (error instanceof TypeError && error.message === 'Network request failed') {
      throw AuthErrorHandler.handleNetworkError();
    }

    throw AuthErrorHandler.handleUnknownError(context);
  }
}

export const authApiService = AuthApiService.getInstance();
