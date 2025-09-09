/**
 * Gestionnaire de liste simple pour les tags (attributs et ustensiles)
 * Utilise setValue au lieu de useFieldArray pour plus de simplicité
 */

import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  FlatList,
  StyleSheet 
} from 'react-native';
import { Control, useWatch, UseFormSetValue } from 'react-hook-form';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';
import { RecipeFormData } from './index';

interface SimpleTagListManagerProps {
  control: Control<RecipeFormData>;
  setValue: UseFormSetValue<RecipeFormData>;
  fieldName: 'attributes' | 'utensils';
  title: string;
  addButtonText: string;
  emptyStateText: string;
  renderItem: (item: string, index: number, onEdit?: () => void) => React.ReactNode;
  onAddItem: () => void;
  onEditItem?: (item: string, index: number) => void;
  error?: string;
}

export function SimpleTagListManager({
  control,
  setValue,
  fieldName,
  title,
  addButtonText,
  emptyStateText,
  renderItem,
  onAddItem,
  onEditItem,
  error
}: SimpleTagListManagerProps) {
  const items = useWatch({ control, name: fieldName }) || [];

  const handleRemoveItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setValue(fieldName, newItems);
  };

  const handleEditItem = (index: number) => {
    if (onEditItem && items[index]) {
      onEditItem(items[index], index);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity 
          style={styles.addButtonSimple} 
          onPress={onAddItem}
        >
          <Ionicons name="add" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      {items.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>{emptyStateText}</Text>
        </View>
      ) : (
        <View style={styles.listContainer}>
          {items.map((item, index) => (
            <TouchableOpacity 
              key={index}
              style={styles.listItem}
              onPress={() => handleEditItem(index)}
              activeOpacity={0.7}
            >
              <View style={styles.itemContent}>
                {renderItem(
                  item, 
                  index,
                  onEditItem ? () => handleEditItem(index) : undefined
                )}
              </View>
            </TouchableOpacity>
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
    padding: theme.spacing.md,
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderStyle: 'dashed',
  },
  emptyStateText: {
    color: theme.colors.text.secondary,
    fontStyle: 'italic',
    fontSize: 12,
  },
  listContainer: {
    // Container pour la liste sans style particulier
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.xs,
    paddingVertical: theme.spacing.xs,
  },
  itemContent: {
    flex: 1,
  },
  errorText: {
    fontSize: 14,
    color: theme.colors.error,
    marginTop: theme.spacing.xs,
  },
});
