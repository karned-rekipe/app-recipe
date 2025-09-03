import React, { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ingredient } from '../types/Recipe';
import { theme } from '../constants/theme';
import { formatQuantityForDisplay } from '../utils';

interface IngredientItemProps {
  ingredient: Ingredient;
  index: number;
  checked: boolean;
  onToggle: (index: number) => void;
}

interface IngredientsListProps {
  ingredients: Ingredient[];
  title?: string;
}

/**
 * Composant pour afficher un seul ingrédient
 * Responsabilité : formatage et affichage d'un ingrédient individuel
 */
export const IngredientItem: React.FC<IngredientItemProps> = ({ 
  ingredient, 
  index, 
  checked, 
  onToggle 
}) => {
  const formatQuantity = (quantity: number, unit: string): string => {
    if (quantity === 0 && !unit) return '';
    if (!unit) return formatQuantityForDisplay(quantity);
    return `${formatQuantityForDisplay(quantity)} ${unit}`;
  };

  const quantityText = formatQuantity(ingredient.quantity, ingredient.unit);

  return (
    <TouchableOpacity 
      style={styles.ingredientItem} 
      onPress={() => onToggle(index)}
      activeOpacity={0.7}
    >
      <View style={styles.checkboxContainer}>
        <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
          {checked && <Text style={styles.checkmark}>✓</Text>}
        </View>
      </View>
      <View style={styles.ingredientContent}>
        <Text style={[
          styles.ingredientName, 
          checked && styles.ingredientNameChecked
        ]}>
          {ingredient.name}
        </Text>
        {quantityText ? (
          <Text style={[
            styles.ingredientQuantity,
            checked && styles.ingredientQuantityChecked
          ]}>
            {quantityText}
          </Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

/**
 * Composant pour afficher une liste d'ingrédients
 * Responsabilité : gestion de la liste complète des ingrédients
 */
export const IngredientsList: React.FC<IngredientsListProps> = ({ 
  ingredients, 
  title = "Ingrédients" 
}) => {
  const [checkedIngredients, setCheckedIngredients] = useState<boolean[]>(
    new Array(ingredients.length).fill(false)
  );

  const toggleIngredient = (index: number) => {
    setCheckedIngredients(prev => {
      const newChecked = [...prev];
      newChecked[index] = !newChecked[index];
      return newChecked;
    });
  };

  if (ingredients.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.noIngredients}>Aucun ingrédient spécifié</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.ingredientsList}>
        {ingredients.map((ingredient, index) => (
          <IngredientItem 
            key={`${ingredient.name}-${index}`} 
            ingredient={ingredient}
            index={index}
            checked={checkedIngredients[index] || false}
            onToggle={toggleIngredient}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: 12,
  },
  ingredientsList: {
    gap: 8,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: theme.colors.background.white,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.primary,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  checkboxContainer: {
    marginRight: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.background.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  checkmark: {
    color: theme.colors.background.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  ingredientContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ingredientName: {
    fontSize: 14,
    color: theme.colors.text.primary,
    flex: 1,
    fontWeight: '500',
  },
  ingredientNameChecked: {
    textDecorationLine: 'line-through',
    color: theme.colors.textSecondary,
    opacity: 0.6,
  },
  ingredientQuantity: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontWeight: '600',
    marginLeft: 12,
  },
  ingredientQuantityChecked: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  noIngredients: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 20,
  },
});

export default IngredientsList;
