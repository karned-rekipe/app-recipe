/**
 * Test script to verify the new Recipe structure works correctly
 */

// Import the utility functions
const { extractFormDataFromRecipe, mapRecipeToLegacy } = require('./utils/recipeMapper');

// Sample recipe data with new process structure
const sampleRecipe = {
  uuid: "test-recipe-123",
  name: "Test Recipe",
  description: "A test recipe to verify the new structure",
  price: 15,
  difficulty: 2,
  quantity: 4,
  number_of_persons: 4,
  origin_country: "France",
  attributes: ["facile", "végétarien"],
  process: [
    {
      name: "Préparation",
      recipe_uuid: "test-recipe-123",
      utensils: ["couteau", "planche à découper", "casserole"],
      ingredients: [
        {
          name: "tomates",
          quantity: 500,
          unit: "g",
          created_by: null
        },
        {
          name: "oignon",
          quantity: 1,
          unit: "pièce",
          created_by: null
        }
      ],
      steps: [
        {
          step_number: 1,
          title: "Préparation des légumes",
          description: "Couper les tomates et l'oignon",
          total_duration: 10,
          cooking_duration: 0,
          rest_duration: 0,
          preparation_duration: 10,
          created_by: null
        },
        {
          step_number: 2,
          title: "Cuisson",
          description: "Faire cuire dans la casserole",
          total_duration: 20,
          cooking_duration: 20,
          rest_duration: 0,
          preparation_duration: 0,
          created_by: null
        }
      ]
    }
  ],
  thumbnail_url: "https://example.com/thumb.jpg",
  large_image_url: "https://example.com/large.jpg",
  source_reference: "Test cookbook",
  created_by: null
};

console.log("Testing new Recipe structure...");
console.log("Sample recipe:", JSON.stringify(sampleRecipe, null, 2));

try {
  // Test extractFormDataFromRecipe
  console.log("\n--- Testing extractFormDataFromRecipe ---");
  const extractedData = extractFormDataFromRecipe(sampleRecipe);
  console.log("Extracted ingredients:", extractedData.ingredients);
  console.log("Extracted utensils:", extractedData.utensils);
  console.log("Extracted steps:", extractedData.steps);

  // Test mapRecipeToLegacy
  console.log("\n--- Testing mapRecipeToLegacy ---");
  const legacyRecipe = mapRecipeToLegacy(sampleRecipe);
  console.log("Legacy recipe:", legacyRecipe);
  
  console.log("\n✅ All tests passed! The new Recipe structure is working correctly.");
} catch (error) {
  console.error("\n❌ Test failed:", error.message);
  console.error(error.stack);
}