import { useMemo, useEffect } from 'react';
import { sampleRecipes } from '../data/sampleRecipes';
import { useRecipeApi } from './useRecipeApi';
import { Recipe } from '../types/Recipe';

export const useRecipe = (id: string | undefined): Recipe | null => {
  const { recipes: apiRecipes, getRecipes } = useRecipeApi();

  // Charger les recettes si elles ne sont pas encore disponibles
  useEffect(() => {
    if (!apiRecipes || apiRecipes.length === 0) {
      getRecipes();
    }
  }, [apiRecipes, getRecipes]);

  return useMemo(() => {
    if (!id) return null;
    
    // Si nous avons des recettes de l'API, les utiliser en priorité
    if (apiRecipes && apiRecipes.length > 0) {
      return apiRecipes.find((recipe) => recipe.uuid === id) || null;
    }
    
    // Sinon, fallback vers les données de sample (pour la compatibilité)
    return sampleRecipes.find((recipe) => recipe.uuid === id) || null;
  }, [id, apiRecipes]);
};
