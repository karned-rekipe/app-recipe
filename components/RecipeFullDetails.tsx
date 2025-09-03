import React, { useState, useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/theme';
import { Recipe } from '../types/Recipe';
import { formatCountryWithFlag, adjustIngredientsQuantities } from '../utils';
import { mapRecipeToLegacy } from '../utils/recipeMapper';
import { IngredientsList } from './IngredientsList';
import { PersonCountSelector } from './PersonCountSelector';
import { RecipeMetadata } from './RecipeMetadata';
import { Section } from './Section';
import { StepsList } from './StepsList';
import { UtensilsList } from './UtensilsList';

interface RecipeFullDetailsProps {
  recipe: Recipe;
}

/**
 * Composant pour afficher tous les détails d'une recette
 * Responsabilité : orchestrer l'affichage complet des informations de recette
 */
export const RecipeFullDetails: React.FC<RecipeFullDetailsProps> = ({ recipe }) => {
  const legacyRecipe = mapRecipeToLegacy(recipe);
  const [currentPersonCount, setCurrentPersonCount] = useState(recipe.number_of_persons || 1);
  
  // Calcule les ingrédients avec quantités ajustées selon le nombre de personnes
  const adjustedIngredients = useMemo(() => {
    const originalPersonCount = recipe.number_of_persons || 1;
    return adjustIngredientsQuantities(recipe.ingredients, originalPersonCount, currentPersonCount);
  }, [recipe.ingredients, recipe.number_of_persons, currentPersonCount]);

  const handlePersonCountChange = (count: number) => {
    setCurrentPersonCount(count);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Titre de la recette */}
      <Text style={styles.title}>{recipe.name}</Text>

      {/* Origine avec drapeau */}
      {recipe.origin_country && (
        <View style={styles.originContainer}>
          <Text style={styles.originText}>
            {formatCountryWithFlag(recipe.origin_country)}
          </Text>
        </View>
      )}
      
      {/* En-tête avec métadonnées */}
      <RecipeMetadata 
        recipe={legacyRecipe} 
        variant="detail" 
        layout="horizontal" 
      />

      {/* Caractéristiques (sans titre) */}
      {recipe.attributes.length > 0 && (
        <View style={styles.attributesContainer}>
          {recipe.attributes.map((attribute, index) => (
            <View key={`attribute-${index}`} style={styles.attributeBadge}>
              <Text style={styles.attributeText}>{attribute}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Description (sans titre) */}
      {recipe.description && (
        <View style={styles.descriptionContainer}>
          <Text style={styles.description}>{recipe.description}</Text>
        </View>
      )}



      {/* Nombre de personnes avec sélecteur */}
      {recipe.number_of_persons && (
        <PersonCountSelector 
          initialCount={recipe.number_of_persons}
          onCountChange={handlePersonCountChange}
        />
      )}

      {/* Ustensiles */}
      {recipe.utensils.length > 0 && (
        <UtensilsList utensils={recipe.utensils} />
      )}

      {/* Ingrédients avec quantités ajustées */}
      <IngredientsList ingredients={adjustedIngredients} />

      {/* Étapes */}
      <StepsList steps={recipe.steps} />

      {/* Source */}
      {recipe.source_reference && (
        <Section title="Source">
          <Text style={styles.source}>{recipe.source_reference}</Text>
        </Section>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  originContainer: {
    alignItems: 'center',
    marginVertical: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  originText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
  attributesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: theme.spacing.lg,
  },
  attributeBadge: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  attributeText: {
    fontSize: 12,
    color: theme.colors.white,
    fontWeight: '500',
  },
  descriptionContainer: {
    marginBottom: theme.spacing.xxl,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: theme.colors.text.primary,
  },
  source: {
    fontSize: 14,
    color: theme.colors.primary,
    textDecorationLine: 'underline',
  },
});

export default RecipeFullDetails;
