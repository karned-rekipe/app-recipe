/**
 * Hook pour effectuer des requêtes API authentifiées
 * Gère automatiquement le refresh token et la réauthentification
 */

import { useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { secureStorageService } from '../services/SecureStorageService';

interface ApiRequestConfig extends RequestInit {
  requireAuth?: boolean;
}

interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  status: number;
}

/**
 * Hook pour effectuer des requêtes API avec authentification automatique
 */
export function useApiRequest() {
  const { tokens, refreshTokens, signOut } = useAuth();

  const makeRequest = useCallback(async <T = any>(
    url: string, 
    config: ApiRequestConfig = {}
  ): Promise<ApiResponse<T>> => {
    const { requireAuth = true, headers = {}, ...restConfig } = config;

    try {
      // Préparer les headers
      const requestHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(headers as Record<string, string>),
      };

      // Ajouter le token d'authentification si requis
      if (requireAuth) {
        if (!tokens?.access_token) {
          throw new Error('Token d\'authentification manquant');
        }

        // Vérifier si le token a expiré
        const isExpired = await secureStorageService.isTokenExpired();
        
        if (isExpired) {
          try {
            // Tenter de rafraîchir le token
            await refreshTokens();
            // Récupérer les nouveaux tokens après refresh
            const newTokens = await secureStorageService.getTokens();
            if (newTokens?.access_token) {
              requestHeaders.Authorization = `Bearer ${newTokens.access_token}`;
            } else {
              throw new Error('Impossible de récupérer le nouveau token');
            }
          } catch (refreshError) {
            // Échec du refresh, déconnecter l'utilisateur
            await signOut();
            throw new Error('Session expirée, veuillez vous reconnecter');
          }
        } else {
          requestHeaders.Authorization = `Bearer ${tokens.access_token}`;
        }
      }

      // Effectuer la requête
      const response = await fetch(url, {
        ...restConfig,
        headers: requestHeaders,
      });

      const responseData = await response.json().catch(() => null);

      if (!response.ok) {
        // Gérer les erreurs d'authentification
        if (response.status === 401 && requireAuth) {
          try {
            // Tenter un refresh en cas d'erreur 401
            await refreshTokens();
            // Réessayer la requête avec le nouveau token
            const newTokens = await secureStorageService.getTokens();
            if (newTokens?.access_token) {
              const retryHeaders: Record<string, string> = {
                ...requestHeaders,
                Authorization: `Bearer ${newTokens.access_token}`,
              };
              
              const retryResponse = await fetch(url, {
                ...restConfig,
                headers: retryHeaders,
              });
              
              const retryData = await retryResponse.json().catch(() => null);
              
              return {
                data: retryData,
                status: retryResponse.status,
                error: retryResponse.ok ? undefined : 'Erreur lors de la requête',
              };
            }
          } catch (retryError) {
            // Échec du retry, déconnecter l'utilisateur
            await signOut();
            throw new Error('Session expirée, veuillez vous reconnecter');
          }
        }

        return {
          status: response.status,
          error: responseData?.message || responseData?.error || 'Erreur lors de la requête',
          data: responseData,
        };
      }

      return {
        data: responseData,
        status: response.status,
      };

    } catch (error: any) {
      console.error('Erreur API:', error);
      
      if (error.message === 'Network request failed') {
        return {
          status: 0,
          error: 'Problème de connexion réseau',
        };
      }

      return {
        status: 0,
        error: error.message || 'Erreur inattendue',
      };
    }
  }, [tokens, refreshTokens, signOut]);

  // Méthodes de commodité pour les différents types de requêtes
  const get = useCallback(<T = any>(url: string, config?: Omit<ApiRequestConfig, 'method' | 'body'>) => 
    makeRequest<T>(url, { ...config, method: 'GET' }), [makeRequest]);

  const post = useCallback(<T = any>(url: string, data?: any, config?: Omit<ApiRequestConfig, 'method'>) => 
    makeRequest<T>(url, { 
      ...config, 
      method: 'POST', 
      body: data ? JSON.stringify(data) : undefined 
    }), [makeRequest]);

  const put = useCallback(<T = any>(url: string, data?: any, config?: Omit<ApiRequestConfig, 'method'>) => 
    makeRequest<T>(url, { 
      ...config, 
      method: 'PUT', 
      body: data ? JSON.stringify(data) : undefined 
    }), [makeRequest]);

  const del = useCallback(<T = any>(url: string, config?: Omit<ApiRequestConfig, 'method' | 'body'>) => 
    makeRequest<T>(url, { ...config, method: 'DELETE' }), [makeRequest]);

  return {
    makeRequest,
    get,
    post,
    put,
    delete: del,
  };
}
