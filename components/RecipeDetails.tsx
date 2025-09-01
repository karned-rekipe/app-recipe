import React from 'react';
import { StyleSheet, View } from 'react-native';
import { theme } from '../constants/theme';
import { Recipe } from '../types/Recipe';
import { mapRecipeToLegacy } from '../utils/recipeMapper';
import { RecipeMetadata } from './RecipeMetadata';

interface RecipeDetailsProps {
  recipe: Recipe;
}

export const RecipeDetails: React.FC<RecipeDetailsProps> = ({ recipe }) => {
  const legacyRecipe = mapRecipeToLegacy(recipe);
  
  return (
    <View style={styles.detailsContainer}>
      <RecipeMetadata 
        recipe={legacyRecipe} 
        variant="detail" 
        layout="horizontal" 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  detailsContainer: {
    marginBottom: theme.spacing.lg,
  },
});
