import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import {
    ErrorState,
    RecipeFullDetails,
    RecipeHeader,
} from '../components';
import { messages, theme } from '../constants';
import { useRecipe } from '../hooks';

export default function RecipeDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const recipe = useRecipe(id);

  if (!recipe) {
    return (
      <ErrorState
        message={messages.errors.recipeNotFound}
        onRetry={() => router.back()}
        retryButtonText={messages.actions.back}
      />
    );
  }

  return (
    <View style={styles.container}>
      <RecipeHeader 
        image={recipe.thumbnail_url || recipe.large_image_url || undefined} 
        onClose={() => router.back()} 
      />
      
      <RecipeFullDetails recipe={recipe} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  content: {
    padding: theme.spacing.xl,
  },
});
