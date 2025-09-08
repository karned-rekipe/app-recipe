/**
 * Formulaire de recette moderne et simplifié
 * Utilise les principes SRP et la composition pour une meilleure maintenabilité
 */

import React from 'react';
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
import { useForm, useFieldArray, SubmitHandler } from 'react-hook-form';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';
import { Recipe, Ingredient, Step } from '../../types/Recipe';

// Imports des nouveaux composants
import { IngredientListManager, StepListManager } from './SpecializedListManagers';
import { SimpleTagListManager } from './SimpleTagListManager';
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

interface SuperModernRecipeFormProps {
  initialData?: Partial<Recipe>;
  onSave: (data: RecipeFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function SuperModernRecipeForm({ initialData, onSave, onCancel, isLoading = false }: SuperModernRecipeFormProps) {
  // États des modales avec le nouveau hook
  const ingredientModal = useModalState<Omit<Ingredient, 'created_by'>>();
  const stepModal = useModalState<Omit<Step, 'created_by'>>();
  const attributeModal = useModalState<string>();
  const utensilModal = useModalState<string>();

  // État pour les ingrédients cochés
  const [checkedIngredients, setCheckedIngredients] = React.useState<Set<number>>(new Set());

  // Configuration du formulaire avec React Hook Form
  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    setValue,
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

  // Gestion des tableaux avec useFieldArray pour les objets complexes
  const ingredientsArray = useFieldArray({
    control,
    name: 'ingredients'
  });

  const stepsArray = useFieldArray({
    control,
    name: 'steps'
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

  // Fonctions pour gérer les ingrédients cochés
  const toggleIngredientCheck = (index: number) => {
    setCheckedIngredients(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
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
    const currentAttributes = control._formValues.attributes || [];
    setValue('attributes', [...currentAttributes, attribute]);
    attributeModal.closeModal();
  };

  const handleEditAttribute = (attribute: string) => {
    if (attributeModal.index !== undefined) {
      const currentAttributes = control._formValues.attributes || [];
      const newAttributes = [...currentAttributes];
      newAttributes[attributeModal.index] = attribute;
      setValue('attributes', newAttributes);
    }
    attributeModal.closeModal();
  };

  // Gestionnaires pour les ustensiles
  const handleAddUtensil = (utensil: string) => {
    const currentUtensils = control._formValues.utensils || [];
    setValue('utensils', [...currentUtensils, utensil]);
    utensilModal.closeModal();
  };

  const handleEditUtensil = (utensil: string) => {
    if (utensilModal.index !== undefined) {
      const currentUtensils = control._formValues.utensils || [];
      const newUtensils = [...currentUtensils];
      newUtensils[utensilModal.index] = utensil;
      setValue('utensils', newUtensils);
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
              placeholder="Nom de la recette"
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

          {/* Ingrédients - Liste verticale condensée */}
          <View style={styles.section}>
            <View style={{ marginBottom: theme.spacing.lg }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.md }}>
                <Text style={{ fontSize: 18, fontWeight: '600', color: theme.colors.text.primary }}>
                  Ingrédients ({ingredientsArray.fields.length})
                </Text>
                <TouchableOpacity 
                  style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.primary, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 }}
                  onPress={ingredientModal.openAddModal}
                >
                  <Ionicons name="add" size={16} color="white" />
                  <Text style={{ marginLeft: 4, color: 'white', fontWeight: '500', fontSize: 12 }}>Ajouter</Text>
                </TouchableOpacity>
              </View>

              {ingredientsArray.fields.length === 0 ? (
                <View style={{ padding: theme.spacing.md, alignItems: 'center', backgroundColor: '#f8f9fa', borderRadius: 8, borderWidth: 1, borderColor: theme.colors.border, borderStyle: 'dashed' }}>
                  <Text style={{ color: theme.colors.text.secondary, fontStyle: 'italic', fontSize: 12 }}>Aucun ingrédient</Text>
                </View>
              ) : (
                <View style={{ gap: 4 }}>
                  {ingredientsArray.fields.map((item, index) => {
                    const ingredient = item as Omit<Ingredient, 'created_by'>;
                    const isChecked = checkedIngredients.has(index);
                    return (
                      <TouchableOpacity 
                        key={item.id || index}
                        style={{ 
                          flexDirection: 'row', 
                          alignItems: 'center', 
                          padding: 6, 
                          borderRadius: 6
                        }}
                        onPress={() => toggleIngredientCheck(index)}
                      >
                        <TouchableOpacity
                          style={{
                            width: 20,
                            height: 20,
                            borderWidth: 2,
                            borderColor: isChecked ? theme.colors.primary : theme.colors.primary,
                            borderRadius: 4,
                            marginRight: 12,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: isChecked ? theme.colors.primary : 'transparent'
                          }}
                          onPress={(e) => {
                            e.stopPropagation();
                            toggleIngredientCheck(index);
                          }}
                        >
                          {isChecked && <Ionicons name="checkmark" size={14} color="white" />}
                        </TouchableOpacity>
                        <Text style={{ 
                          flex: 1, 
                          fontSize: 16, 
                          fontWeight: '500', 
                          color: isChecked ? theme.colors.text.secondary : theme.colors.text.primary,
                          textDecorationLine: isChecked ? 'line-through' : 'none'
                        }}>
                          {ingredient.name}
                        </Text>
                        <Text style={{ 
                          fontSize: 14, 
                          color: isChecked ? theme.colors.text.secondary : theme.colors.text.secondary, 
                          marginRight: 12,
                          textDecorationLine: isChecked ? 'line-through' : 'none'
                        }}>
                          {ingredient.quantity} {ingredient.unit}
                        </Text>
                        <TouchableOpacity
                          style={{ 
                            padding: 6, 
                            backgroundColor: '#fff',
                            borderRadius: 12,
                            borderWidth: 1,
                            borderColor: '#e9ecef',
                            marginRight: 8
                          }}
                          onPress={(e) => {
                            e.stopPropagation();
                            ingredientModal.openEditModal(ingredient, index);
                          }}
                        >
                          <Ionicons name="pencil-outline" size={14} color={theme.colors.primary} />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={{ 
                            padding: 6, 
                            backgroundColor: '#fff',
                            borderRadius: 12,
                            borderWidth: 1,
                            borderColor: '#e9ecef'
                          }}
                          onPress={(e) => {
                            e.stopPropagation();
                            ingredientsArray.remove(index);
                            // Mettre à jour les indices des ingrédients cochés
                            setCheckedIngredients(prev => {
                              const newSet = new Set<number>();
                              prev.forEach(i => {
                                if (i < index) newSet.add(i);
                                else if (i > index) newSet.add(i - 1);
                              });
                              return newSet;
                            });
                          }}
                        >
                          <Ionicons name="trash-outline" size={14} color={theme.colors.error} />
                        </TouchableOpacity>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}

              {errors.ingredients?.message && (
                <Text style={{ fontSize: 14, color: theme.colors.error, marginTop: 8 }}>{errors.ingredients.message}</Text>
              )}
            </View>
          </View>

          {/* Étapes */}
          <View style={styles.section}>
            <StepListManager
              fields={stepsArray.fields}
              renderItem={(step, index, onEdit) => (
                <StepDisplay 
                  step={step} 
                  onEdit={onEdit}
                  allowEdit={true}
                />
              )}
              onAddItem={stepModal.openAddModal}
              onEditItem={(step, index) => stepModal.openEditModal(step, index)}
              onRemoveItem={stepsArray.remove}
              error={errors.steps?.message}
            />
          </View>

          {/* Attributs */}
          <View style={styles.section}>
            <SimpleTagListManager
              control={control}
              setValue={setValue}
              fieldName="attributes"
              title="Attributs (végétarien, sans gluten...)"
              addButtonText="Ajouter un attribut"
              emptyStateText="Aucun attribut ajouté"
              renderItem={(attribute, index, onEdit) => (
                <TagDisplay 
                  tag={attribute} 
                  onEdit={onEdit}
                  allowEdit={true}
                />
              )}
              onAddItem={attributeModal.openAddModal}
              onEditItem={(attribute, index) => attributeModal.openEditModal(attribute, index)}
            />
          </View>

          {/* Ustensiles */}
          <View style={styles.section}>
            <SimpleTagListManager
              control={control}
              setValue={setValue}
              fieldName="utensils"
              title="Ustensiles nécessaires"
              addButtonText="Ajouter un ustensile"
              emptyStateText="Aucun ustensile ajouté"
              renderItem={(utensil, index, onEdit) => (
                <TagDisplay 
                  tag={utensil} 
                  onEdit={onEdit}
                  allowEdit={true}
                />
              )}
              onAddItem={utensilModal.openAddModal}
              onEditItem={(utensil, index) => utensilModal.openEditModal(utensil, index)}
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
