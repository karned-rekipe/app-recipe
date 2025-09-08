/**
 * Composants d'affichage pour les éléments de listes
 * Respectent le principe SRP - responsables uniquement de l'affichage
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../../constants/theme';
import { Ingredient, Step } from '../../types/Recipe';

// Composant d'affichage pour un ingrédient
interface IngredientDisplayProps {
  ingredient: Omit<Ingredient, 'created_by'>;
  onEdit?: () => void;
  allowEdit?: boolean;
}

export function IngredientDisplay({ ingredient, onEdit, allowEdit = false }: IngredientDisplayProps) {
  const content = (
    <View style={styles.ingredientContainer}>
      <Text style={styles.ingredientName}>{ingredient.name}</Text>
      <Text style={styles.ingredientDetails}>
        {ingredient.quantity} {ingredient.unit}
      </Text>
    </View>
  );

  if (allowEdit && onEdit) {
    return (
      <TouchableOpacity onPress={onEdit} style={styles.editableContainer}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

// Version condensée pour affichage en ligne
export function IngredientInlineDisplay({ ingredient, onEdit, allowEdit = false }: IngredientDisplayProps) {
  const content = (
    <Text style={styles.ingredientInline}>
      {ingredient.name} ({ingredient.quantity} {ingredient.unit})
    </Text>
  );

  if (allowEdit && onEdit) {
    return (
      <TouchableOpacity onPress={onEdit} style={styles.inlineEditableContainer}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

// Composant d'affichage pour une étape
interface StepDisplayProps {
  step: Omit<Step, 'created_by'>;
  onEdit?: () => void;
  allowEdit?: boolean;
}

export function StepDisplay({ step, onEdit, allowEdit = false }: StepDisplayProps) {
  const content = (
    <View style={styles.stepContainer}>
      <View style={styles.stepHeader}>
        <Text style={styles.stepNumber}>Étape {step.step_number}</Text>
        {step.duration && (
          <Text style={styles.stepDuration}>{step.duration} min</Text>
        )}
      </View>
      <Text style={styles.stepDescription}>{step.description}</Text>
    </View>
  );

  if (allowEdit && onEdit) {
    return (
      <TouchableOpacity onPress={onEdit} style={styles.editableContainer}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

// Composant d'affichage pour un tag (attribut ou ustensile)
interface TagDisplayProps {
  tag: string;
  onEdit?: () => void;
  allowEdit?: boolean;
}

export function TagDisplay({ tag, onEdit, allowEdit = false }: TagDisplayProps) {
  const content = (
    <View style={styles.tagContainer}>
      <Text style={styles.tagText}>{tag}</Text>
    </View>
  );

  if (allowEdit && onEdit) {
    return (
      <TouchableOpacity onPress={onEdit} style={styles.editableContainer}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  editableContainer: {
    flex: 1,
  },
  ingredientContainer: {
    flex: 1,
  },
  ingredientName: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.text.primary,
    marginBottom: 2,
  },
  ingredientDetails: {
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
  stepContainer: {
    flex: 1,
  },
  stepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  stepDuration: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: theme.colors.text.primary,
    lineHeight: 20,
  },
  tagContainer: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  tagText: {
    fontSize: 14,
    color: theme.colors.text.primary,
    fontWeight: '500',
  },
  // Styles pour l'affichage condensé en ligne
  ingredientInline: {
    fontSize: 14,
    color: theme.colors.text.primary,
    marginRight: theme.spacing.sm,
  },
  inlineEditableContainer: {
    marginRight: theme.spacing.sm,
  },
});
