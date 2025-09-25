export interface Ingredient {
    name: string;
    quantity: number;
    unit: string;
}

export interface Step {
    step_number: number;
    title: string;
    description: string | null;
    duration: number; // en secondes
    cooking_duration: number; // en secondes
    rest_duration: number; // en secondes
    preparation_duration: number; // en secondes
}

export interface ProcessRecipe {
    name: string | null,
    recipe_uuid: string | null,
    utensils: string[];
    ingredients: Ingredient[];
    steps: Step[];
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
    process: ProcessRecipe[]
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
