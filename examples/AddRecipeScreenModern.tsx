/**
 * Exemple d'utilisation du nouveau formulaire de recette avec React Hook Form
 * Remplacez simplement RecipeForm par ModernRecipeForm dans add-recipe.tsx
 */

import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { ModernRecipeForm, RecipeFormData } from '../components/forms';
import { theme } from '../constants/theme';

export default function AddRecipeScreenModern() {
  const handleSave = (recipeData: RecipeFormData) => {
    // TODO: Implémenter l'enregistrement de la recette
    console.log('Nouvelle recette:', recipeData);
    
    // Ici vous pourrez intégrer l'API pour sauvegarder la recette
    // Example:
    // await recipeApiService.createRecipe(recipeData);
    
    router.back();
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ModernRecipeForm
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.white,
  },
});
