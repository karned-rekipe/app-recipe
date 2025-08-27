import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import {
    ErrorState,
    PlaceholderText,
    RecipeDetails,
    RecipeHeader,
    RecipeTitle,
    Section,
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
    <ScrollView style={styles.container}>
      <RecipeHeader image={recipe.image} onClose={() => router.back()} />

      <View style={styles.content}>
        <RecipeDetails recipe={recipe} />
        <RecipeTitle name={recipe.name} countryFlag={recipe.countryFlag} />

        <Section title={messages.sections.ingredients}>
          <PlaceholderText text={messages.placeholders.ingredients} />
        </Section>

        <Section title={messages.sections.utensils}>
          <PlaceholderText text={messages.placeholders.utensils} />
        </Section>

        <Section title={messages.sections.instructions}>
          <PlaceholderText text={messages.placeholders.instructions} />
        </Section>
      </View>
    </ScrollView>
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
