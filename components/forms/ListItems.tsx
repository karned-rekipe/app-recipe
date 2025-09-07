/**
 * Composants d'affichage pour les éléments de liste du formulaire
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../constants/theme';
import { Ingredient, Step } from '../../types/Recipe';

// Composant pour afficher un ingrédient
interface IngredientItemProps {
  ingredient: Ingredient;
  index: number;
}

export function IngredientItem({ ingredient }: IngredientItemProps) {
  return (
    <View style={styles.ingredientContainer}>
      <Text style={styles.ingredientName}>{ingredient.name}</Text>
      <Text style={styles.ingredientQuantity}>
        {ingredient.quantity} {ingredient.unit}
      </Text>
    </View>
  );
}

// Composant pour afficher une étape
interface StepItemProps {
  step: Step;
  index: number;
}

export function StepItem({ step }: StepItemProps) {
  return (
    <View style={styles.stepContainer}>
      <View style={styles.stepNumber}>
        <Text style={styles.stepNumberText}>{step.step_number}</Text>
      </View>
      <View style={styles.stepContent}>
        <Text style={styles.stepDescription}>{step.description}</Text>
        {step.duration && (
          <Text style={styles.stepDuration}>⏱️ {step.duration} min</Text>
        )}
      </View>
    </View>
  );
}

// Composant pour afficher un tag
interface TagItemProps {
  tag: string;
  index: number;
}

export function TagItem({ tag }: TagItemProps) {
  return (
    <View style={styles.tagContainer}>
      <Text style={styles.tagText}>{tag}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  ingredientContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ingredientName: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.text.primary,
    flex: 1,
  },
  ingredientQuantity: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    fontWeight: '500',
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
    marginTop: 2,
  },
  stepNumberText: {
    color: theme.colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  stepContent: {
    flex: 1,
  },
  stepDescription: {
    fontSize: 16,
    color: theme.colors.text.primary,
    lineHeight: 22,
    marginBottom: theme.spacing.xs,
  },
  stepDuration: {
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
  tagContainer: {
    alignSelf: 'flex-start',
  },
  tagText: {
    fontSize: 16,
    color: theme.colors.text.primary,
  },
});
