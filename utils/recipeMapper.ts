import { Recipe, LegacyRecipe } from '../types/Recipe';

// Mapping des pays vers leurs emojis
const countryFlags: { [key: string]: string } = {
  'France': '🇫🇷',
  'Italie': '🇮🇹',
  'Espagne': '🇪🇸',
  'Thaïlande': '🇹🇭',
  'Inde': '🇮🇳',
  'États-Unis': '🇺🇸',
  'Portugal': '🇵🇹',
  'Chine': '🇨🇳',
  'Japon': '🇯🇵',
  'Mexique': '🇲🇽',
  'Maroc': '🇲🇦',
  'Grèce': '🇬🇷',
  'Allemagne': '🇩🇪',
  'Royaume-Uni': '🇬🇧',
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

// Calcule le temps total basé sur les étapes
const calculateTotalTime = (steps: Recipe['steps']): number => {
  let totalMinutes = 0;
  
  for (const step of steps) {
    if (step.duration) {
      const duration = step.duration.toLowerCase();
      const numbers = duration.match(/\d+/g);
      
      if (numbers) {
        const value = parseInt(numbers[0]);
        if (duration.includes('heure')) {
          totalMinutes += value * 60;
        } else if (duration.includes('minute')) {
          totalMinutes += value;
        }
      }
    }
  }
  
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
    totalTime: calculateTotalTime(recipe.steps),
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
