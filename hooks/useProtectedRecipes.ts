/**
 * Hook exemple pour récupérer des recettes protégées via l'API
 * Démontre l'utilisation de useApiRequest avec authentification
 * 
 * ⚠️ ATTENTION: Ce hook contient des URLs d'exemple qui ne sont pas fonctionnelles
 * Il s'agit d'un exemple de démonstration pour les appels API protégés
 */

import { useState, useEffect, useCallback } from 'react';
import { useApiRequest } from './useApiRequest';
import type { Recipe } from '../types/Recipe';

interface ApiRecipeResponse {
  recipes: Recipe[];
  total: number;
  page: number;
}

interface UseProtectedRecipesOptions {
  autoFetch?: boolean;
  page?: number;
  limit?: number;
}

export function useProtectedRecipes(options: UseProtectedRecipesOptions = {}) {
  const { autoFetch = true, page = 1, limit = 20 } = options;
  const { get } = useApiRequest();
  
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const fetchRecipes = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // URL de votre API protégée (à adapter selon votre API)
      const response = await get<ApiRecipeResponse>(
        `https://api.karned.bzh/api/v1/recipes?page=${page}&limit=${limit}`,
        {
          requireAuth: true, // Force l'authentification
        }
      );

      if (response.error) {
        setError(response.error);
      } else if (response.data) {
        setRecipes(response.data.recipes);
        setTotal(response.data.total);
      }
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la récupération des recettes');
    } finally {
      setLoading(false);
    }
  }, [get, page, limit]);

  const createRecipe = useCallback(async (recipeData: Omit<Recipe, 'id'>) => {
    setLoading(true);
    setError(null);

    try {
      const response = await get<Recipe>(
        'https://api.karned.bzh/api/v1/recipes',
        {
          requireAuth: true,
        }
      );

      if (response.error) {
        setError(response.error);
        return null;
      } else if (response.data) {
        // Ajouter la nouvelle recette à la liste
        setRecipes(prev => [response.data!, ...prev]);
        return response.data;
      }
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la création de la recette');
      return null;
    } finally {
      setLoading(false);
    }
  }, [get]);

  const updateRecipe = useCallback(async (id: string, recipeData: Partial<Recipe>) => {
    setLoading(true);
    setError(null);

    try {
      const response = await get<Recipe>(
        `https://api.karned.bzh/api/v1/recipes/${id}`,
        {
          requireAuth: true,
        }
      );

      if (response.error) {
        setError(response.error);
        return null;
      } else if (response.data) {
        // Mettre à jour la recette dans la liste
        setRecipes(prev => 
          prev.map(recipe => 
            recipe.uuid === id ? response.data! : recipe
          )
        );
        return response.data;
      }
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la mise à jour de la recette');
      return null;
    } finally {
      setLoading(false);
    }
  }, [get]);

  const deleteRecipe = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await get<{ success: boolean }>(
        `https://api.karned.bzh/api/v1/recipes/${id}`,
        {
          requireAuth: true,
        }
      );

      if (response.error) {
        setError(response.error);
        return false;
      } else if (response.data?.success) {
        // Supprimer la recette de la liste
        setRecipes(prev => prev.filter(recipe => recipe.uuid !== id));
        return true;
      }
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la suppression de la recette');
      return false;
    } finally {
      setLoading(false);
    }
  }, [get]);

  const refreshRecipes = useCallback(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  // Auto-fetch au montage si demandé
  useEffect(() => {
    if (autoFetch) {
      fetchRecipes();
    }
  }, [autoFetch, fetchRecipes]);

  return {
    recipes,
    loading,
    error,
    total,
    fetchRecipes,
    createRecipe,
    updateRecipe,
    deleteRecipe,
    refreshRecipes,
  };
}
