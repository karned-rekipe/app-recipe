/**
 * Service API pour la gestion des recettes
 * Responsabilité unique : appels API vers le service de recettes
 */

import config from '../config/api';
import type { AuthTokens } from '../types/Auth';
import type { License } from '../types/License';
import type { Recipe } from '../types/Recipe';

export interface RecipeApiResponse<T = any> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
  error?: string;
}

/**
 * Service pour les appels API liés aux recettes
 */
class RecipeApiService {
  private static instance: RecipeApiService;

  private constructor() {}

  public static getInstance(): RecipeApiService {
    if (!RecipeApiService.instance) {
      RecipeApiService.instance = new RecipeApiService();
    }
    return RecipeApiService.instance;
  }

  /**
   * Récupère la liste des recettes
   * @param tokens - Tokens d'authentification
   * @param license - Licence active
   * @returns Promise<RecipeApiResponse<Recipe[]>>
   */
  async getRecipes(
    tokens: AuthTokens,
    license: License
  ): Promise<RecipeApiResponse<Recipe[]>> {
    try {
      const url = `${config.RECIPE_API_URL}${config.recipe.list}`;
      
      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${tokens.access_token}`,
        'X-License-Key': license.uuid,
      };

      console.log(`[RecipeApiService] Récupération des recettes depuis ${url}`);

      const response = await fetch(url, {
        method: 'GET',
        headers,
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error('[RecipeApiService] Erreur lors de la récupération des recettes:', {
          status: response.status,
          statusText: response.statusText,
          data: responseData
        });

        return {
          status: 'error',
          error: responseData?.message || responseData?.detail || `Erreur HTTP ${response.status}`,
          message: 'Impossible de récupérer les recettes'
        };
      }

      console.log('[RecipeApiService] Recettes récupérées avec succès:', {
        count: Array.isArray(responseData) ? responseData.length : 'Format inattendu'
      });

      // Vérification que la réponse est un tableau
      if (!Array.isArray(responseData)) {
        console.warn('[RecipeApiService] Format de réponse inattendu, attendu un tableau:', responseData);
        return {
          status: 'error',
          error: 'Format de données invalide',
          message: 'Les données reçues ne sont pas dans le format attendu'
        };
      }

      return {
        status: 'success',
        data: responseData as Recipe[],
        message: `${responseData.length} recette(s) récupérée(s)`
      };

    } catch (error) {
      console.error('[RecipeApiService] Erreur réseau lors de la récupération des recettes:', error);
      
      return {
        status: 'error',
        error: error instanceof Error ? error.message : 'Erreur réseau inconnue',
        message: 'Erreur de connexion au service des recettes'
      };
    }
  }
}

// Instance singleton exportée
export const recipeApiService = RecipeApiService.getInstance();

export { RecipeApiService };
