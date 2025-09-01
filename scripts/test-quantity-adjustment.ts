/**
 * Test rapide pour valider les fonctions d'ajustement des quantités
 */

import { 
  roundToMaxDecimals, 
  calculateScalingFactor, 
  adjustIngredientQuantity, 
  adjustIngredientsQuantities,
  formatQuantityForDisplay 
} from '../utils/quantityAdjustment';
import { Ingredient } from '../types/Recipe';

// Test des fonctions utilitaires
const testQuantityAdjustment = () => {
  console.log('🧪 Test des fonctions d\'ajustement des quantités\n');

  // Test roundToMaxDecimals
  console.log('📐 Test roundToMaxDecimals:');
  console.log('roundToMaxDecimals(2.6666666, 2) =', roundToMaxDecimals(2.6666666, 2)); // Attendu: 2.67
  console.log('roundToMaxDecimals(2.0, 2) =', roundToMaxDecimals(2.0, 2)); // Attendu: 2
  console.log('roundToMaxDecimals(1.50, 2) =', roundToMaxDecimals(1.50, 2)); // Attendu: 1.5
  console.log('roundToMaxDecimals(1.999, 2) =', roundToMaxDecimals(1.999, 2)); // Attendu: 2
  console.log();

  // Test calculateScalingFactor
  console.log('⚖️  Test calculateScalingFactor:');
  console.log('calculateScalingFactor(4, 6) =', calculateScalingFactor(4, 6)); // Attendu: 1.5
  console.log('calculateScalingFactor(2, 1) =', calculateScalingFactor(2, 1)); // Attendu: 0.5
  console.log('calculateScalingFactor(4, 4) =', calculateScalingFactor(4, 4)); // Attendu: 1
  console.log();

  // Test formatQuantityForDisplay
  console.log('🎨 Test formatQuantityForDisplay:');
  console.log('formatQuantityForDisplay(2) =', formatQuantityForDisplay(2)); // Attendu: "2"
  console.log('formatQuantityForDisplay(2.5) =', formatQuantityForDisplay(2.5)); // Attendu: "2.5"
  console.log('formatQuantityForDisplay(2.67) =', formatQuantityForDisplay(2.67)); // Attendu: "2.67"
  console.log();

  // Test avec des ingrédients
  const testIngredients: Ingredient[] = [
    { name: 'Farine', quantity: 250, unit: 'g', created_by: null },
    { name: 'Lait', quantity: 500, unit: 'ml', created_by: null },
    { name: 'Œufs', quantity: 3, unit: '', created_by: null },
    { name: 'Sucre', quantity: 2, unit: 'cuillères à soupe', created_by: null },
    { name: 'Sel', quantity: 0.5, unit: 'cuillère à café', created_by: null },
  ];

  console.log('🥘 Test adjustIngredientsQuantities:');
  console.log('Recette originale pour 4 personnes:');
  testIngredients.forEach(ingredient => {
    const quantityDisplay = ingredient.unit 
      ? `${formatQuantityForDisplay(ingredient.quantity)} ${ingredient.unit}`
      : formatQuantityForDisplay(ingredient.quantity);
    console.log(`- ${ingredient.name}: ${quantityDisplay}`);
  });

  console.log('\n📈 Ajusté pour 6 personnes (x1.5):');
  const adjustedFor6 = adjustIngredientsQuantities(testIngredients, 4, 6);
  adjustedFor6.forEach(ingredient => {
    const quantityDisplay = ingredient.unit 
      ? `${formatQuantityForDisplay(ingredient.quantity)} ${ingredient.unit}`
      : formatQuantityForDisplay(ingredient.quantity);
    console.log(`- ${ingredient.name}: ${quantityDisplay}`);
  });

  console.log('\n📉 Ajusté pour 2 personnes (x0.5):');
  const adjustedFor2 = adjustIngredientsQuantities(testIngredients, 4, 2);
  adjustedFor2.forEach(ingredient => {
    const quantityDisplay = ingredient.unit 
      ? `${formatQuantityForDisplay(ingredient.quantity)} ${ingredient.unit}`
      : formatQuantityForDisplay(ingredient.quantity);
    console.log(`- ${ingredient.name}: ${quantityDisplay}`);
  });

  console.log('\n✅ Tests terminés!');
};

// Exécuter les tests si le fichier est lancé directement
if (require.main === module) {
  testQuantityAdjustment();
}

export { testQuantityAdjustment };
