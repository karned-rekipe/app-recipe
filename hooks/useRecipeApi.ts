/**
 * Hook pour la gestion des appels API des recettes
 * Responsabilité unique : interface React pour le service des recettes
 */

import { useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { recipeApiService, type RecipeApiResponse } from '../services/RecipeApiService';
import type { Recipe } from '../types/Recipe';

interface UseRecipeApiReturn {
  recipes: Recipe[] | null;
  loading: boolean;
  error: string | null;
  getRecipes: () => Promise<void>;
  clearError: () => void;
}

/**
 * Hook pour gérer les appels API des recettes
 */
export function useRecipeApi(): UseRecipeApiReturn {
  const { tokens, activeLicense, isAuthenticated } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const getRecipes = useCallback(async () => {
    console.log('[useRecipeApi] 🚀 Début de getRecipes');
    console.log('[useRecipeApi] 🔍 État actuel:', {
      isAuthenticated,
      hasTokens: !!tokens,
      hasActiveLicense: !!activeLicense,
      activeLicenseName: activeLicense?.name,
      activeLicenseUuid: activeLicense?.uuid?.substring(0, 8) + '...',
      hasApiRoles: !!activeLicense?.api_roles,
      hasRecipeRoles: activeLicense?.api_roles ? !!activeLicense.api_roles['api-recipe'] : false,
      recipeRoles: activeLicense?.api_roles?.['api-recipe']?.roles
    });

    // Vérifications préalables
    if (!isAuthenticated || !tokens) {
      console.error('[useRecipeApi] ❌ Utilisateur non authentifié');
      setError('Utilisateur non authentifié');
      return;
    }

    if (!activeLicense) {
      console.error('[useRecipeApi] ❌ Aucune licence active trouvée');
      setError('Aucune licence active trouvée');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('[useRecipeApi] Récupération des recettes...');
      
      const response: RecipeApiResponse<Recipe[]> = await recipeApiService.getRecipes(
        tokens,
        activeLicense
      );

      if (response.status === 'success' && response.data) {
        console.log('[useRecipeApi] Recettes récupérées avec succès:', response.data.length);
        setRecipes(response.data);
        setError(null);
      } else {
        console.error('[useRecipeApi] Erreur lors de la récupération des recettes:', response.error);
        setError(response.error || response.message || 'Erreur inconnue');
        setRecipes(null);
      }
    } catch (err) {
      console.error('[useRecipeApi] Erreur inattendue:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erreur inattendue lors de la récupération des recettes';
      setError(errorMessage);
      setRecipes(null);
    } finally {
      setLoading(false);
    }
  }, [tokens, activeLicense, isAuthenticated]);

  return {
    recipes,
    loading,
    error,
    getRecipes,
    clearError,
  };
}
