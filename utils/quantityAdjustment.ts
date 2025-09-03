import { Ingredient } from '../types/Recipe';

/**
 * Arrondit un nombre à un maximum de 2 décimales en évitant les décimales inutiles
 */
export const roundToMaxDecimals = (num: number, maxDecimals: number = 2): number => {
  const factor = Math.pow(10, maxDecimals);
  const rounded = Math.round(num * factor) / factor;
  
  // Évite les décimales inutiles (ex: 2.00 devient 2)
  return Number(rounded.toFixed(maxDecimals).replace(/\.?0+$/, ''));
};

/**
 * Calcule le facteur de multiplication basé sur le nombre de personnes original et nouveau
 */
export const calculateScalingFactor = (originalPersons: number, newPersons: number): number => {
  if (originalPersons === 0) return 1;
  return newPersons / originalPersons;
};

/**
 * Ajuste la quantité d'un ingrédient selon le facteur de multiplication
 */
export const adjustIngredientQuantity = (ingredient: Ingredient, scalingFactor: number): Ingredient => {
  // Si la quantité est 0 ou le facteur est 1, pas besoin d'ajuster
  if (ingredient.quantity === 0 || scalingFactor === 1) {
    return ingredient;
  }

  const adjustedQuantity = ingredient.quantity * scalingFactor;
  
  return {
    ...ingredient,
    quantity: roundToMaxDecimals(adjustedQuantity, 2),
  };
};

/**
 * Ajuste toutes les quantités d'une liste d'ingrédients
 */
export const adjustIngredientsQuantities = (
  ingredients: Ingredient[], 
  originalPersons: number, 
  newPersons: number
): Ingredient[] => {
  const scalingFactor = calculateScalingFactor(originalPersons, newPersons);
  
  return ingredients.map(ingredient => adjustIngredientQuantity(ingredient, scalingFactor));
};

/**
 * Formate une quantité pour l'affichage (évite .00, garde maximum 2 décimales)
 */
export const formatQuantityForDisplay = (quantity: number): string => {
  if (quantity === Math.floor(quantity)) {
    return quantity.toString();
  }
  
  return roundToMaxDecimals(quantity, 2).toString();
};
