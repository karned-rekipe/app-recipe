import { useMemo } from 'react';
import { sampleRecipes } from '../data/sampleRecipes';
import { Recipe } from '../types/Recipe';

export const useRecipe = (id: string | undefined): Recipe | null => {
  return useMemo(() => {
    if (!id) return null;
    return sampleRecipes.find((recipe) => recipe.id === id) || null;
  }, [id]);
};
