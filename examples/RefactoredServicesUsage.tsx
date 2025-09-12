/**
 * Exemple d'utilisation des services refactorisés selon le SRP
 * Démontre l'utilisation des services avec masquage sécurisé des tokens
 */

import { 
  authApiService,
  secureStorageService,
  licenseApiService,
  recipeApiService,
  authenticatedApiService
} from '../services';
import type { LoginCredentials } from '../types/Auth';

/**
 * Exemple complet d'authentification et récupération de recettes
 */
export class ExampleUsageServices {
  
  /**
   * Flux complet d'authentification
   */
  async authenticateUser(credentials: LoginCredentials) {
    try {
      console.log('🚀 [Example] Début du processus d\'authentification');
      
      // 1. Connexion via le service d'authentification (déjà SRP)
      const authResponse = await authApiService.login(credentials);
      console.log('✅ [Example] Connexion réussie');
      
      // 2. Stockage sécurisé des tokens (service refactorisé SRP)
      await secureStorageService.storeTokens(authResponse.tokens);
      console.log('✅ [Example] Tokens stockés de manière sécurisée');
      
      return authResponse.tokens;
      
    } catch (error) {
      console.error('❌ [Example] Erreur d\'authentification:', error);
      throw error;
    }
  }

  /**
   * Récupération et gestion des licences
   */
  async getUserLicenseInfo(accessToken: string) {
    try {
      console.log('🔍 [Example] Récupération des informations de licence');
      
      // Service de licence (déjà SRP) avec logs sécurisés
      const licenses = await licenseApiService.getUserLicenses(accessToken);
      console.log('✅ [Example] Licences récupérées:', licenses.length);
      
      // Recherche de la licence pour les recettes
      const recipeLicense = await licenseApiService.getRecipeLicense(accessToken);
      
      if (!recipeLicense) {
        throw new Error('Aucune licence recette valide trouvée');
      }
      
      console.log('✅ [Example] Licence recette trouvée:', {
        uuid: recipeLicense.uuid.substring(0, 8) + '...',
        name: recipeLicense.name
      });
      
      return { licenses, recipeLicense };
      
    } catch (error) {
      console.error('❌ [Example] Erreur de licence:', error);
      throw error;
    }
  }

  /**
   * Récupération des recettes avec le service refactorisé
   */
  async fetchRecipes() {
    try {
      console.log('🍳 [Example] Récupération des recettes');
      
      // 1. Récupération des tokens stockés (service refactorisé SRP)
      const tokens = await secureStorageService.getTokens();
      if (!tokens) {
        throw new Error('Aucun token d\'authentification trouvé');
      }
      
      // 2. Vérification de l'expiration (service refactorisé SRP)
      const isExpired = await secureStorageService.isTokenExpired();
      if (isExpired) {
        throw new Error('Token expiré, reconnexion nécessaire');
      }
      
      // 3. Récupération de la licence
      const recipeLicense = await licenseApiService.getRecipeLicense(tokens.access_token);
      if (!recipeLicense) {
        throw new Error('Licence recette requise');
      }
      
      // 4. Appel API recettes (service refactorisé SRP)
      const response = await recipeApiService.getRecipes(tokens, recipeLicense);
      
      if (response.status === 'success' && response.data) {
        console.log('✅ [Example] Recettes récupérées:', response.data.length);
        return response.data;
      } else {
        throw new Error(response.error || 'Erreur lors de la récupération des recettes');
      }
      
    } catch (error) {
      console.error('❌ [Example] Erreur récupération recettes:', error);
      throw error;
    }
  }

  /**
   * Exemple d'utilisation du service API authentifié générique
   */
  async makeCustomApiCall(endpoint: string, method: 'GET' | 'POST' = 'GET', body?: any) {
    try {
      console.log(`🌐 [Example] Appel API personnalisé: ${method} ${endpoint}`);
      
      // 1. Récupération des tokens (service refactorisé SRP)
      const tokens = await secureStorageService.getTokens();
      if (!tokens) {
        throw new Error('Authentification requise');
      }
      
      // 2. Récupération de la licence si nécessaire
      const license = await licenseApiService.getRecipeLicense(tokens.access_token);
      
      // 3. Appel via le service authentifié (service refactorisé SRP)
      const response = method === 'GET' 
        ? await authenticatedApiService.get(endpoint, tokens, license)
        : await authenticatedApiService.post(endpoint, body, tokens, license);
      
      console.log('✅ [Example] Appel API réussi:', response.status);
      return response;
      
    } catch (error) {
      console.error('❌ [Example] Erreur appel API:', error);
      throw error;
    }
  }

  /**
   * Déconnexion sécurisée
   */
  async logout() {
    try {
      console.log('🚪 [Example] Déconnexion en cours');
      
      // Suppression sécurisée des tokens (service refactorisé SRP)
      await secureStorageService.clearTokens();
      
      console.log('✅ [Example] Déconnexion réussie, tokens supprimés');
      
    } catch (error) {
      console.error('❌ [Example] Erreur lors de la déconnexion:', error);
      throw error;
    }
  }

  /**
   * Rafraîchissement automatique des tokens
   */
  async refreshTokensIfNeeded() {
    try {
      console.log('🔄 [Example] Vérification de l\'expiration des tokens');
      
      // 1. Vérification de l'expiration (service refactorisé SRP)
      const isExpired = await secureStorageService.isTokenExpired();
      
      if (!isExpired) {
        console.log('✅ [Example] Tokens encore valides');
        return await secureStorageService.getTokens();
      }
      
      console.log('⏰ [Example] Tokens expirés, rafraîchissement nécessaire');
      
      // 2. Récupération des tokens actuels
      const currentTokens = await secureStorageService.getTokens();
      if (!currentTokens?.refresh_token) {
        throw new Error('Refresh token manquant, reconnexion complète nécessaire');
      }
      
      // 3. Rafraîchissement (service d'auth déjà SRP)
      const newTokens = await authApiService.refreshToken(currentTokens.refresh_token);
      
      // 4. Stockage des nouveaux tokens (service refactorisé SRP)
      await secureStorageService.storeTokens(newTokens);
      
      console.log('✅ [Example] Tokens rafraîchis avec succès');
      return newTokens;
      
    } catch (error) {
      console.error('❌ [Example] Erreur rafraîchissement tokens:', error);
      // En cas d'erreur, supprimer les tokens corrompus
      await secureStorageService.clearTokens();
      throw error;
    }
  }

  /**
   * Flux complet : connexion → récupération recettes → déconnexion
   */
  async completeWorkflow(credentials: LoginCredentials) {
    try {
      console.log('🎯 [Example] Début du flux complet');
      
      // 1. Authentification
      await this.authenticateUser(credentials);
      
      // 2. Récupération des licences
      const tokens = await secureStorageService.getTokens();
      if (!tokens) throw new Error('Tokens manquants après authentification');
      
      await this.getUserLicenseInfo(tokens.access_token);
      
      // 3. Récupération des recettes
      const recipes = await this.fetchRecipes();
      
      console.log('✅ [Example] Flux complet réussi:', {
        recipesCount: recipes.length
      });
      
      return recipes;
      
    } catch (error) {
      console.error('❌ [Example] Erreur dans le flux complet:', error);
      
      // Nettoyage en cas d'erreur
      await this.logout();
      throw error;
    }
  }
}

// Export de l'instance pour utilisation
export const exampleUsage = new ExampleUsageServices();

/**
 * Exemples d'utilisation rapide
 */
export const quickExamples = {
  
  // Authentification simple
  async simpleAuth(username: string, password: string) {
    return exampleUsage.authenticateUser({ username, password });
  },
  
  // Récupération rapide des recettes
  async quickRecipes() {
    return exampleUsage.fetchRecipes();
  },
  
  // Vérification du statut d'authentification
  async checkAuthStatus() {
    const tokens = await secureStorageService.getTokens();
    const isExpired = await secureStorageService.isTokenExpired();
    
    return {
      isAuthenticated: !!tokens,
      isExpired,
      needsRefresh: isExpired && !!tokens
    };
  }
};
