import { Recipe, LegacyRecipe } from '../types/Recipe';

// Mapping des pays vers leurs emojis
const countryFlags: { [key: string]: string } = {
  'Allemagne': '🇩🇪',
  'Chine': '🇨🇳',
  'Espagne': '🇪🇸',
  'États-Unis': '🇺🇸',
  'France': '🇫🇷',
  'Grèce': '🇬🇷',
  'Inde': '🇮🇳',
  'Italie': '🇮🇹',
  'Japon': '🇯🇵',
  'Maroc': '🇲🇦',
  'Mexique': '🇲🇽',
  'Portugal': '🇵🇹',
  'Royaume-Uni': '🇬🇧',
  'Thaïlande': '🇹🇭'
};

// Mapping des attributs vers les types de recettes
const getRecipeType = (attributes: string[]): 'entrée' | 'plat' | 'dessert' => {
  const lowerAttribs = attributes.map(attr => attr.toLowerCase());
  
  if (lowerAttribs.some(attr => attr.includes('entrée') || attr.includes('apéritif'))) {
    return 'entrée';
  }
  if (lowerAttribs.some(attr => attr.includes('dessert') || attr.includes('sucré'))) {
    return 'dessert';
  }
  return 'plat'; // Par défaut
};

// Mapping des attributs vers la difficulté
const getDifficulty = (attributes: string[]): 1 | 2 | 3 => {
  const lowerAttribs = attributes.map(attr => attr.toLowerCase());
  
  if (lowerAttribs.some(attr => attr.includes('facile') || attr.includes('simple'))) {
    return 1;
  }
  if (lowerAttribs.some(attr => attr.includes('difficile') || attr.includes('expert') || attr.includes('complexe'))) {
    return 3;
  }
  return 2; // Moyen par défaut
};

// Calcule le temps total basé sur les étapes dans les process
const calculateTotalTime = (processes: Recipe['process']): number => {
  // Utilisation de .flatMap() pour aplatir les étapes et .reduce() pour calculer la somme
  const totalMinutes = processes
    .flatMap(process => process.steps)
    .reduce((total, step) => {
      // Utilise total_duration en minutes depuis la nouvelle interface
      return total + (step.total_duration || 0);
    }, 0);
  
  return totalMinutes || 30; // Par défaut 30 minutes si pas de durée spécifiée
};

/**
 * Convertit une recette API vers le format legacy pour compatibilité
 */
export const mapRecipeToLegacy = (recipe: Recipe): LegacyRecipe => {
  return {
    id: recipe.uuid,
    name: recipe.name,
    type: getRecipeType(recipe.attributes),
    difficulty: getDifficulty(recipe.attributes),
    totalTime: calculateTotalTime(recipe.process),
    country: recipe.origin_country || 'France',
    countryFlag: countryFlags[recipe.origin_country || 'France'] || '🌍',
    image: recipe.thumbnail_url || recipe.large_image_url || undefined,
  };
};

/**
 * Convertit une liste de recettes API vers le format legacy
 */
export const mapRecipesToLegacy = (recipes: Recipe[]): LegacyRecipe[] => {
  return recipes.map(mapRecipeToLegacy);
};

/**
 * Extrait les données des processus vers un format plat pour les formulaires
 */
export const extractFormDataFromRecipe = (recipe: Recipe) => {
  const allIngredients = recipe.process.flatMap(process => process.ingredients);
  const allUtensils = recipe.process.flatMap(process => process.utensils);
  const allSteps = recipe.process.flatMap(process => process.steps);

  return {
    ingredients: allIngredients,
    utensils: allUtensils,
    steps: allSteps
  };
};

/**
 * Résout une recette référencée par son UUID
 * @param recipeUuid UUID de la recette à résoudre
 * @param availableRecipes Liste des recettes disponibles
 * @returns La recette trouvée ou null
 */
export const resolveReferencedRecipe = (recipeUuid: string, availableRecipes: Recipe[]): Recipe | null => {
  return availableRecipes.find(recipe => recipe.uuid === recipeUuid) || null;
};

/**
 * Vérifie si un processus référence une autre recette
 * @param process Le processus à vérifier
 * @returns true si le processus a un recipe_uuid non null
 */
export const isReferencedProcess = (process: Recipe['process'][0]): boolean => {
  return process.recipe_uuid !== null && process.recipe_uuid !== undefined;
};

/**
 * Convertit des données de formulaire vers la structure de processus
 */
export const convertFormDataToProcesses = (formData: {
  ingredients: any[],
  utensils: string[],
  steps: any[]
}) => {
  // Pour simplifier, on crée un seul processus avec toutes les données
  // Cette logique peut être étendue pour gérer plusieurs processus si nécessaire
  return [{
    name: "Processus principal",
    recipe_uuid: null,
    utensils: formData.utensils,
    ingredients: formData.ingredients.map(ing => ({
      ...ing,
      created_by: null
    })),
    steps: formData.steps.map(step => ({
      ...step,
      created_by: null
    }))
  }];
};
