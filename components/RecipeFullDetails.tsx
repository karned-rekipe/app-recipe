import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/theme';
import { Recipe } from '../types/Recipe';
import { mapRecipeToLegacy } from '../utils/recipeMapper';
import { IngredientsList } from './IngredientsList';
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

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Titre de la recette */}
      <Text style={styles.title}>{recipe.name}</Text>
      
      {/* En-tête avec métadonnées */}
      <RecipeMetadata 
        recipe={legacyRecipe} 
        variant="detail" 
        layout="horizontal" 
      />

      {/* Description */}
      {recipe.description && (
        <Section title="Description">
          <Text style={styles.description}>{recipe.description}</Text>
        </Section>
      )}

      {/* Informations générales */}
      <Section title="Informations">
        <View style={styles.infoGrid}>
          {recipe.number_of_persons && (
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Personnes</Text>
              <Text style={styles.infoValue}>{recipe.number_of_persons}</Text>
            </View>
          )}
          {recipe.origin_country && (
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Origine</Text>
              <Text style={styles.infoValue}>{recipe.origin_country}</Text>
            </View>
          )}
        </View>
      </Section>

      {/* Attributs/Tags */}
      {recipe.attributes.length > 0 && (
        <Section title="Caractéristiques">
          <View style={styles.attributesContainer}>
            {recipe.attributes.map((attribute, index) => (
              <View key={`attribute-${index}`} style={styles.attributeBadge}>
                <Text style={styles.attributeText}>{attribute}</Text>
              </View>
            ))}
          </View>
        </Section>
      )}

      {/* Ustensiles */}
      {recipe.utensils.length > 0 && (
        <UtensilsList utensils={recipe.utensils} />
      )}

      {/* Ingrédients */}
      <IngredientsList ingredients={recipe.ingredients} />

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
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: theme.colors.text.primary,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  infoItem: {
    backgroundColor: theme.colors.background.white,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    minWidth: 100,
  },
  infoLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontWeight: '500',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: theme.colors.text.primary,
    fontWeight: '600',
  },
  attributesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
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
  source: {
    fontSize: 14,
    color: theme.colors.primary,
    textDecorationLine: 'underline',
  },
});

export default RecipeFullDetails;
