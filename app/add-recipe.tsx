/**
 * Écran pour ajouter une nouvelle recette
 */

import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { RecipeForm } from '../components/forms/RecipeForm';
import { theme } from '../constants/theme';

export default function AddRecipeScreen() {
  const handleSave = (recipeData: any) => {
    // TODO: Implémenter l'enregistrement de la recette
    console.log('Nouvelle recette:', recipeData);
    
    // Pour le moment, on simule la sauvegarde et on retourne à la liste
    // Plus tard, vous pourrez intégrer l'API ici
    router.back();
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <RecipeForm
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
