/**
 * Composant de test pour vérifier les améliorations du formulaire
 */

import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { SuperModernRecipeForm } from '../components/forms/SuperModernRecipeForm';
import { RecipeFormData } from '../components/forms';
import { theme } from '../constants/theme';

const sampleRecipe = {
  name: 'Gâteau au chocolat',
  description: 'Un délicieux gâteau au chocolat moelleux',
  attributes: ['Végétarien', 'Sans gluten', 'Fait maison'],
  utensils: ['Four', 'Mixeur', 'Moule à gâteau'],
  ingredients: [
    { name: 'Farine', quantity: 200, unit: 'g', created_by: '1' },
    { name: 'Chocolat', quantity: 150, unit: 'g', created_by: '1' },
    { name: 'Œufs', quantity: 3, unit: 'pièces', created_by: '1' }
  ],
  steps: [
    { 
      step_number: 1, 
      title: 'Préparation', 
      description: 'Mélanger les ingrédients secs',
      preparation_time: 10,
      cooking_time: 0,
      rest_time: 0,
      created_by: '1'
    },
    { 
      step_number: 2, 
      title: 'Cuisson', 
      description: 'Faire cuire au four',
      cooking_time: 30,
      preparation_time: 0,
      rest_time: 0,
      created_by: '1'
    }
  ]
};

export function FormTest() {
  const handleSave = (data: RecipeFormData) => {
    console.log('Recipe saved:', data);
  };

  const handleCancel = () => {
    console.log('Form cancelled');
  };

  return (
    <View style={styles.container}>
      <SuperModernRecipeForm
        initialData={sampleRecipe}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.white,
  },
});
