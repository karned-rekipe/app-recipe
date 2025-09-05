/**
 * Composant générique pour gérer des listes d'éléments (ingrédients, étapes, ustensiles)
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';

interface ListItem {
  id: string;
  [key: string]: any;
}

interface FormListManagerProps<T extends ListItem> {
  title: string;
  items: T[];
  onItemsChange: (items: T[]) => void;
  renderItem: (item: T, index: number) => React.ReactNode;
  onAddItem: () => void;
  addButtonText?: string;
  emptyStateText?: string;
}

export function FormListManager<T extends ListItem>({
  title,
  items,
  onItemsChange,
  renderItem,
  onAddItem,
  addButtonText = "Ajouter",
  emptyStateText = "Aucun élément ajouté"
}: FormListManagerProps<T>) {
  
  const handleRemoveItem = (index: number) => {
    Alert.alert(
      "Confirmer la suppression",
      "Êtes-vous sûr de vouloir supprimer cet élément ?",
      [
        { text: "Annuler", style: "cancel" },
        { 
          text: "Supprimer", 
          style: "destructive",
          onPress: () => {
            const newItems = items.filter((_, i) => i !== index);
            onItemsChange(newItems);
          }
        }
      ]
    );
  };

  const handleMoveItem = (fromIndex: number, direction: 'up' | 'down') => {
    const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1;
    if (toIndex < 0 || toIndex >= items.length) return;

    const newItems = [...items];
    [newItems[fromIndex], newItems[toIndex]] = [newItems[toIndex], newItems[fromIndex]];
    onItemsChange(newItems);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      
      {items.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>{emptyStateText}</Text>
        </View>
      ) : (
        <View style={styles.itemsList}>
          {items.map((item, index) => (
            <View key={item.id} style={styles.itemContainer}>
              <View style={styles.itemContent}>
                {renderItem(item, index)}
              </View>
              <View style={styles.itemActions}>
                {items.length > 1 && (
                  <>
                    <TouchableOpacity
                      style={[styles.actionButton, index === 0 && styles.disabledButton]}
                      onPress={() => handleMoveItem(index, 'up')}
                      disabled={index === 0}
                    >
                      <Ionicons 
                        name="chevron-up" 
                        size={20} 
                        color={index === 0 ? theme.colors.text.placeholder : theme.colors.text.secondary} 
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionButton, index === items.length - 1 && styles.disabledButton]}
                      onPress={() => handleMoveItem(index, 'down')}
                      disabled={index === items.length - 1}
                    >
                      <Ionicons 
                        name="chevron-down" 
                        size={20} 
                        color={index === items.length - 1 ? theme.colors.text.placeholder : theme.colors.text.secondary} 
                      />
                    </TouchableOpacity>
                  </>
                )}
                <TouchableOpacity
                  style={[styles.actionButton, styles.deleteButton]}
                  onPress={() => handleRemoveItem(index)}
                >
                  <Ionicons name="trash-outline" size={20} color={theme.colors.error} />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}
      
      <TouchableOpacity style={styles.addButton} onPress={onAddItem}>
        <Ionicons name="add" size={24} color={theme.colors.primary} />
        <Text style={styles.addButtonText}>{addButtonText}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.lg,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  emptyState: {
    padding: theme.spacing.lg,
    alignItems: 'center',
    backgroundColor: theme.colors.background.white,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderStyle: 'dashed',
  },
  emptyStateText: {
    color: theme.colors.text.secondary,
    fontSize: 16,
  },
  itemsList: {
    gap: theme.spacing.sm,
  },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.background.white,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  itemContent: {
    flex: 1,
  },
  itemActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: theme.spacing.sm,
  },
  actionButton: {
    padding: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    marginLeft: theme.spacing.xs,
  },
  disabledButton: {
    opacity: 0.3,
  },
  deleteButton: {
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.white,
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    borderStyle: 'dashed',
    marginTop: theme.spacing.md,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.primary,
    marginLeft: theme.spacing.sm,
  },
});
