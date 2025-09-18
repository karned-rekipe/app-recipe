import { useMemo } from 'react';
import { sampleRecipes } from '../data/sampleRecipes';
import { useRecipeApi } from './useRecipeApi';
import { Recipe } from '../types/Recipe';

/**
 * Hook pour récupérer toutes les recettes disponibles
 * Nécessaire pour résoudre les références recipe_uuid
 */
export const useAllRecipes = (): Recipe[] => {
  const { recipes: apiRecipes } = useRecipeApi();

  return useMemo(() => {
    // Si nous avons des recettes de l'API, les utiliser en priorité
    if (apiRecipes && apiRecipes.length > 0) {
      return apiRecipes;
    }
    
    // Sinon, fallback vers les données de sample
    return sampleRecipes;
  }, [apiRecipes]);
};