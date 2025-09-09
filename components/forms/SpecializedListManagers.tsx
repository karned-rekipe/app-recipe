/**
 * Gestionnaires de listes spécialisés pour chaque type
 * Respectent le principe SRP - chacun responsable d'un type spécifique
 */

import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';
import { Ingredient, Step } from '../../types/Recipe';
import { StepFormItem } from './StepFormItem';

// Gestionnaire pour les ingrédients
interface IngredientListManagerProps {
  fields: any[]; // Fields from useFieldArray
  renderItem: (item: Omit<Ingredient, 'created_by'>, index: number, onEdit?: () => void) => React.ReactNode;
  onAddItem: () => void;
  onEditItem?: (item: Omit<Ingredient, 'created_by'>, index: number) => void;
  onRemoveItem: (index: number) => void;
  error?: string;
}

export function IngredientListManager({
  fields,
  renderItem,
  onAddItem,
  onEditItem,
  onRemoveItem,
  error
}: IngredientListManagerProps) {
  const handleRemoveItem = (index: number) => {
    onRemoveItem(index);
  };

  const handleEditItem = (index: number) => {
    if (onEditItem && fields[index]) {
      onEditItem(fields[index] as Omit<Ingredient, 'created_by'>, index);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Ingrédients</Text>
        <TouchableOpacity 
          style={styles.addButtonSimple} 
          onPress={onAddItem}
        >
          <Ionicons name="add" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      {fields.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>Aucun ingrédient ajouté</Text>
        </View>
      ) : (
        <View>
          {fields.map((item, index) => (
            <View key={item.id || index} style={styles.listItem}>
              <View style={styles.itemContent}>
                {renderItem(
                  item as Omit<Ingredient, 'created_by'>, 
                  index,
                  onEditItem ? () => handleEditItem(index) : undefined
                )}
              </View>
              <View style={styles.actions}>
                {onEditItem && (
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => handleEditItem(index)}
                  >
                    <Ionicons name="pencil" size={18} color={theme.colors.primary} />
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => handleRemoveItem(index)}
                >
                  <Ionicons name="trash-outline" size={18} color={theme.colors.error} />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}

      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
}

// Gestionnaire pour les étapes
interface StepListManagerProps {
  fields: any[]; // Fields from useFieldArray
  onAddItem: () => void;
  onEditItem?: (item: Omit<Step, 'created_by'>, index: number) => void;
  onRemoveItem: (index: number) => void;
  error?: string;
}

export function StepListManager({
  fields,
  onAddItem,
  onEditItem,
  onRemoveItem,
  error
}: StepListManagerProps) {
  const handleRemoveItem = (index: number) => {
    onRemoveItem(index);
  };

  const handleEditItem = (index: number) => {
    if (onEditItem && fields[index]) {
      onEditItem(fields[index] as Omit<Step, 'created_by'>, index);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Préparation</Text>
        <TouchableOpacity 
          style={styles.addButtonSimple} 
          onPress={onAddItem}
        >
          <Ionicons name="add" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      {fields.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>Aucune étape ajoutée</Text>
          <Text style={styles.emptyStateSubtext}>
            Ajoutez les étapes de préparation de votre recette
          </Text>
        </View>
      ) : (
        <View>
          {fields.map((item, index) => (
            <View key={item.id || index} style={styles.listItem}>
              <StepFormItem
                step={item as Omit<Step, 'created_by'>}
                index={index}
                onEdit={onEditItem ? () => handleEditItem(index) : undefined}
              />
            </View>
          ))}
        </View>
      )}

      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.white,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  addButtonText: {
    marginLeft: theme.spacing.xs,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  addButtonSimple: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.background.white,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    padding: theme.spacing.lg,
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderStyle: 'dashed',
  },
  emptyStateText: {
    color: theme.colors.text.secondary,
    fontStyle: 'italic',
    fontSize: 16,
    marginBottom: theme.spacing.xs,
  },
  emptyStateSubtext: {
    color: theme.colors.text.secondary,
    fontSize: 14,
    textAlign: 'center',
  },
  listItem: {
    width: '100%',
    marginBottom: theme.spacing.xs,
  },
  itemContent: {
    flex: 1,
    padding: theme.spacing.md,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  editButton: {
    padding: theme.spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButton: {
    padding: theme.spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 14,
    color: theme.colors.error,
    marginTop: theme.spacing.xs,
  },
});

// Version condensée pour affichage en ligne des ingrédients
interface InlineIngredientListManagerProps {
  fields: any[];
  renderItem: (item: Omit<Ingredient, 'created_by'>, index: number, onEdit?: () => void) => React.ReactNode;
  onAddItem: () => void;
  onEditItem?: (item: Omit<Ingredient, 'created_by'>, index: number) => void;
  onRemoveItem: (index: number) => void;
  error?: string;
}

export function InlineIngredientListManager({
  fields,
  renderItem,
  onAddItem,
  onEditItem,
  onRemoveItem,
  error
}: InlineIngredientListManagerProps) {
  const handleRemoveItem = (index: number) => {
    onRemoveItem(index);
  };

  const handleEditItem = (index: number) => {
    if (onEditItem && fields[index]) {
      onEditItem(fields[index] as Omit<Ingredient, 'created_by'>, index);
    }
  };

  return (
    <View style={inlineStyles.container}>
      <View style={inlineStyles.header}>
        <Text style={inlineStyles.title}>Ingrédients ({fields.length})</Text>
        <TouchableOpacity 
          style={inlineStyles.addButton} 
          onPress={onAddItem}
        >
          <Ionicons name="add" size={20} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      {fields.length === 0 ? (
        <View style={inlineStyles.emptyState}>
          <Text style={inlineStyles.emptyStateText}>Aucun ingrédient</Text>
        </View>
      ) : (
        <View style={inlineStyles.ingredientsList}>
          {fields.map((item, index) => (
            <View key={item.id || index} style={inlineStyles.ingredientItem}>
              {renderItem(
                item as Omit<Ingredient, 'created_by'>, 
                index,
                onEditItem ? () => handleEditItem(index) : undefined
              )}
              <TouchableOpacity
                style={inlineStyles.removeButton}
                onPress={() => handleRemoveItem(index)}
              >
                <Ionicons name="close" size={14} color={theme.colors.error} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {error && (
        <Text style={inlineStyles.errorText}>{error}</Text>
      )}
    </View>
  );
}

const inlineStyles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.background.white,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    padding: theme.spacing.md,
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderStyle: 'dashed',
  },
  emptyStateText: {
    color: theme.colors.text.secondary,
    fontStyle: 'italic',
    fontSize: 12,
  },
  ingredientsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  removeButton: {
    marginLeft: theme.spacing.xs,
    padding: 2,
  },
  errorText: {
    fontSize: 14,
    color: theme.colors.error,
    marginTop: theme.spacing.xs,
  },
});
