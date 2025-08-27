import React from 'react';
import { StyleSheet, View } from 'react-native';
import { theme } from '../constants/theme';
import { Recipe } from '../types/Recipe';
import { RecipeMetadata } from './RecipeMetadata';

interface RecipeDetailsProps {
  recipe: Recipe;
}

export const RecipeDetails: React.FC<RecipeDetailsProps> = ({ recipe }) => {
  return (
    <View style={styles.detailsContainer}>
      <RecipeMetadata 
        recipe={recipe} 
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
