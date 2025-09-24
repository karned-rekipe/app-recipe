/**
 * Contexte d'authentification
 * Gère l'état global de l'authentification dans l'application
 */

import React, { createContext, useContext, useReducer, useEffect, type PropsWithChildren } from 'react';
import type { AuthContextType, AuthState, LoginCredentials, AuthTokens, AuthError } from '../types/Auth';
import type { License } from '../types/License';
import { authApiService } from '../services/AuthApiService';
import { licenseApiService } from '../services/LicenseApiService';
import { secureStorageService } from '../services/SecureStorageService';

// État initial
const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
  tokens: null,
  licenses: [],
  activeLicense: null,
  error: null,
};

// Types d'actions
type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_AUTHENTICATED'; payload: { tokens: AuthTokens; user?: any } }
  | { type: 'SET_LICENSES'; payload: License[] }
  | { type: 'SET_ACTIVE_LICENSE'; payload: License | null }
  | { type: 'SET_ERROR'; payload: AuthError }
  | { type: 'CLEAR_ERROR' }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_TOKENS'; payload: AuthTokens };

// Reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_AUTHENTICATED':
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        tokens: action.payload.tokens,
        user: action.payload.user || null,
        error: null,
      };
    
    case 'SET_LICENSES':
      console.log('🏷️  [AuthContext] Réception des licences:', {
        totalLicenses: action.payload.length,
        licenses: action.payload.map(l => ({
          uuid: l.uuid.substring(0, 8) + '...',
          name: l.name,
          expired: l.exp <= Math.floor(Date.now() / 1000),
          hasApiRoles: !!l.api_roles,
          hasRecipeRoles: !!(l.api_roles && l.api_roles['api-recipe']),
          recipeRoles: l.api_roles?.['api-recipe']?.roles || []
        }))
      });
      
      // Sélection simple : première licence valide (temporaire pour diagnostic)
      const currentTime = Math.floor(Date.now() / 1000);
      
      console.log('🔍 [AuthContext] Recherche de licence valide - currentTime:', currentTime);
      
      const validLicense = action.payload.find(license => {
        const isNotExpired = license.exp > currentTime;
        const hasApiRoles = !!license.api_roles;
        const hasRecipeRoles = !!(license.api_roles && license.api_roles['api-recipe']);
        const hasRecipeRolesList = !!(license.api_roles && license.api_roles['api-recipe'] && license.api_roles['api-recipe'].roles.length > 0);
        
        console.log('🔍 [AuthContext] Vérification licence:', {
          uuid: license.uuid.substring(0, 8) + '...',
          name: license.name,
          exp: license.exp,
          isNotExpired,
          hasApiRoles,
          hasRecipeRoles,
          hasRecipeRolesList,
          recipeRoles: license.api_roles?.['api-recipe']?.roles || 'N/A'
        });
        
        return isNotExpired && hasApiRoles && hasRecipeRoles && hasRecipeRolesList;
      });
      
      console.log('🎯 [AuthContext] Résultat recherche licence valide:', validLicense ? {
        uuid: validLicense.uuid.substring(0, 8) + '...',
        name: validLicense.name
      } : 'Aucune licence valide trouvée');
      
      const selectedLicense = state.activeLicense || validLicense || null;
      
      console.log('🎯 [AuthContext] Licence sélectionnée:', selectedLicense ? {
        uuid: selectedLicense.uuid.substring(0, 8) + '...',
        name: selectedLicense.name
      } : 'Aucune');
      
      return {
        ...state,
        licenses: action.payload,
        activeLicense: selectedLicense,
      };
    
    case 'SET_ACTIVE_LICENSE':
      console.log('🎯 [AuthContext] Changement de licence active:', {
        oldLicense: state.activeLicense ? {
          uuid: state.activeLicense.uuid.substring(0, 8) + '...',
          name: state.activeLicense.name
        } : null,
        newLicense: action.payload ? {
          uuid: action.payload.uuid.substring(0, 8) + '...',
          name: action.payload.name
        } : null
      });
      
      return {
        ...state,
        activeLicense: action.payload,
      };
    
    case 'SET_ERROR':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    
    case 'LOGOUT':
      console.log('🔄 [AuthContext] Reducer LOGOUT - réinitialisation de l\'état');
      return {
        ...initialState,
        isLoading: false,
      };
    
    case 'UPDATE_TOKENS':
      return {
        ...state,
        tokens: action.payload,
      };
    
    default:
      return state;
  }
}

// Contexte
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Provider d'authentification
 */
export function AuthProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Fonction pour se connecter
  const signIn = async (credentials: LoginCredentials): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      const authResponse = await authApiService.login(credentials);
      
      console.log('🔑 [AuthContext] Tokens reçus lors du login:', {
        hasAccessToken: !!authResponse.tokens?.access_token,
        hasRefreshToken: !!authResponse.tokens?.refresh_token,
        accessLength: authResponse.tokens?.access_token?.length || 0,
        refreshLength: authResponse.tokens?.refresh_token?.length || 0
      });
      
      // Stocker les tokens de manière sécurisée
      try {
        await secureStorageService.storeTokens(authResponse.tokens);
        console.log('✅ [AuthContext] Tokens stockés avec succès');
      } catch (storageError) {
        console.error('❌ [AuthContext] Erreur lors du stockage des tokens:', storageError);
        // Cette erreur n'est pas critique pour la connexion, on continue
      }
      
      // Optionnel : récupérer les infos utilisateur
      let user = authResponse.user;
      if (!user && authResponse.tokens.access_token) {
        try {
          user = await authApiService.getUserInfo(authResponse.tokens.access_token);
        } catch (error) {
          // Les infos utilisateur ne sont pas critiques, continuer sans
          console.warn('Impossible de récupérer les infos utilisateur:', error);
        }
      }

      dispatch({ 
        type: 'SET_AUTHENTICATED', 
        payload: { 
          tokens: authResponse.tokens,
          user 
        } 
      });

      // Récupérer les licences de l'utilisateur
      try {
        console.log('🔍 [AuthContext] Tentative de récupération des licences avec token:', {
          hasToken: !!authResponse.tokens.access_token,
          tokenLength: authResponse.tokens.access_token?.length || 0,
          tokenStart: authResponse.tokens.access_token?.substring(0, 20) + '...'
        });
        
        const licenses = await licenseApiService.getUserLicenses(authResponse.tokens.access_token);
        
        console.log('✅ [AuthContext] Licences récupérées avec succès:', {
          count: licenses.length,
          licenses: licenses.map(l => ({ uuid: l.uuid.substring(0, 8) + '...', name: l.name }))
        });
        
        dispatch({ type: 'SET_LICENSES', payload: licenses });
      } catch (error: any) {
        console.error('❌ [AuthContext] Erreur lors de la récupération des licences:', {
          error: error instanceof Error ? error.message : error,
          errorCode: error.code,
          tokenUsed: authResponse.tokens.access_token?.substring(0, 20) + '...',
          hasToken: !!authResponse.tokens.access_token
        });
        
        // Si c'est une erreur de token (401), essayer de refresh et retry
        if (error.code === 'HTTP_ERROR' && error.details?.includes('401') && authResponse.tokens.refresh_token) {
          console.log('🔄 [AuthContext] Token expiré, tentative de refresh et retry...');
          try {
            // Refresh les tokens
            const newTokens = await authApiService.refreshToken(authResponse.tokens.refresh_token);
            
            // Mettre à jour les tokens dans le state
            dispatch({ type: 'UPDATE_TOKENS', payload: newTokens });
            
            // Mettre à jour le stockage sécurisé
            await secureStorageService.storeTokens(newTokens);
            
            // Retry avec le nouveau token
            const licenses = await licenseApiService.getUserLicenses(newTokens.access_token);
            console.log('✅ [AuthContext] Licences récupérées après refresh:', {
              count: licenses.length,
              licenses: licenses.map(l => ({ uuid: l.uuid.substring(0, 8) + '...', name: l.name }))
            });
            dispatch({ type: 'SET_LICENSES', payload: licenses });
          } catch (refreshError) {
            console.error('❌ [AuthContext] Échec du refresh ou retry:', refreshError);
            // Les licences ne sont pas critiques pour la connexion, continuer sans
          }
        } else {
          // Autres types d'erreurs, continuer sans licences
          console.log('ℹ️ [AuthContext] Continuing without licenses due to non-token error');
        }
      }
    } catch (error: any) {
      const authError: AuthError = {
        code: error.code || 'UNKNOWN_ERROR',
        message: error.message || 'Erreur de connexion',
        details: error.details,
      };
      dispatch({ type: 'SET_ERROR', payload: authError });
      throw error;
    }
  };

  // Fonction pour se déconnecter
  const signOut = async (): Promise<void> => {
    console.log('🚪 [AuthContext] Début de la déconnexion...');
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      console.log('🔐 [AuthContext] Suppression des tokens du stockage sécurisé...');
      // Supprimer les tokens du stockage sécurisé
      await secureStorageService.clearTokens();
      console.log('✅ [AuthContext] Tokens supprimés avec succès');
    } catch (error) {
      console.error('❌ [AuthContext] Erreur lors de la suppression des tokens:', error);
    } finally {
      console.log('🔄 [AuthContext] Dispatch de l\'action LOGOUT...');
      dispatch({ type: 'LOGOUT' });
      console.log('✅ [AuthContext] Déconnexion terminée');
    }
  };

  // Fonction pour rafraîchir les tokens
  const refreshTokens = async (): Promise<void> => {
    if (!state.tokens?.refresh_token) {
      throw new Error('Aucun refresh token disponible');
    }

    try {
      const newTokens = await authApiService.refreshToken(state.tokens.refresh_token);
      
      // Mettre à jour le stockage sécurisé
      try {
        await secureStorageService.storeTokens(newTokens);
        console.log('✅ [AuthContext] Nouveaux tokens stockés avec succès après refresh');
      } catch (storageError) {
        console.error('❌ [AuthContext] Erreur lors du stockage des nouveaux tokens:', storageError);
        // Cette erreur n'est pas critique, on continue avec les tokens en mémoire
      }
      
      dispatch({ type: 'UPDATE_TOKENS', payload: newTokens });
    } catch (error: any) {
      // Si le refresh échoue, déconnecter l'utilisateur
      const authError: AuthError = {
        code: error.code || 'REFRESH_ERROR',
        message: 'Session expirée, veuillez vous reconnecter',
        details: error.details,
      };
      dispatch({ type: 'SET_ERROR', payload: authError });
      await signOut();
      throw error;
    }
  };

  // Fonction pour effacer les erreurs
  const clearError = (): void => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Fonction pour rafraîchir les licences
  const refreshLicenses = async (): Promise<void> => {
    if (!state.tokens?.access_token) {
      console.warn('Aucun token d\'accès disponible pour rafraîchir les licences');
      return;
    }

    try {
      const licenses = await licenseApiService.getUserLicenses(state.tokens.access_token);
      dispatch({ type: 'SET_LICENSES', payload: licenses });
    } catch (error) {
      console.error('Erreur lors du rafraîchissement des licences:', error);
      // Ne pas lever d'erreur car les licences ne sont pas critiques
    }
  };

  // Fonction pour définir la licence active
  const setActiveLicense = (license: License): void => {
    dispatch({ type: 'SET_ACTIVE_LICENSE', payload: license });
  };

  // Vérifier l'authentification au démarrage
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const storedTokens = await secureStorageService.getTokens();
        
        if (!storedTokens) {
          dispatch({ type: 'SET_LOADING', payload: false });
          return;
        }

        // Vérifier si le token a expiré (logique simplifiée pour le token JWT)
        const isTokenExpired = (token: string): boolean => {
          try {
            // Décoder le payload du JWT (partie du milieu)
            const payload = JSON.parse(atob(token.split('.')[1]));
            const currentTime = Math.floor(Date.now() / 1000);
            return payload.exp < currentTime;
          } catch (error) {
            // Si on ne peut pas décoder le token, le considérer comme expiré
            return true;
          }
        };

        const isExpired = isTokenExpired(storedTokens.access_token);
        
        if (isExpired && storedTokens.refresh_token) {
          // Essayer de rafraîchir le token
          try {
            const newTokens = await authApiService.refreshToken(storedTokens.refresh_token);
            await secureStorageService.storeTokens(newTokens);
            
            // Optionnel : récupérer les infos utilisateur
            let user = null;
            try {
              user = await authApiService.getUserInfo(newTokens.access_token);
            } catch (error) {
              console.warn('Impossible de récupérer les infos utilisateur:', error);
            }
            
            dispatch({ 
              type: 'SET_AUTHENTICATED', 
              payload: { 
                tokens: newTokens,
                user 
              } 
            });

            // Récupérer les licences avec le nouveau token
            try {
              console.log('🔍 [AuthContext] Récupération des licences avec token rafraîchi:', {
                hasToken: !!newTokens.access_token,
                tokenLength: newTokens.access_token?.length || 0
              });
              
              const licenses = await licenseApiService.getUserLicenses(newTokens.access_token);
              
              console.log('✅ [AuthContext] Licences récupérées (token rafraîchi):', {
                count: licenses.length
              });
              
              dispatch({ type: 'SET_LICENSES', payload: licenses });
            } catch (error) {
              console.error('❌ [AuthContext] Erreur licences (token rafraîchi):', error);
            }
          } catch (error) {
            // Échec du refresh, supprimer les tokens
            await secureStorageService.clearTokens();
            dispatch({ type: 'SET_LOADING', payload: false });
          }
        } else if (!isExpired) {
          // Token encore valide
          let user = null;
          try {
            user = await authApiService.getUserInfo(storedTokens.access_token);
          } catch (error) {
            console.warn('Impossible de récupérer les infos utilisateur:', error);
          }
          
          dispatch({ 
            type: 'SET_AUTHENTICATED', 
            payload: { 
              tokens: storedTokens,
              user 
            } 
          });

          // Récupérer les licences avec le token existant
          try {
            console.log('🔍 [AuthContext] Récupération des licences avec token stocké:', {
              hasToken: !!storedTokens.access_token,
              tokenLength: storedTokens.access_token?.length || 0
            });
            
            const licenses = await licenseApiService.getUserLicenses(storedTokens.access_token);
            
            console.log('✅ [AuthContext] Licences récupérées (token stocké):', {
              count: licenses.length
            });
            
            dispatch({ type: 'SET_LICENSES', payload: licenses });
          } catch (error) {
            console.error('❌ [AuthContext] Erreur licences (token stocké):', error);
          }
        } else {
          // Token expiré et pas de refresh token
          await secureStorageService.clearTokens();
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de l\'authentification:', error);
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    checkAuthStatus();
  }, []);

  const value: AuthContextType = {
    ...state,
    signIn,
    signOut,
    refreshTokens,
    refreshLicenses,
    setActiveLicense,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook pour utiliser le contexte d'authentification
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
  }
  return context;
}
