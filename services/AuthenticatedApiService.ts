/**
 * Service pour faire des requêtes API avec authentification - Refactorisé selon le SRP
 * Architecture modulaire avec responsabilités séparées
 */

import type { AuthTokens } from '../types/Auth';
import type { License } from '../types/License';
import { maskToken } from '../utils/maskingUtils';

// ==================== TYPES ET INTERFACES ====================

export interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: any;
  headers?: Record<string, string>;
  requiresLicense?: boolean;
  licenseUuid?: string;
}

export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
  error?: string;
}

// ==================== GESTION DES ERREURS ====================

export class AuthenticatedApiError extends Error {
  readonly code: string;
  readonly details?: string;

  constructor(code: string, message: string, details?: string) {
    super(message);
    this.name = 'AuthenticatedApiError';
    this.code = code;
    this.details = details;
  }
}

// ==================== VALIDATION ====================

/**
 * Responsable de la validation des paramètres d'entrée
 */
class ApiRequestValidator {
  /**
   * Valide les tokens d'authentification
   */
  validateTokens(tokens: AuthTokens): void {
    if (!tokens?.access_token || typeof tokens.access_token !== 'string') {
      throw new AuthenticatedApiError(
        'INVALID_TOKENS',
        'Token d\'accès invalide ou manquant'
      );
    }
  }

  /**
   * Valide la licence si elle est requise
   */
  validateLicense(requiresLicense: boolean, activeLicense?: License | null, licenseUuid?: string): void {
    if (requiresLicense && !activeLicense && !licenseUuid) {
      throw new AuthenticatedApiError(
        'LICENSE_REQUIRED',
        'Une licence est requise pour cette opération'
      );
    }
  }

  /**
   * Valide l'URL de la requête
   */
  validateUrl(url: string): void {
    if (!url || typeof url !== 'string') {
      throw new AuthenticatedApiError(
        'INVALID_URL',
        'URL invalide pour la requête API'
      );
    }
  }
}

// ==================== CONSTRUCTION DES HEADERS ====================

/**
 * Responsable de la construction des headers HTTP
 */
class ApiHeadersBuilder {
  /**
   * Construit les headers par défaut
   */
  buildDefaultHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      'accept': 'application/json',
    };
  }

  /**
   * Ajoute l'authentification aux headers
   */
  addAuthentication(headers: Record<string, string>, tokens: AuthTokens): Record<string, string> {
    return {
      ...headers,
      'Authorization': `Bearer ${tokens.access_token}`,
    };
  }

  /**
   * Ajoute les informations de licence aux headers
   */
  addLicenseInfo(
    headers: Record<string, string>, 
    activeLicense?: License | null, 
    licenseUuid?: string
  ): Record<string, string> {
    const uuid = licenseUuid || activeLicense?.uuid;
    if (uuid) {
      return {
        ...headers,
        'X-License-UUID': uuid,
      };
    }
    return headers;
  }

  /**
   * Construit tous les headers pour une requête
   */
  buildRequestHeaders(
    tokens: AuthTokens,
    customHeaders: Record<string, string> = {},
    activeLicense?: License | null,
    licenseUuid?: string,
    requiresLicense: boolean = false
  ): Record<string, string> {
    let headers = this.buildDefaultHeaders();
    headers = { ...headers, ...customHeaders };
    headers = this.addAuthentication(headers, tokens);
    
    if (requiresLicense) {
      headers = this.addLicenseInfo(headers, activeLicense, licenseUuid);
    }
    
    return headers;
  }
}

// ==================== LOGGING ====================

/**
 * Responsable des logs spécialisés pour les requêtes API
 */
class ApiLogger {
  static logRequest(
    method: string,
    url: string,
    tokens: AuthTokens,
    activeLicense?: License | null,
    licenseUuid?: string
  ): void {
    console.log(`🌐 [AuthenticatedAPI] ${method} ${url}`, {
      hasAuth: !!tokens.access_token,
      accessToken: maskToken(tokens.access_token),
      hasLicense: !!(activeLicense || licenseUuid),
      licenseUuid: licenseUuid || activeLicense?.uuid?.substring(0, 8) + '...'
    });
  }

  static logResponse<T>(method: string, url: string, status: number, data: ApiResponse<T>): void {
    console.log(`📡 [AuthenticatedAPI] Réponse ${method} ${url} - ${status}:`, {
      status: data.status,
      hasData: !!data.data,
      message: data.message
    });
  }

  static logError(method: string, url: string, error: unknown): void {
    console.error(`❌ [AuthenticatedAPI] Erreur ${method} ${url}:`, {
      error: error instanceof Error ? error.message : String(error),
      type: error instanceof Error ? error.constructor.name : typeof error
    });
  }
}

// ==================== CLIENT HTTP ====================

/**
 * Responsable des appels HTTP authentifiés
 */
class AuthenticatedHttpClient {
  /**
   * Effectue une requête HTTP authentifiée
   */
  async executeRequest<T = any>(
    url: string,
    method: string,
    headers: Record<string, string>,
    body?: any
  ): Promise<ApiResponse<T>> {
    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    const data: ApiResponse<T> = await response.json();

    ApiLogger.logResponse(method, url, response.status, data);

    if (!response.ok) {
      throw new AuthenticatedApiError(
        'HTTP_ERROR',
        data.message || data.error || `Erreur HTTP ${response.status}`,
        `Status: ${response.status}`
      );
    }

    return data;
  }
}

// ==================== SERVICE PRINCIPAL ====================

/**
 * Service principal pour les requêtes API authentifiées
 * Coordonne les différents composants selon le principe SRP
 */
class AuthenticatedApiService {
  private static instance: AuthenticatedApiService;
  
  private readonly validator: ApiRequestValidator;
  private readonly headersBuilder: ApiHeadersBuilder;
  private readonly httpClient: AuthenticatedHttpClient;

  private constructor() {
    this.validator = new ApiRequestValidator();
    this.headersBuilder = new ApiHeadersBuilder();
    this.httpClient = new AuthenticatedHttpClient();
  }

  public static getInstance(): AuthenticatedApiService {
    if (!AuthenticatedApiService.instance) {
      AuthenticatedApiService.instance = new AuthenticatedApiService();
    }
    return AuthenticatedApiService.instance;
  }

  /**
   * Effectue une requête API authentifiée
   */
  async makeRequest<T = any>(
    url: string,
    tokens: AuthTokens,
    options: ApiRequestOptions = {},
    activeLicense?: License | null
  ): Promise<ApiResponse<T>> {
    const {
      method = 'GET',
      body,
      headers = {},
      requiresLicense = false,
      licenseUuid
    } = options;

    try {
      // 1. Validation des entrées
      this.validator.validateUrl(url);
      this.validator.validateTokens(tokens);
      this.validator.validateLicense(requiresLicense, activeLicense, licenseUuid);

      // 2. Construction des headers
      const requestHeaders = this.headersBuilder.buildRequestHeaders(
        tokens,
        headers,
        activeLicense,
        licenseUuid,
        requiresLicense
      );

      // 3. Log de la requête
      ApiLogger.logRequest(method, url, tokens, activeLicense, licenseUuid);

      // 4. Exécution de la requête
      return await this.httpClient.executeRequest<T>(url, method, requestHeaders, body);

    } catch (error) {
      ApiLogger.logError(method, url, error);
      
      if (error instanceof AuthenticatedApiError) {
        throw error;
      }
      
      throw new AuthenticatedApiError(
        'UNEXPECTED_ERROR',
        'Erreur inattendue lors de la requête API',
        error instanceof Error ? error.message : String(error)
      );
    }
  }

  /**
   * GET avec authentification
   */
  async get<T = any>(
    url: string,
    tokens: AuthTokens,
    activeLicense?: License | null,
    options: Omit<ApiRequestOptions, 'method'> = {}
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(url, tokens, { ...options, method: 'GET' }, activeLicense);
  }

  /**
   * POST avec authentification
   */
  async post<T = any>(
    url: string,
    body: any,
    tokens: AuthTokens,
    activeLicense?: License | null,
    options: Omit<ApiRequestOptions, 'method' | 'body'> = {}
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(url, tokens, { ...options, method: 'POST', body }, activeLicense);
  }

  /**
   * PUT avec authentification
   */
  async put<T = any>(
    url: string,
    body: any,
    tokens: AuthTokens,
    activeLicense?: License | null,
    options: Omit<ApiRequestOptions, 'method' | 'body'> = {}
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(url, tokens, { ...options, method: 'PUT', body }, activeLicense);
  }

  /**
   * DELETE avec authentification
   */
  async delete<T = any>(
    url: string,
    tokens: AuthTokens,
    activeLicense?: License | null,
    options: Omit<ApiRequestOptions, 'method'> = {}
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(url, tokens, { ...options, method: 'DELETE' }, activeLicense);
  }

  /**
   * PATCH avec authentification
   */
  async patch<T = any>(
    url: string,
    body: any,
    tokens: AuthTokens,
    activeLicense?: License | null,
    options: Omit<ApiRequestOptions, 'method' | 'body'> = {}
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(url, tokens, { ...options, method: 'PATCH', body }, activeLicense);
  }
}

// Instance singleton
export const authenticatedApiService = AuthenticatedApiService.getInstance();
