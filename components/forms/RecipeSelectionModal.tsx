/**
 * Modal de sélection de recette existante
 * Permet de parcourir et sélectionner une recette parmi celles disponibles
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TextInput,
  Modal,
  SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';
import { Recipe } from '../../types/Recipe';

interface RecipeSelectionModalProps {
  visible: boolean;
  recipes: Recipe[];
  onSelect: (recipe: Recipe) => void;
  onCancel: () => void;
  currentRecipeId?: string; // Pour éviter de sélectionner la recette en cours d'édition
}

export function RecipeSelectionModal({ 
  visible, 
  recipes, 
  onSelect, 
  onCancel, 
  currentRecipeId 
}: RecipeSelectionModalProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  
  // Filtrer les recettes selon la recherche et exclure la recette courante
  const filteredRecipes = React.useMemo(() => {
    return recipes.filter(recipe => {
      // Exclure la recette courante pour éviter la récursion
      if (currentRecipeId && recipe.uuid === currentRecipeId) {
        return false;
      }
      
      // Filtrer par nom si une recherche est en cours
      if (searchQuery.trim()) {
        return recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
               (recipe.description && recipe.description.toLowerCase().includes(searchQuery.toLowerCase()));
      }
      
      return true;
    });
  }, [recipes, searchQuery, currentRecipeId]);

  const handleSelect = (recipe: Recipe) => {
    onSelect(recipe);
    setSearchQuery(''); // Réinitialiser la recherche
  };

  const handleCancel = () => {
    setSearchQuery(''); // Réinitialiser la recherche
    onCancel();
  };

  const renderRecipeItem = ({ item }: { item: Recipe }) => (
    <TouchableOpacity 
      style={styles.recipeItem} 
      onPress={() => handleSelect(item)}
      activeOpacity={0.7}
    >
      <View style={styles.recipeHeader}>
        <Text style={styles.recipeName} numberOfLines={2}>
          {item.name}
        </Text>
        <View style={styles.recipeMetadata}>
          {item.difficulty && (
            <View style={styles.metadataItem}>
              <Text style={styles.metadataLabel}>Difficulté:</Text>
              <Text style={styles.metadataValue}>{item.difficulty}/5</Text>
            </View>
          )}
          {item.number_of_persons && (
            <View style={styles.metadataItem}>
              <Text style={styles.metadataLabel}>Personnes:</Text>
              <Text style={styles.metadataValue}>{item.number_of_persons}</Text>
            </View>
          )}
        </View>
      </View>
      
      {item.description && (
        <Text style={styles.recipeDescription} numberOfLines={3}>
          {item.description}
        </Text>
      )}
      
      <View style={styles.recipeFooter}>
        {item.origin_country && (
          <Text style={styles.country}>{item.origin_country}</Text>
        )}
        <View style={styles.processInfo}>
          <Text style={styles.processCount}>
            {item.process?.length || 0} processus
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="search-outline" size={48} color={theme.colors.text.secondary} />
      <Text style={styles.emptyStateTitle}>
        {searchQuery ? 'Aucune recette trouvée' : 'Aucune recette disponible'}
      </Text>
      <Text style={styles.emptyStateSubtitle}>
        {searchQuery 
          ? 'Essayez avec d\'autres mots-clés' 
          : 'Créez d\'abord des recettes pour pouvoir les utiliser dans vos processus'
        }
      </Text>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleCancel}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>Annuler</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Sélectionner une recette</Text>
          <View style={{ width: 60 }} />
        </View>

        {/* Barre de recherche */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Ionicons name="search" size={20} color={theme.colors.text.secondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Rechercher une recette..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={theme.colors.text.secondary}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color={theme.colors.text.secondary} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Liste des recettes */}
        <FlatList
          data={filteredRecipes}
          renderItem={renderRecipeItem}
          keyExtractor={(item) => item.uuid}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyState}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />

        {/* Footer avec info */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {filteredRecipes.length} recette{filteredRecipes.length > 1 ? 's' : ''} disponible{filteredRecipes.length > 1 ? 's' : ''}
          </Text>
        </View>
      </SafeAreaView>
    </Modal>
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
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  cancelButton: {
    paddingVertical: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    color: theme.colors.primary,
  },
  searchContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.background.secondary,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.white,
    borderRadius: 12,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text.primary,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm,
  },
  recipeItem: {
    backgroundColor: theme.colors.background.white,
    borderRadius: 12,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  recipeHeader: {
    marginBottom: theme.spacing.sm,
  },
  recipeName: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  recipeMetadata: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  metadataItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metadataLabel: {
    fontSize: 12,
    color: theme.colors.text.secondary,
  },
  metadataValue: {
    fontSize: 12,
    fontWeight: '500',
    color: theme.colors.text.primary,
  },
  recipeDescription: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    lineHeight: 20,
    marginBottom: theme.spacing.sm,
  },
  recipeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  country: {
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  processInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  processCount: {
    fontSize: 12,
    color: theme.colors.text.secondary,
  },
  separator: {
    height: theme.spacing.sm,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.xl,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.background.secondary,
  },
  footerText: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
});