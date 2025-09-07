/**
 * Types TypeScript pour le formulaire de recette utilisant React Hook Form
 */

import { Ingredient, Step } from '../../types/Recipe';

export interface RecipeFormData {
  name: string;
  description: string;
  price: string;
  quantity: string;
  number_of_persons: string;
  origin_country: string;
  attributes: string[];
  utensils: string[];
  ingredients: Omit<Ingredient, 'created_by'>[];
  steps: Omit<Step, 'created_by'>[];
  thumbnail_url: string;
  large_image_url: string;
  source_reference: string;
}

export type RecipeFormField = keyof RecipeFormData;
