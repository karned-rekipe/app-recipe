/**
 * Gestionnaire de liste universel utilisant useFieldArray
 * Respecte le principe SRP - responsable uniquement de la gestion des listes
 */

import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  FlatList,
  StyleSheet 
} from 'react-native';
import { Control, useFieldArray, FieldArrayPath, FieldValues, FieldArray } from 'react-hook-form';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';

interface UniversalListManagerProps<
  TFieldValues extends FieldValues = FieldValues,
  TFieldArrayName extends FieldArrayPath<TFieldValues> = FieldArrayPath<TFieldValues>
> {
  name: TFieldArrayName;
  control: Control<TFieldValues>;
  title: string;
  renderItem: (item: FieldArray<TFieldValues, TFieldArrayName>, index: number, onEdit?: () => void) => React.ReactNode;
  onAddItem: () => void;
  onEditItem?: (item: FieldArray<TFieldValues, TFieldArrayName>, index: number) => void;
  addButtonText: string;
  emptyStateText: string;
  error?: string;
  allowEdit?: boolean;
}

export function UniversalListManager<
  TFieldValues extends FieldValues = FieldValues,
  TFieldArrayName extends FieldArrayPath<TFieldValues> = FieldArrayPath<TFieldValues>
>({
  name,
  control,
  title,
  renderItem,
  onAddItem,
  onEditItem,
  addButtonText,
  emptyStateText,
  error,
  allowEdit = false
}: UniversalListManagerProps<TFieldValues, TFieldArrayName>) {
  const { fields, remove, update } = useFieldArray({
    control,
    name
  });

  const handleRemoveItem = (index: number) => {
    remove(index);
  };

  const handleEditItem = (index: number) => {
    if (onEditItem && fields[index]) {
      onEditItem(fields[index] as FieldArray<TFieldValues, TFieldArrayName>, index);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={onAddItem}
        >
          <Ionicons name="add" size={20} color={theme.colors.primary} />
          <Text style={styles.addButtonText}>{addButtonText}</Text>
        </TouchableOpacity>
      </View>

      {fields.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>{emptyStateText}</Text>
        </View>
      ) : (
        <FlatList
          data={fields}
          renderItem={({ item, index }) => (
            <View style={styles.listItem}>
              <View style={styles.itemContent}>
                {renderItem(
                  item as FieldArray<TFieldValues, TFieldArrayName>, 
                  index,
                  allowEdit ? () => handleEditItem(index) : undefined
                )}
              </View>
              <View style={styles.actions}>
                {allowEdit && onEditItem && (
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
          )}
          keyExtractor={(_, index) => index.toString()}
          scrollEnabled={false}
        />
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
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
    backgroundColor: theme.colors.background.white,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
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
