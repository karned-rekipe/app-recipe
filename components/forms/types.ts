/**
 * Types TypeScript pour le formulaire de recette utilisant React Hook Form
 */

import { Ingredient, Step } from '../../types/Recipe';
import { PriceValue } from './PriceSelector';

export interface RecipeFormData {
  name: string;
  description: string;
  price: PriceValue;
  quantity: number;
  number_of_persons: number;
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
