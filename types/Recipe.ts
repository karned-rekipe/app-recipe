export interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
  created_by: string | null;
}

export interface Step {
  step_number: number;
  title: string;
  description: string;
  total_duration: number; // en minutes
  cooking_duration: number; // en minutes
  rest_duration: number; // en minutes
  preparation_duration: number; // en minutes
  created_by: string | null;
}

export interface Recipe {
  uuid: string;
  name: string;
  description: string | null;
  price: number | null;
  difficulty: number | null;
  quantity: number | null;
  number_of_persons: number | null;
  origin_country: string | null;
  attributes: string[];
  utensils: string[];
  ingredients: Ingredient[];
  steps: Step[];
  thumbnail_url: string | null;
  large_image_url: string | null;
  source_reference: string | null;
  created_by: string | null;
}

// Interface pour la compatibilité avec l'ancien système
export interface LegacyRecipe {
  id: string;
  name: string;
  type: 'entrée' | 'plat' | 'dessert';
  difficulty: 1 | 2 | 3;
  totalTime: number;
  country: string;
  countryFlag: string;
  image?: string;
}
