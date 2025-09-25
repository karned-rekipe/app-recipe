/**
 * Types TypeScript pour le formulaire de recette utilisant React Hook Form
 */

import { Ingredient, Step, ProcessRecipe } from '../../types/Recipe';
import { PriceValue } from './PriceSelector';
import { DifficultyValue } from './DifficultySelector';

// Type pour un processus dans le formulaire (sans created_by)
export interface ProcessFormData {
  name: string | null;
  recipe_uuid: string | null;
  ustensils: string[];
  ingredients: Omit<Ingredient, 'created_by'>[];
  steps: Omit<Step, 'created_by'>[];
}

export interface RecipeFormData {
  name: string;
  description: string;
  price: PriceValue;
  difficulty: DifficultyValue;
  quantity: number;
  number_of_persons: number;
  origin_country: string;
  attributes: string[];
  process: ProcessFormData[];
  thumbnail_url: string;
  large_image_url: string;
  source_reference: string;
}

export type RecipeFormField = keyof RecipeFormData;
