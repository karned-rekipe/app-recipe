/**
 * Formulaire de recette moderne refactorisé
 * Utilise les principes SRP et la composition pour une meilleure maintenabilité
 */

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity, 
  Alert,
  KeyboardAvoidingView,
  Platform 
} from 'react-native';
import { useForm, useFieldArray, useWatch, SubmitHandler } from 'react-hook-form';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';
import { Recipe, Ingredient, Step } from '../../types/Recipe';
import { extractFormDataFromRecipe } from '../../utils/recipeMapper';

// Imports des nouveaux composants
import { UniversalListManager } from './UniversalListManager';
import { ModernIngredientModal } from './ModernIngredientModal';
import { ModernStepModal } from './ModernStepModal';
import { ModernTagModal } from './ModernTagModal';
import { IngredientDisplay, StepDisplay, TagDisplay } from './DisplayComponents';
import { useModalState } from './useModalState';

// Imports des composants existants
import { 
  ControlledInput,
  ControlledCountrySelect,
  ControlledPriceSelector,
  ControlledDifficultySelector,
  ControlledPersonCountSelector,
  ControlledQuantitySelector,
  RecipeFormData,
  PriceValue,
  DifficultyValue
} from './index';

interface ModernRecipeFormProps {
  initialData?: Partial<Recipe>;
  onSave: (data: RecipeFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ModernRecipeForm({ initialData, onSave, onCancel, isLoading = false }: ModernRecipeFormProps) {
  // États des modales avec le nouveau hook
  const ingredientModal = useModalState<Ingredient>();
  const stepModal = useModalState<Step>();
  const attributeModal = useModalState<string>();
  const utensilModal = useModalState<string>();

  // Extraction des données du processus si initialData existe
  const extractedData = initialData ? extractFormDataFromRecipe(initialData as Recipe) : { ingredients: [], utensils: [], steps: [] };

  // Configuration du formulaire avec React Hook Form
  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    setValue,
    reset
  } = useForm<RecipeFormData>({
    mode: 'onChange',
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      price: (initialData?.price as PriceValue) || 1,
      difficulty: (initialData?.difficulty as DifficultyValue) || 1,
      quantity: initialData?.quantity || 1,
      number_of_persons: initialData?.number_of_persons || 4,
      origin_country: initialData?.origin_country || '',
      attributes: initialData?.attributes || [],
      utensils: extractedData.utensils,
      ingredients: extractedData.ingredients.map(ing => ({
        name: ing.name,
        quantity: ing.quantity,
        unit: ing.unit
      })),
      steps: extractedData.steps.map(step => ({
        step_number: step.step_number,
        title: step.title,
        description: step.description,
        cooking_time: step.cooking_time,
        rest_time: step.rest_time,
        preparation_time: step.preparation_time
      })),
      thumbnail_url: initialData?.thumbnail_url || '',
      large_image_url: initialData?.large_image_url || '',
      source_reference: initialData?.source_reference || '',
    },
  });

  // Gestion des tableaux avec useFieldArray
  const ingredientsArray = useFieldArray({
    control,
    name: 'ingredients'
  });

  const stepsArray = useFieldArray({
    control,
    name: 'steps'
  });

  const attributesArray = useFieldArray({
    control,
    name: 'attributes'
  });

  const utensilsArray = useFieldArray({
    control,
    name: 'utensils'
  });

  const onSubmit: SubmitHandler<RecipeFormData> = (data) => {
    onSave(data);
  };

  const handleCancel = () => {
    if (isDirty) {
      Alert.alert(
        "Confirmer l'annulation",
        "Toutes les modifications seront perdues. Êtes-vous sûr ?",
        [
          { text: "Continuer l'édition", style: "cancel" },
          { text: "Annuler", style: "destructive", onPress: onCancel }
        ]
      );
    } else {
      onCancel();
    }
  };

  // Gestionnaires pour les ingrédients
  const handleAddIngredient = (ingredient: Omit<Ingredient, 'created_by'>) => {
    ingredientsArray.append(ingredient);
    ingredientModal.closeModal();
  };

  const handleEditIngredient = (ingredient: Omit<Ingredient, 'created_by'>) => {
    if (ingredientModal.index !== undefined) {
      ingredientsArray.update(ingredientModal.index, ingredient);
    }
    ingredientModal.closeModal();
  };

  // Gestionnaires pour les étapes
  const handleAddStep = (step: Omit<Step, 'created_by'>) => {
    const newStep = { ...step, step_number: stepsArray.fields.length + 1 };
    stepsArray.append(newStep);
    stepModal.closeModal();
  };

  const handleEditStep = (step: Omit<Step, 'created_by'>) => {
    if (stepModal.index !== undefined) {
      stepsArray.update(stepModal.index, step);
    }
    stepModal.closeModal();
  };

  // Gestionnaires pour les attributs
  const handleAddAttribute = (attribute: string) => {
    attributesArray.append(attribute);
    attributeModal.closeModal();
  };

  const handleEditAttribute = (attribute: string) => {
    if (attributeModal.index !== undefined) {
      attributesArray.update(attributeModal.index, attribute);
    }
    attributeModal.closeModal();
  };

  // Gestionnaires pour les ustensiles
  const handleAddUtensil = (utensil: string) => {
    utensilsArray.append(utensil);
    utensilModal.closeModal();
  };

  const handleEditUtensil = (utensil: string) => {
    if (utensilModal.index !== undefined) {
      utensilsArray.update(utensilModal.index, utensil);
    }
    utensilModal.closeModal();
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleCancel} disabled={isLoading}>
          <Text style={styles.cancelButton}>Annuler</Text>
        </TouchableOpacity>
        <Text style={styles.title}>
          {initialData ? 'Modifier la recette' : 'Nouvelle recette'}
        </Text>
        <TouchableOpacity 
          onPress={handleSubmit(onSubmit)} 
          disabled={isLoading || !isValid}
        >
          <Text style={[
            styles.saveButton, 
            (isLoading || !isValid) && styles.disabledButton
          ]}>
            Enregistrer
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          {/* Informations de base */}
          <View style={styles.section}>
            <ControlledInput
              name="name"
              control={control}
              label=""
              placeholder="Recette"
              rules={{ required: 'Le nom de la recette est requis' }}
              required
            />

            <ControlledInput
              name="description"
              control={control}
              label=""
              placeholder="Description"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />

            <ControlledInput
              label=""
              name="source_reference"
              control={control}
              placeholder="Référence : Site web, livre de cuisine..."
            />

            <ControlledCountrySelect
              name="origin_country"
              control={control}
              placeholder="Pays d'origine"
            />

            <ControlledPriceSelector
              name="price"
              control={control}
              rules={{ required: 'Veuillez sélectionner un niveau de prix' }}
            />

            <ControlledDifficultySelector
              name="difficulty"
              control={control}
              rules={{ required: 'Veuillez sélectionner un niveau de difficulté' }}
            />

            <View style={styles.row}>
              <View style={styles.flex1}>
                <ControlledPersonCountSelector
                  name="number_of_persons"
                  control={control}
                  rules={{ 
                    required: 'Le nombre de personnes est requis',
                    min: { value: 1, message: 'Minimum 1 personne' },
                    max: { value: 20, message: 'Maximum 20 personnes' }
                  }}
                  minCount={1}
                  maxCount={20}
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.flex1}>
                <ControlledQuantitySelector
                  name="quantity"
                  control={control}
                  rules={{ 
                    required: 'La quantité est requise',
                    min: { value: 1, message: 'Minimum 1 part' },
                    max: { value: 99, message: 'Maximum 99 parts' }
                  }}
                  minQuantity={1}
                  maxQuantity={99}
                  unit="parts"
                />
              </View>
            </View>
          </View>

          {/* Ingrédients */}
          <View style={styles.section}>
            <UniversalListManager
              name="ingredients"
              control={control}
              title="Ingrédients"
              renderItem={(ingredient, index, onEdit) => (
                <IngredientDisplay 
                  ingredient={ingredient} 
                  onEdit={onEdit}
                  allowEdit={true}
                />
              )}
              onAddItem={ingredientModal.openAddModal}
              onEditItem={(ingredient, index) => ingredientModal.openEditModal(ingredient, index)}
              addButtonText="Ajouter un ingrédient"
              emptyStateText="Aucun ingrédient ajouté"
              error={errors.ingredients?.message}
              allowEdit={true}
            />
          </View>

          {/* Étapes */}
          <View style={styles.section}>
            <UniversalListManager
              name="steps"
              control={control}
              title="Étapes de préparation"
              renderItem={(step, index, onEdit) => (
                <StepDisplay 
                  step={step} 
                  onEdit={onEdit}
                  allowEdit={true}
                />
              )}
              onAddItem={stepModal.openAddModal}
              onEditItem={(step, index) => stepModal.openEditModal(step, index)}
              addButtonText="Ajouter une étape"
              emptyStateText="Aucune étape ajoutée"
              error={errors.steps?.message}
              allowEdit={true}
            />
          </View>

          {/* Attributs */}
          <View style={styles.section}>
            <UniversalListManager
              name="attributes"
              control={control}
              title="Attributs (végétarien, sans gluten...)"
              renderItem={(attribute, index, onEdit) => (
                <TagDisplay 
                  tag={attribute} 
                  onEdit={onEdit}
                  allowEdit={true}
                />
              )}
              onAddItem={attributeModal.openAddModal}
              onEditItem={(attribute, index) => attributeModal.openEditModal(attribute, index)}
              addButtonText="Ajouter un attribut"
              emptyStateText="Aucun attribut ajouté"
              allowEdit={true}
            />
          </View>

          {/* Ustensiles */}
          <View style={styles.section}>
            <UniversalListManager
              name="utensils"
              control={control}
              title="Ustensiles nécessaires"
              renderItem={(utensil, index, onEdit) => (
                <TagDisplay 
                  tag={utensil} 
                  onEdit={onEdit}
                  allowEdit={true}
                />
              )}
              onAddItem={utensilModal.openAddModal}
              onEditItem={(utensil, index) => utensilModal.openEditModal(utensil, index)}
              addButtonText="Ajouter un ustensile"
              emptyStateText="Aucun ustensile ajouté"
              allowEdit={true}
            />
          </View>

          {/* Images */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Images (optionnel)</Text>
            
            <ControlledInput
              name="thumbnail_url"
              control={control}
              label="URL de l'image miniature"
              placeholder="https://example.com/image.jpg"
              keyboardType="url"
              rules={{
                pattern: {
                  value: /^https?:\/\/.+\..+/,
                  message: 'URL invalide'
                }
              }}
            />

            <ControlledInput
              name="large_image_url"
              control={control}
              label="URL de l'image haute résolution"
              placeholder="https://example.com/large-image.jpg"
              keyboardType="url"
              rules={{
                pattern: {
                  value: /^https?:\/\/.+\..+/,
                  message: 'URL invalide'
                }
              }}
            />
          </View>

          {/* Espacement pour le bouton flottant */}
          <View style={styles.bottomSpacing} />
        </View>
      </ScrollView>

      {/* Modales */}
      <ModernIngredientModal
        visible={ingredientModal.isVisible}
        onSave={ingredientModal.isEditMode ? handleEditIngredient : handleAddIngredient}
        onCancel={ingredientModal.closeModal}
        initialData={ingredientModal.data}
        mode={ingredientModal.modalState.mode}
      />

      <ModernStepModal
        visible={stepModal.isVisible}
        stepNumber={stepModal.isEditMode ? stepModal.data?.step_number || 1 : stepsArray.fields.length + 1}
        onSave={stepModal.isEditMode ? handleEditStep : handleAddStep}
        onCancel={stepModal.closeModal}
        initialData={stepModal.data}
        mode={stepModal.modalState.mode}
      />

      <ModernTagModal
        visible={attributeModal.isVisible}
        onSave={attributeModal.isEditMode ? handleEditAttribute : handleAddAttribute}
        onCancel={attributeModal.closeModal}
        title={attributeModal.isEditMode ? "Modifier l'attribut" : "Ajouter un attribut"}
        placeholder="Ex: Végétarien, Sans gluten, Épicé..."
        initialData={attributeModal.data}
        mode={attributeModal.modalState.mode}
      />

      <ModernTagModal
        visible={utensilModal.isVisible}
        onSave={utensilModal.isEditMode ? handleEditUtensil : handleAddUtensil}
        onCancel={utensilModal.closeModal}
        title={utensilModal.isEditMode ? "Modifier l'ustensile" : "Ajouter un ustensile"}
        placeholder="Ex: Four, Mixeur, Casserole..."
        initialData={utensilModal.data}
        mode={utensilModal.modalState.mode}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.background.white,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  cancelButton: {
    fontSize: 16,
    color: theme.colors.text.secondary,
  },
  saveButton: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  disabledButton: {
    opacity: 0.5,
  },
  scrollView: {
    flex: 1,
  },
  form: {
    padding: theme.spacing.md,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  row: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  flex1: {
    flex: 1,
  },
  bottomSpacing: {
    height: 100, // Pour laisser de l'espace pour le bouton flottant
  },
});
