import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Ingredient } from '../types/Recipe';
import { theme } from '../constants/theme';

interface IngredientItemProps {
  ingredient: Ingredient;
}

interface IngredientsListProps {
  ingredients: Ingredient[];
  title?: string;
}

/**
 * Composant pour afficher un seul ingrédient
 * Responsabilité : formatage et affichage d'un ingrédient individuel
 */
export const IngredientItem: React.FC<IngredientItemProps> = ({ ingredient }) => {
  const formatQuantity = (quantity: number, unit: string): string => {
    if (quantity === 0 && !unit) return '';
    if (!unit) return quantity.toString();
    return `${quantity} ${unit}`;
  };

  const quantityText = formatQuantity(ingredient.quantity, ingredient.unit);

  return (
    <View style={styles.ingredientItem}>
      <Text style={styles.ingredientName}>{ingredient.name}</Text>
      {quantityText ? (
        <Text style={styles.ingredientQuantity}>{quantityText}</Text>
      ) : null}
    </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: theme.colors.background.white,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.primary,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  ingredientName: {
    fontSize: 14,
    color: theme.colors.text.primary,
    flex: 1,
    fontWeight: '500',
  },
  ingredientQuantity: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontWeight: '600',
    marginLeft: 12,
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
