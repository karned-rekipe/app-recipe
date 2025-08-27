import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { messages, theme } from '../constants';
import { Recipe } from '../types/Recipe';
import { RecipeFilters, getInitialFilters } from '../types/RecipeFilters';
import { EmptyState } from './EmptyState';
import FilterModal from './FilterModal';
import RecipeCard from './RecipeCard';
import SearchAndFilter from './SearchAndFilter';

type Props = {
  recipes: Recipe[];
  onRecipePress?: (recipe: Recipe) => void;
};

export default function RecipeList({ recipes, onRecipePress }: Props) {
  const [searchText, setSearchText] = useState('');
  const [filters, setFilters] = useState<RecipeFilters>(getInitialFilters());
  const [showFilterModal, setShowFilterModal] = useState(false);

  const filteredRecipes = useMemo(() => {
    let filtered = recipes;

    // Filtre par texte de recherche
    if (searchText.trim()) {
      const searchLower = searchText.toLowerCase().trim();
      filtered = filtered.filter(recipe =>
        recipe.name.toLowerCase().includes(searchLower) ||
        recipe.country.toLowerCase().includes(searchLower) ||
        recipe.type.toLowerCase().includes(searchLower)
      );
    }

    // Filtre par type
    if (filters.types.length > 0) {
      filtered = filtered.filter(recipe =>
        filters.types.includes(recipe.type)
      );
    }

    // Filtre par difficulté
    if (filters.difficulties.length > 0) {
      filtered = filtered.filter(recipe =>
        filters.difficulties.includes(recipe.difficulty)
      );
    }

    // Filtre par pays
    if (filters.countries.length > 0) {
      filtered = filtered.filter(recipe =>
        filters.countries.includes(recipe.country)
      );
    }

    return filtered;
  }, [recipes, searchText, filters]);

  const renderRecipe = ({ item }: { item: Recipe }) => (
    <RecipeCard 
      recipe={item} 
      onPress={() => onRecipePress?.(item)}
    />
  );

  if (filteredRecipes.length === 0) {
    const hasSearchOrFilters = searchText.trim() || 
      filters.types.length > 0 || 
      filters.difficulties.length > 0 || 
      filters.countries.length > 0;
    
    return (
      <View style={styles.container}>
        <SearchAndFilter
          searchText={searchText}
          onSearchChange={setSearchText}
          filters={filters}
          onFilterPress={() => setShowFilterModal(true)}
        />
        <EmptyState
          message={hasSearchOrFilters 
            ? messages.empty.noSearchResults 
            : messages.empty.noRecipes
          }
          icon="🍽️"
        />
        <FilterModal
          visible={showFilterModal}
          onClose={() => setShowFilterModal(false)}
          filters={filters}
          onFiltersChange={setFilters}
          recipes={recipes}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SearchAndFilter
        searchText={searchText}
        onSearchChange={setSearchText}
        filters={filters}
        onFilterPress={() => setShowFilterModal(true)}
      />
      <FlatList
        data={filteredRecipes}
        renderItem={renderRecipe}
        keyExtractor={(item) => item.id}
        numColumns={2}
        style={styles.listContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
        columnWrapperStyle={styles.row}
      />
      <FilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        filters={filters}
        onFiltersChange={setFilters}
        recipes={recipes}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.white,
  },
  listContainer: {
    flex: 1,
  },
  contentContainer: {
    padding: theme.spacing.sm,
  },
  row: {
    justifyContent: 'space-around',
  },
});