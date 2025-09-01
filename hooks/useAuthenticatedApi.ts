/**
 * Hook pour faire des requêtes API authentifiées
 * Utilise automatiquement les tokens et la licence active
 */

import { useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { authenticatedApiService, type ApiRequestOptions } from '../services/AuthenticatedApiService';

export function useAuthenticatedApi() {
  const { tokens, activeLicense, isAuthenticated } = useAuth();

  const makeRequest = useCallback(async <T = any>(
    url: string,
    options: ApiRequestOptions = {}
  ) => {
    if (!isAuthenticated || !tokens) {
      throw new Error('Utilisateur non authentifié');
    }

    return authenticatedApiService.makeRequest<T>(url, tokens, options, activeLicense);
  }, [tokens, activeLicense, isAuthenticated]);

  const get = useCallback(async <T = any>(
    url: string,
    options: Omit<ApiRequestOptions, 'method'> = {}
  ) => {
    if (!isAuthenticated || !tokens) {
      throw new Error('Utilisateur non authentifié');
    }

    return authenticatedApiService.get<T>(url, tokens, activeLicense, options);
  }, [tokens, activeLicense, isAuthenticated]);

  const post = useCallback(async <T = any>(
    url: string,
    body: any,
    options: Omit<ApiRequestOptions, 'method' | 'body'> = {}
  ) => {
    if (!isAuthenticated || !tokens) {
      throw new Error('Utilisateur non authentifié');
    }

    return authenticatedApiService.post<T>(url, body, tokens, activeLicense, options);
  }, [tokens, activeLicense, isAuthenticated]);

  const put = useCallback(async <T = any>(
    url: string,
    body: any,
    options: Omit<ApiRequestOptions, 'method' | 'body'> = {}
  ) => {
    if (!isAuthenticated || !tokens) {
      throw new Error('Utilisateur non authentifié');
    }

    return authenticatedApiService.put<T>(url, body, tokens, activeLicense, options);
  }, [tokens, activeLicense, isAuthenticated]);

  const del = useCallback(async <T = any>(
    url: string,
    options: Omit<ApiRequestOptions, 'method'> = {}
  ) => {
    if (!isAuthenticated || !tokens) {
      throw new Error('Utilisateur non authentifié');
    }

    return authenticatedApiService.delete<T>(url, tokens, activeLicense, options);
  }, [tokens, activeLicense, isAuthenticated]);

  const patch = useCallback(async <T = any>(
    url: string,
    body: any,
    options: Omit<ApiRequestOptions, 'method' | 'body'> = {}
  ) => {
    if (!isAuthenticated || !tokens) {
      throw new Error('Utilisateur non authentifié');
    }

    return authenticatedApiService.patch<T>(url, body, tokens, activeLicense, options);
  }, [tokens, activeLicense, isAuthenticated]);

  return {
    // État
    isAuthenticated,
    hasActiveLicense: !!activeLicense,
    activeLicense,
    
    // Méthodes
    makeRequest,
    get,
    post,
    put,
    delete: del,
    patch,
    
    // Raccourcis pour les requêtes communes avec licence
    getLicensed: (url: string, options: Omit<ApiRequestOptions, 'method'> = {}) =>
      get(url, { ...options, requiresLicense: true }),
    
    postLicensed: (url: string, body: any, options: Omit<ApiRequestOptions, 'method' | 'body'> = {}) =>
      post(url, body, { ...options, requiresLicense: true }),
    
    putLicensed: (url: string, body: any, options: Omit<ApiRequestOptions, 'method' | 'body'> = {}) =>
      put(url, body, { ...options, requiresLicense: true }),
    
    deleteLicensed: (url: string, options: Omit<ApiRequestOptions, 'method'> = {}) =>
      del(url, { ...options, requiresLicense: true }),
  };
}
