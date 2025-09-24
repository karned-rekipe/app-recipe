import React, { useState, useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/theme';
import { Recipe } from '../types/Recipe';
import { formatCountryWithFlag, adjustIngredientsQuantities } from '../utils';
import { mapRecipeToLegacy, resolveReferencedRecipe, isReferencedProcess } from '../utils/recipeMapper';
import { useAllRecipes } from '../hooks/useAllRecipes';
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
  const allRecipes = useAllRecipes();
  
  // Détermine si on a plusieurs processus (même si certains sont vides car ils peuvent référencer d'autres recettes)
  const hasMultipleProcesses = useMemo(() => {
    // Si plus d'un processus au total, on considère que c'est multi-processus
    if (recipe.process.length > 1) {
      // Vérifie qu'au moins un processus a du contenu significatif
      const hasAnyContent = recipe.process.some(process => 
        (process.ingredients && process.ingredients.length > 0) || 
        (process.steps && process.steps.length > 0) ||
        (process.utensils && process.utensils.length > 0)
      );
      return hasAnyContent;
    }
    return false;
  }, [recipe.process]);

  // Calcule les ingrédients avec quantités ajustées selon le nombre de personnes
  const adjustedIngredients = useMemo(() => {
    const originalPersonCount = recipe.number_of_persons || 1;
    // Récupère tous les ingrédients de tous les processus
    const allIngredients = recipe.process.flatMap(process => process.ingredients);
    return adjustIngredientsQuantities(allIngredients, originalPersonCount, currentPersonCount);
  }, [recipe.process, recipe.number_of_persons, currentPersonCount]);

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

      {/* Affichage conditionnel selon le nombre de processus */}
      {hasMultipleProcesses ? (
        /* Affichage avec plusieurs processus séparés */
        recipe.process
          .map((process, index) => {
            // Si le processus référence une autre recette
            if (isReferencedProcess(process)) {
              const referencedRecipe = resolveReferencedRecipe(process.recipe_uuid!, allRecipes);
              
              if (referencedRecipe) {
                // Afficher la recette référencée complète
                const adjustedReferencedIngredients = adjustIngredientsQuantities(
                  referencedRecipe.process.flatMap(p => p.ingredients), 
                  referencedRecipe.number_of_persons || 1, 
                  currentPersonCount
                );

                return (
                  <View key={index} style={styles.referencedRecipeContainer}>
                    {/* Titre de la recette référencée */}
                    <Text style={styles.referencedRecipeTitle}>
                      {referencedRecipe.name}
                    </Text>
                    
                    {/* Description si disponible */}
                    {referencedRecipe.description && (
                      <Text style={styles.referencedRecipeDescription}>
                        {referencedRecipe.description}
                      </Text>
                    )}

                    {/* Ustensiles de la recette référencée */}
                    {referencedRecipe.process.some(p => p.utensils.length > 0) && (
                      <UtensilsList utensils={referencedRecipe.process.flatMap(p => p.utensils)} />
                    )}

                    {/* Ingrédients de la recette référencée */}
                    {adjustedReferencedIngredients.length > 0 && (
                      <IngredientsList ingredients={adjustedReferencedIngredients} />
                    )}

                    {/* Étapes de la recette référencée */}
                    {referencedRecipe.process.some(p => p.steps.length > 0) && (
                      <StepsList steps={referencedRecipe.process.flatMap(p => p.steps)} />
                    )}
                  </View>
                );
              }
              
              // Si la recette référencée n'est pas trouvée, afficher un message d'erreur
              return (
                <View key={index} style={styles.processContainer}>
                  <Text style={styles.errorText}>
                    Recette référencée non trouvée (UUID: {process.recipe_uuid})
                  </Text>
                </View>
              );
            }
            
            // Processus normal (non référencé)
            const hasContent = (process.ingredients && process.ingredients.length > 0) || 
                              (process.steps && process.steps.length > 0) ||
                              (process.utensils && process.utensils.length > 0);
            
            if (!hasContent) return null;

            const adjustedProcessIngredients = adjustIngredientsQuantities(
              process.ingredients || [], 
              recipe.number_of_persons || 1, 
              currentPersonCount
            );

            return (
              <View key={index} style={styles.processContainer}>
                {/* Titre du processus */}
                <Text style={styles.processTitle}>
                  {process.name || `Processus ${index + 1}`}
                </Text>

                {/* Ustensiles du processus */}
                {process.utensils && process.utensils.length > 0 && (
                  <UtensilsList utensils={process.utensils} />
                )}

                {/* Ingrédients du processus */}
                {adjustedProcessIngredients.length > 0 && (
                  <IngredientsList ingredients={adjustedProcessIngredients} />
                )}

                {/* Étapes du processus */}
                {process.steps && process.steps.length > 0 && (
                  <StepsList steps={process.steps} />
                )}
              </View>
            );
          })
          .filter(Boolean) // Enlever les éléments null
      ) : (
        /* Affichage classique pour un seul processus */
        <>
          {/* Ustensiles */}
          {recipe.process.some(process => process.utensils.length > 0) && (
            <UtensilsList utensils={recipe.process.flatMap(process => process.utensils)} />
          )}

          {/* Ingrédients avec quantités ajustées */}
          <IngredientsList ingredients={adjustedIngredients} />

          {/* Étapes */}
          <StepsList steps={recipe.process.flatMap(process => process.steps)} />
        </>
      )}

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
  processContainer: {
    marginBottom: theme.spacing.xl,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  processTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  referencedRecipeContainer: {
    marginBottom: theme.spacing.xl,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    borderStyle: 'dashed',
  },
  referencedRecipeTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  referencedRecipeDescription: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    fontStyle: 'italic',
    marginBottom: theme.spacing.md,
    textAlign: 'center',
    lineHeight: 20,
  },
  errorText: {
    fontSize: 14,
    color: theme.colors.error || '#ff4444',
    textAlign: 'center',
    fontStyle: 'italic',
    padding: theme.spacing.md,
  },
});

export default RecipeFullDetails;
