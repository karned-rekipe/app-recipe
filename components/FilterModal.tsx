import React from 'react';
import {
    Modal,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { Recipe } from '../types/Recipe';
import { RecipeFilters } from '../types/RecipeFilters';
import { mapRecipesToLegacy } from '../utils/recipeMapper';

type Props = {
  visible: boolean;
  onClose: () => void;
  filters: RecipeFilters;
  onFiltersChange: (filters: RecipeFilters) => void;
  recipes: Recipe[]; // Pour extraire les valeurs uniques
};

export default function FilterModal({ 
  visible, 
  onClose, 
  filters, 
  onFiltersChange, 
  recipes 
}: Props) {
  // Convertir les recettes API vers le format legacy pour les filtres
  const legacyRecipes = mapRecipesToLegacy(recipes);
  
  // Extraire les valeurs uniques des recettes
  const uniqueTypes = [...new Set(legacyRecipes.map(r => r.type))];
  const uniqueDifficulties = [...new Set(legacyRecipes.map(r => r.difficulty))].sort((a, b) => a - b);
  const uniqueCountries = [...new Set(legacyRecipes.map(r => r.country))].sort();

  const toggleType = (type: string) => {
    const newTypes = filters.types.includes(type)
      ? filters.types.filter(t => t !== type)
      : [...filters.types, type];
    onFiltersChange({ ...filters, types: newTypes });
  };

  const toggleDifficulty = (difficulty: number) => {
    const newDifficulties = filters.difficulties.includes(difficulty)
      ? filters.difficulties.filter(d => d !== difficulty)
      : [...filters.difficulties, difficulty];
    onFiltersChange({ ...filters, difficulties: newDifficulties });
  };

  const toggleCountry = (country: string) => {
    const newCountries = filters.countries.includes(country)
      ? filters.countries.filter(c => c !== country)
      : [...filters.countries, country];
    onFiltersChange({ ...filters, countries: newCountries });
  };

  const clearAllFilters = () => {
    onFiltersChange({ types: [], difficulties: [], countries: [] });
  };

  const renderDifficulty = (difficulty: number): string => {
    return '👨‍🍳'.repeat(difficulty);
  };

  const getTypeColor = (type: string): string => {
    switch (type) {
      case 'entrée':
        return '#4CAF50';
      case 'plat':
        return '#FF9800';
      case 'dessert':
        return '#E91E63';
      default:
        return '#757575';
    }
  };

  const getCountryFlag = (country: string): string => {
    const countryFlags: { [key: string]: string } = {
      'France': '🇫🇷',
      'Italie': '🇮🇹',
      'Espagne': '🇪🇸',
      'Thaïlande': '🇹🇭',
      'Japon': '🇯🇵',
      'États-Unis': '🇺🇸',
    };
    return countryFlags[country] || '🌍';
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Filtres</Text>
          <View style={styles.headerButtons}>
            <Pressable onPress={clearAllFilters} style={styles.clearButton}>
              <Text style={styles.clearText}>Effacer</Text>
            </Pressable>
            <Pressable onPress={onClose} style={styles.doneButton}>
              <Text style={styles.doneText}>Terminé</Text>
            </Pressable>
          </View>
        </View>
        
        <ScrollView style={styles.content}>
          {/* Types */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Types de plat</Text>
            <View style={styles.optionsRow}>
              {uniqueTypes.map(type => (
                <Pressable
                  key={type}
                  style={[
                    styles.typeOption,
                    { backgroundColor: getTypeColor(type) },
                    filters.types.includes(type) && styles.selectedOption
                  ]}
                  onPress={() => toggleType(type)}
                >
                  <Text style={[
                    styles.typeOptionText,
                    filters.types.includes(type) && styles.selectedText
                  ]}>
                    {type.toUpperCase()}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Difficultés */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Difficulté</Text>
            <View style={styles.optionsRow}>
              {uniqueDifficulties.map(difficulty => (
                <Pressable
                  key={difficulty}
                  style={[
                    styles.difficultyOption,
                    filters.difficulties.includes(difficulty) && styles.selectedDifficultyOption
                  ]}
                  onPress={() => toggleDifficulty(difficulty)}
                >
                  <Text style={[
                    styles.difficultyOptionText,
                    filters.difficulties.includes(difficulty) && styles.selectedText
                  ]}>
                    {renderDifficulty(difficulty)}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Pays */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pays d&apos;origine</Text>
            <View style={styles.optionsColumn}>
              {uniqueCountries.map(country => (
                <Pressable
                  key={country}
                  style={[
                    styles.countryOption,
                    filters.countries.includes(country) && styles.selectedCountryOption
                  ]}
                  onPress={() => toggleCountry(country)}
                >
                  <Text style={styles.countryFlag}>{getCountryFlag(country)}</Text>
                  <Text style={[
                    styles.countryOptionText,
                    filters.countries.includes(country) && styles.selectedText
                  ]}>
                    {country}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#25292e',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  clearText: {
    color: '#666',
    fontSize: 16,
  },
  doneButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  doneText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#25292e',
    marginBottom: 16,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  optionsColumn: {
    gap: 12,
  },
  typeOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    opacity: 0.7,
  },
  selectedOption: {
    opacity: 1,
    borderWidth: 3,
    borderColor: '#25292e',
  },
  typeOptionText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  difficultyOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedDifficultyOption: {
    backgroundColor: '#4CAF50',
    borderColor: '#25292e',
  },
  difficultyOptionText: {
    fontSize: 20,
  },
  countryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCountryOption: {
    backgroundColor: '#4CAF50',
    borderColor: '#25292e',
  },
  countryFlag: {
    fontSize: 24,
    marginRight: 12,
  },
  countryOptionText: {
    fontSize: 16,
    color: '#25292e',
  },
  selectedText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
