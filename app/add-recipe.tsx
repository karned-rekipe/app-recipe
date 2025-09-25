/**
 * Écran pour ajouter une nouvelle recette
 */

import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { SuperModernRecipeForm, RecipeFormData } from '../components/forms';
import { theme } from '../constants/theme';
import { useAuth } from '../contexts/AuthContext';
import { recipeApiService } from '../services/RecipeApiService';

export default function AddRecipeScreen() {
  const { tokens, activeLicense, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async (recipeData: RecipeFormData) => {
    // Vérifications d'authentification
    if (!isAuthenticated || !tokens) {
      Alert.alert('Erreur', 'Utilisateur non authentifié');
      return;
    }

    if (!activeLicense) {
      Alert.alert('Erreur', 'Aucune licence active trouvée');
      return;
    }

    setIsLoading(true);

    try {
      console.log('Enregistrement de la nouvelle recette:', recipeData);
      
      // Appel à l'API pour enregistrer la recette
      const response = await recipeApiService.addRecipe(
        tokens,
        activeLicense,
        recipeData
      );

      if (response.status === 'success') {
        console.log('Recette enregistrée avec succès:', response.data);
        Alert.alert('Succès', 'Recette ajoutée avec succès', [
          { text: 'OK', onPress: () => router.back() }
        ]);
      } else {
        console.error('Erreur lors de l\'enregistrement:', response.error);
        Alert.alert('Erreur', response.message || 'Erreur lors de l\'ajout de la recette');
      }
    } catch (error) {
      console.error('Erreur inattendue:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur inattendue lors de l\'ajout de la recette';
      Alert.alert('Erreur', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <SuperModernRecipeForm
        onSave={handleSave}
        onCancel={handleCancel}
        isLoading={isLoading}
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
