import React, { useEffect } from 'react';
import { router } from 'expo-router';
import { SafeAreaView, StyleSheet, View } from "react-native";
import RecipeList from "../../components/RecipeList";
import { LoadingSpinner, ErrorState } from "../../components";
import { useRecipeApi } from "../../hooks";
import { Recipe } from "../../types/Recipe";

export default function RecipeListScreen() {
  const { recipes, loading, error, getRecipes, clearError } = useRecipeApi();

  useEffect(() => {
    // Charger les recettes au montage du composant
    getRecipes();
  }, [getRecipes]);

  const handleRecipePress = (recipe: Recipe) => {
    // Navigation vers l'écran de détail avec l'UUID de la recette
    router.push(`/recipe-details?id=${recipe.uuid}`);
  };

  const handleRetry = () => {
    clearError();
    getRecipes();
  };

  // État de chargement
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingSpinner message="Chargement des recettes..." />
      </SafeAreaView>
    );
  }

  // État d'erreur
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <ErrorState 
          message={error}
          onRetry={handleRetry}
          retryButtonText="Réessayer"
        />
      </SafeAreaView>
    );
  }

  // État normal avec les données
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <RecipeList 
          recipes={recipes || []}
          onRecipePress={handleRecipePress}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    flex: 1,
  },
});
