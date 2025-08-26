import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { RecipeFilters, hasActiveFilters } from '../types/RecipeFilters';

type Props = {
  searchText: string;
  onSearchChange: (text: string) => void;
  filters: RecipeFilters;
  onFilterPress: () => void;
};

export default function SearchAndFilter({ 
  searchText, 
  onSearchChange, 
  filters, 
  onFilterPress 
}: Props) {
  const activeFiltersCount = hasActiveFilters(filters);
  
  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher une recette..."
          value={searchText}
          onChangeText={onSearchChange}
          placeholderTextColor="#999"
        />
        <Text style={styles.searchIcon}>🔍</Text>
      </View>
      
      <Pressable 
        style={[styles.filterButton, activeFiltersCount && styles.filterButtonActive]}
        onPress={onFilterPress}
      >
        <Text style={[styles.filterText, activeFiltersCount && styles.filterTextActive]}>
          filtrer
          {activeFiltersCount && <Text style={styles.filterCount}></Text>}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 16,
    color: '#25292e',
  },
  searchIcon: {
    fontSize: 16,
    marginLeft: 8,
  },
  filterButton: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: 'center',
  },
  filterButtonActive: {
    backgroundColor: '#4CAF50',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  filterTextActive: {
    color: '#fff',
  },
  filterCount: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
