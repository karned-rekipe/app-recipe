/**
 * Script de test pour l'API des recettes
 * Usage: npx tsx scripts/test-recipe-api.ts
 */

// Ce script n'est pas utilisé dans l'app mais peut servir pour tester l'API
// Exemple de structure si on voulait tester manuellement

export const testRecipeApiCall = {
  method: 'GET' as const,
  url: 'http://localhost:9005/recipe/v1/',
  headers: {
    'accept': 'application/json',
    'Authorization': 'Bearer eyJhbGciOiJSUzI1...',
    'X-License-Key': 'b1b2c3d4-e5f6-7890-1234-567890ghijk'
  }
};

// Fonction utilitaire pour tester l'API (pour le développement)
export async function testRecipeApiWithCurl() {
  const curlCommand = `curl -X 'GET' \\
  'http://localhost:9005/recipe/v1/' \\
  -H 'accept: application/json' \\
  -H 'Authorization: Bearer eyJhbGciOiJSUzI1...' \\
  -H 'X-License-Key: b1b2c3d4-e5f6-7890-1234-567890ghijk'`;
  
  console.log('Commande curl de test:');
  console.log(curlCommand);
}

// Exemple d'utilisation en mode développement
if (require.main === module) {
  testRecipeApiWithCurl();
}
