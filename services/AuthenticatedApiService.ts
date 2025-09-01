/**
 * Service pour faire des requêtes API avec authentification
 * Utilise automatiquement le token et l'UUID de licence active
 */

import type { AuthTokens } from '../types/Auth';
import type { License } from '../types/License';

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

class AuthenticatedApiService {
  private static instance: AuthenticatedApiService;

  private constructor() {}

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

    // Vérifier si une licence est requise
    if (requiresLicense && !activeLicense && !licenseUuid) {
      throw new Error('Une licence est requise pour cette opération');
    }

    // Construire les headers
    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      'accept': 'application/json',
      'Authorization': `Bearer ${tokens.access_token}`,
      ...headers,
    };

    // Ajouter l'UUID de licence si nécessaire
    if (requiresLicense && (activeLicense || licenseUuid)) {
      const uuid = licenseUuid || activeLicense?.uuid;
      if (uuid) {
        requestHeaders['X-License-UUID'] = uuid;
      }
    }

    try {
      console.log(`🌐 [API] ${method} ${url}`, {
        hasAuth: !!tokens.access_token,
        hasLicense: !!(activeLicense || licenseUuid),
        licenseUuid: licenseUuid || activeLicense?.uuid
      });

      const response = await fetch(url, {
        method,
        headers: requestHeaders,
        body: body ? JSON.stringify(body) : undefined,
      });

      const data: ApiResponse<T> = await response.json();

      console.log(`🌐 [API] Réponse ${response.status}:`, {
        status: data.status,
        hasData: !!data.data,
        message: data.message
      });

      if (!response.ok) {
        throw new Error(data.message || data.error || `Erreur HTTP ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`❌ [API] Erreur ${method} ${url}:`, error);
      throw error;
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
