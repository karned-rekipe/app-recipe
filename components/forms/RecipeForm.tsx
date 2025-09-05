/**
 * Formulaire principal pour ajouter/modifier une recette
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
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';
import { Recipe, Ingredient, Step } from '../../types/Recipe';

import { FormInput } from './FormInput';
import { FormListManager } from './FormListManager';
import { IngredientForm, IngredientItem } from './IngredientForm';
import { StepForm, StepItem } from './StepForm';
import { TagForm, TagItem } from './TagForm';

interface RecipeFormData {
  name: string;
  description: string;
  price: string;
  quantity: string;
  number_of_persons: string;
  origin_country: string;
  attributes: string[];
  utensils: string[];
  ingredients: Omit<Ingredient, 'created_by'>[];
  steps: Omit<Step, 'created_by'>[];
  thumbnail_url: string;
  large_image_url: string;
  source_reference: string;
}

interface RecipeFormProps {
  initialData?: Partial<Recipe>;
  onSave: (data: RecipeFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function RecipeForm({ initialData, onSave, onCancel, isLoading = false }: RecipeFormProps) {
  // État du formulaire principal
  const [formData, setFormData] = useState<RecipeFormData>({
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
  });

  // États des modales
  const [showIngredientModal, setShowIngredientModal] = useState(false);
  const [showStepModal, setShowStepModal] = useState(false);
  const [showAttributeModal, setShowAttributeModal] = useState(false);
  const [showUtensilModal, setShowUtensilModal] = useState(false);

  // États des erreurs
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateFormData = (field: keyof RecipeFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Effacer l'erreur du champ modifié
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom de la recette est requis';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La description est requise';
    }

    if (formData.price && (isNaN(Number(formData.price)) || Number(formData.price) < 0)) {
      newErrors.price = 'Le prix doit être un nombre positif';
    }

    if (formData.quantity && (isNaN(Number(formData.quantity)) || Number(formData.quantity) <= 0)) {
      newErrors.quantity = 'La quantité doit être un nombre positif';
    }

    if (formData.number_of_persons && (isNaN(Number(formData.number_of_persons)) || Number(formData.number_of_persons) <= 0)) {
      newErrors.number_of_persons = 'Le nombre de personnes doit être un nombre positif';
    }

    if (formData.ingredients.length === 0) {
      newErrors.ingredients = 'Au moins un ingrédient est requis';
    }

    if (formData.steps.length === 0) {
      newErrors.steps = 'Au moins une étape est requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(formData);
    }
  };

  const handleCancel = () => {
    Alert.alert(
      "Confirmer l'annulation",
      "Toutes les modifications seront perdues. Êtes-vous sûr ?",
      [
        { text: "Continuer l'édition", style: "cancel" },
        { text: "Annuler", style: "destructive", onPress: onCancel }
      ]
    );
  };

  // Handlers pour les ingrédients
  const handleAddIngredient = (ingredient: Omit<Ingredient, 'created_by'>) => {
    const newIngredients = [...formData.ingredients, { ...ingredient, id: Date.now().toString() }];
    updateFormData('ingredients', newIngredients);
    setShowIngredientModal(false);
  };

  // Handlers pour les étapes
  const handleAddStep = (step: Omit<Step, 'created_by'>) => {
    const newSteps = [...formData.steps, { ...step, step_number: formData.steps.length + 1 }];
    updateFormData('steps', newSteps);
    setShowStepModal(false);
  };

  // Handlers pour les attributs
  const handleAddAttribute = (attribute: string) => {
    if (!formData.attributes.includes(attribute)) {
      updateFormData('attributes', [...formData.attributes, attribute]);
    }
    setShowAttributeModal(false);
  };

  // Handlers pour les ustensiles
  const handleAddUtensil = (utensil: string) => {
    if (!formData.utensils.includes(utensil)) {
      updateFormData('utensils', [...formData.utensils, utensil]);
    }
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
        <TouchableOpacity onPress={handleSave} disabled={isLoading}>
          <Text style={[styles.saveButton, isLoading && styles.disabledButton]}>
            Sauvegarder
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          {/* Informations de base */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informations générales</Text>
            
            <FormInput
              label="Nom de la recette"
              value={formData.name}
              onChangeText={(value) => updateFormData('name', value)}
              placeholder="Ex: Ratatouille, Tarte aux pommes..."
              error={errors.name}
              required
            />

            <FormInput
              label="Description"
              value={formData.description}
              onChangeText={(value) => updateFormData('description', value)}
              placeholder="Décrivez votre recette..."
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              error={errors.description}
              required
            />

            <View style={styles.row}>
              <View style={styles.flex1}>
                <FormInput
                  label="Prix (€)"
                  value={formData.price}
                  onChangeText={(value) => updateFormData('price', value)}
                  placeholder="15.50"
                  keyboardType="numeric"
                  error={errors.price}
                />
              </View>
              <View style={styles.flex1}>
                <FormInput
                  label="Nombre de personnes"
                  value={formData.number_of_persons}
                  onChangeText={(value) => updateFormData('number_of_persons', value)}
                  placeholder="4"
                  keyboardType="numeric"
                  error={errors.number_of_persons}
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.flex1}>
                <FormInput
                  label="Quantité"
                  value={formData.quantity}
                  onChangeText={(value) => updateFormData('quantity', value)}
                  placeholder="1"
                  keyboardType="numeric"
                  error={errors.quantity}
                />
              </View>
              <View style={styles.flex1}>
                <FormInput
                  label="Pays d'origine"
                  value={formData.origin_country}
                  onChangeText={(value) => updateFormData('origin_country', value)}
                  placeholder="France"
                />
              </View>
            </View>

            <FormInput
              label="Source/Référence"
              value={formData.source_reference}
              onChangeText={(value) => updateFormData('source_reference', value)}
              placeholder="Site web, livre de cuisine..."
            />
          </View>

          {/* Ingrédients */}
          <View style={styles.section}>
            <FormListManager
              title="Ingrédients"
              items={formData.ingredients.map((ing, index) => ({ ...ing, id: index.toString() }))}
              onItemsChange={(items) => updateFormData('ingredients', items.map(({ id, ...item }) => item))}
              renderItem={(ingredient, index) => (
                <IngredientItem ingredient={ingredient} index={index} />
              )}
              onAddItem={() => setShowIngredientModal(true)}
              addButtonText="Ajouter un ingrédient"
              emptyStateText="Aucun ingrédient ajouté"
            />
            {errors.ingredients && <Text style={styles.errorText}>{errors.ingredients}</Text>}
          </View>

          {/* Étapes */}
          <View style={styles.section}>
            <FormListManager
              title="Étapes de préparation"
              items={formData.steps.map((step, index) => ({ ...step, id: index.toString() }))}
              onItemsChange={(items) => updateFormData('steps', items.map(({ id, ...item }) => item))}
              renderItem={(step, index) => (
                <StepItem step={step} index={index} />
              )}
              onAddItem={() => setShowStepModal(true)}
              addButtonText="Ajouter une étape"
              emptyStateText="Aucune étape ajoutée"
            />
            {errors.steps && <Text style={styles.errorText}>{errors.steps}</Text>}
          </View>

          {/* Attributs */}
          <View style={styles.section}>
            <FormListManager
              title="Attributs (végétarien, sans gluten...)"
              items={formData.attributes.map((attr, index) => ({ id: index.toString(), value: attr }))}
              onItemsChange={(items) => updateFormData('attributes', items.map(item => item.value))}
              renderItem={(item) => <TagItem tag={item.value} index={0} />}
              onAddItem={() => setShowAttributeModal(true)}
              addButtonText="Ajouter un attribut"
              emptyStateText="Aucun attribut ajouté"
            />
          </View>

          {/* Ustensiles */}
          <View style={styles.section}>
            <FormListManager
              title="Ustensiles nécessaires"
              items={formData.utensils.map((utensil, index) => ({ id: index.toString(), value: utensil }))}
              onItemsChange={(items) => updateFormData('utensils', items.map(item => item.value))}
              renderItem={(item) => <TagItem tag={item.value} index={0} />}
              onAddItem={() => setShowUtensilModal(true)}
              addButtonText="Ajouter un ustensile"
              emptyStateText="Aucun ustensile ajouté"
            />
          </View>

          {/* Images */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Images (optionnel)</Text>
            
            <FormInput
              label="URL de l'image miniature"
              value={formData.thumbnail_url}
              onChangeText={(value) => updateFormData('thumbnail_url', value)}
              placeholder="https://example.com/image.jpg"
              keyboardType="url"
            />

            <FormInput
              label="URL de l'image haute résolution"
              value={formData.large_image_url}
              onChangeText={(value) => updateFormData('large_image_url', value)}
              placeholder="https://example.com/large-image.jpg"
              keyboardType="url"
            />
          </View>

          {/* Espacement pour le bouton flottant */}
          <View style={styles.bottomSpacing} />
        </View>
      </ScrollView>

      {/* Modales */}
      <IngredientForm
        visible={showIngredientModal}
        onSave={handleAddIngredient}
        onCancel={() => setShowIngredientModal(false)}
      />

      <StepForm
        visible={showStepModal}
        stepNumber={formData.steps.length + 1}
        onSave={handleAddStep}
        onCancel={() => setShowStepModal(false)}
      />

      <TagForm
        visible={showAttributeModal}
        onSave={handleAddAttribute}
        onCancel={() => setShowAttributeModal(false)}
        title="Ajouter un attribut"
        placeholder="Ex: Végétarien, Sans gluten, Épicé..."
      />

      <TagForm
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
  errorText: {
    fontSize: 14,
    color: theme.colors.error,
    marginTop: theme.spacing.xs,
  },
  bottomSpacing: {
    height: 100, // Pour laisser de l'espace pour le bouton flottant
  },
});
