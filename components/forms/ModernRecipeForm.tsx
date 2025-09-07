/**
 * Formulaire de recette moderne utilisant React Hook Form
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

import { 
  ControlledInput,
  ControlledListManager,
  ControlledIngredientModal,
  ControlledStepModal,
  ControlledTagModal,
  ControlledIngredientItem,
  ControlledStepItem,
  ControlledTagItem,
  RecipeFormData
} from './index';
import { SimpleListManager } from './SimpleListManager';

interface RecipeFormProps {
  initialData?: Partial<Recipe>;
  onSave: (data: RecipeFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ModernRecipeForm({ initialData, onSave, onCancel, isLoading = false }: RecipeFormProps) {
  // États des modales
  const [showIngredientModal, setShowIngredientModal] = useState(false);
  const [showStepModal, setShowStepModal] = useState(false);
  const [showAttributeModal, setShowAttributeModal] = useState(false);
  const [showUtensilModal, setShowUtensilModal] = useState(false);

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
      price: initialData?.price?.toString() || '',
      quantity: initialData?.quantity?.toString() || '',
      number_of_persons: initialData?.number_of_persons?.toString() || '',
      origin_country: initialData?.origin_country || '',
      attributes: initialData?.attributes || [],
      utensils: initialData?.utensils || [],
      ingredients: initialData?.ingredients?.map(ing => ({
        name: ing.name,
        quantity: ing.quantity,
        unit: ing.unit
      })) || [],
      steps: initialData?.steps?.map(step => ({
        step_number: step.step_number,
        description: step.description,
        duration: step.duration
      })) || [],
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

  // Surveillance des valeurs pour les attributs et ustensiles
  const attributes = useWatch({ control, name: 'attributes' }) || [];
  const utensils = useWatch({ control, name: 'utensils' }) || [];

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

  // Gestion des tableaux avec setValue (alternative plus simple)
  const handleAddIngredient = (ingredient: Omit<Ingredient, 'created_by'>) => {
    ingredientsArray.append(ingredient);
    setShowIngredientModal(false);
  };

  const handleAddStep = (step: Omit<Step, 'created_by'>) => {
    const newStep = { ...step, step_number: stepsArray.fields.length + 1 };
    stepsArray.append(newStep);
    setShowStepModal(false);
  };

  const handleAddAttribute = (attribute: string) => {
    const currentAttributes = attributes || [];
    setValue('attributes', [...currentAttributes, attribute]);
    setShowAttributeModal(false);
  };

  const handleAddUtensil = (utensil: string) => {
    const currentUtensils = utensils || [];
    setValue('utensils', [...currentUtensils, utensil]);
    setShowUtensilModal(false);
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
            Sauvegarder
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
              label="Nom de la recette"
              placeholder="Recette"
              rules={{ required: 'Le nom de la recette est requis' }}
              required
            />

            <ControlledInput
              name="description"
              control={control}
              label="Description"
              placeholder="Décrivez votre recette..."
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              rules={{ required: 'La description est requise' }}
              required
            />

            <View style={styles.row}>
              <View style={styles.flex1}>
                <ControlledInput
                  name="price"
                  control={control}
                  label="Prix (€)"
                  placeholder="15.50"
                  keyboardType="numeric"
                  rules={{
                    pattern: {
                      value: /^\d+(\.\d{1,2})?$/,
                      message: 'Format invalide (ex: 15.50)'
                    }
                  }}
                />
              </View>
              <View style={styles.flex1}>
                <ControlledInput
                  name="number_of_persons"
                  control={control}
                  label="Nombre de personnes"
                  placeholder="4"
                  keyboardType="numeric"
                  rules={{
                    pattern: {
                      value: /^\d+$/,
                      message: 'Nombre entier requis'
                    }
                  }}
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.flex1}>
                <ControlledInput
                  name="quantity"
                  control={control}
                  label="Quantité"
                  placeholder="1"
                  keyboardType="numeric"
                  rules={{
                    pattern: {
                      value: /^\d+$/,
                      message: 'Nombre entier requis'
                    }
                  }}
                />
              </View>
              <View style={styles.flex1}>
                <ControlledInput
                  name="origin_country"
                  control={control}
                  label="Pays d'origine"
                  placeholder="France"
                />
              </View>
            </View>

            <ControlledInput
              name="source_reference"
              control={control}
              label="Source/Référence"
              placeholder="Site web, livre de cuisine..."
            />
          </View>

          {/* Ingrédients */}
          <View style={styles.section}>
            <ControlledListManager
              name="ingredients"
              control={control}
              title="Ingrédients"
              renderItem={(ingredient, index) => (
                <ControlledIngredientItem ingredient={ingredient} index={index} />
              )}
              onAddItem={() => setShowIngredientModal(true)}
              addButtonText="Ajouter un ingrédient"
              emptyStateText="Aucun ingrédient ajouté"
              error={errors.ingredients?.message}
            />
          </View>

          {/* Étapes */}
          <View style={styles.section}>
            <ControlledListManager
              name="steps"
              control={control}
              title="Étapes de préparation"
              renderItem={(step, index) => (
                <ControlledStepItem step={step} index={index} />
              )}
              onAddItem={() => setShowStepModal(true)}
              addButtonText="Ajouter une étape"
              emptyStateText="Aucune étape ajoutée"
              error={errors.steps?.message}
            />
          </View>

          {/* Attributs */}
          <View style={styles.section}>
            <SimpleListManager
              title="Attributs (végétarien, sans gluten...)"
              items={attributes}
              onItemsChange={(items) => setValue('attributes', items)}
              renderItem={(attribute, index) => (
                <ControlledTagItem tag={attribute} index={index} />
              )}
              onAddItem={() => setShowAttributeModal(true)}
              addButtonText="Ajouter un attribut"
              emptyStateText="Aucun attribut ajouté"
            />
          </View>

          {/* Ustensiles */}
          <View style={styles.section}>
            <SimpleListManager
              title="Ustensiles nécessaires"
              items={utensils}
              onItemsChange={(items) => setValue('utensils', items)}
              renderItem={(utensil, index) => (
                <ControlledTagItem tag={utensil} index={index} />
              )}
              onAddItem={() => setShowUtensilModal(true)}
              addButtonText="Ajouter un ustensile"
              emptyStateText="Aucun ustensile ajouté"
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
      <ControlledIngredientModal
        visible={showIngredientModal}
        onSave={handleAddIngredient}
        onCancel={() => setShowIngredientModal(false)}
      />

      <ControlledStepModal
        visible={showStepModal}
        stepNumber={stepsArray.fields.length + 1}
        onSave={handleAddStep}
        onCancel={() => setShowStepModal(false)}
      />

      <ControlledTagModal
        visible={showAttributeModal}
        onSave={handleAddAttribute}
        onCancel={() => setShowAttributeModal(false)}
        title="Ajouter un attribut"
        placeholder="Ex: Végétarien, Sans gluten, Épicé..."
      />

      <ControlledTagModal
        visible={showUtensilModal}
        onSave={handleAddUtensil}
        onCancel={() => setShowUtensilModal(false)}
        title="Ajouter un ustensile"
        placeholder="Ex: Four, Mixeur, Casserole..."
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
