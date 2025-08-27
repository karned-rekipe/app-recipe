import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { sampleRecipes } from '../data/sampleRecipes';
import { Recipe } from '../types/Recipe';

export default function RecipeDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  
  const recipe = sampleRecipes.find((r: Recipe) => r.id === id);

  if (!recipe) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Recette non trouvée</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Retour</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const getDifficultyStars = (difficulty: number) => {
    return '👨‍🍳'.repeat(difficulty);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Image de la recette avec bouton fermer en surimpression */}
      {recipe.image ? (
        <View style={styles.imageContainer}>
          <Image source={{ uri: recipe.image }} style={styles.recipeImage} />
          <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.noImageContainer}>
          <TouchableOpacity style={styles.closeButtonNoImage} onPress={() => router.back()}>
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      )}

      {/* Informations principales */}
      <View style={styles.content}>

        {/* Informations détaillées */}
        <View style={styles.detailsContainer}>
            <View style={styles.detailItem}>
                <View style={[styles.badge, getTypeBadgeStyle(recipe.type)]}>
                <Text style={styles.badgeText}>{recipe.type}</Text>
            </View>
            <View style={styles.detailItem}>
                <Ionicons name="time-outline" size={20} color="#666" />
                <Text style={styles.detailText}>{recipe.totalTime} minutes</Text>
            </View>
            <View style={styles.detailItem}>
                <Text style={styles.detailText}>{getDifficultyStars(recipe.difficulty)}</Text>
            </View>
          </View>
        </View>


        <View style={styles.titleSection}>
          <Text style={styles.recipeName}>{recipe.name}</Text>
          <Text style={styles.countryFlag}>{recipe.countryFlag}</Text>
        </View>

        {/* Section à développer plus tard */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ingrédients</Text>
          <Text style={styles.placeholderText}>Les ingrédients seront ajoutés prochainement...</Text>
        </View>

        {/* Section à développer plus tard */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ustensiles</Text>
          <Text style={styles.placeholderText}>Les ustensiles seront ajoutés prochainement...</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Instructions</Text>
          <Text style={styles.placeholderText}>Les instructions de préparation seront ajoutées prochainement...</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const getTypeBadgeStyle = (type: string) => {
  switch (type) {
    case 'entrée':
      return { backgroundColor: '#e8f5e8' };
    case 'plat':
      return { backgroundColor: '#fff3e0' };
    case 'dessert':
      return { backgroundColor: '#fce4ec' };
    default:
      return { backgroundColor: '#f5f5f5' };
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageContainer: {
    position: 'relative',
  },
  noImageContainer: {
    height: 80,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 10, // Pour tenir compte du status bar
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 8,
    zIndex: 10,
  },
  closeButtonNoImage: {
    position: 'absolute',
    top: 10, // Pour tenir compte du status bar
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 8,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  recipeImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  content: {
    padding: 20,
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  recipeName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  countryFlag: {
    fontSize: 32,
    marginLeft: 12,
  },
  country: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
    fontStyle: 'italic',
  },
  badgeContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    textTransform: 'capitalize',
  },
  detailsContainer: {
    
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    justifyContent: 'space-between',
  },
  detailIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  detailText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  placeholderText: {
    fontSize: 16,
    color: '#999',
    fontStyle: 'italic',
    lineHeight: 24,
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 100,
  },
  backButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 20,
    alignSelf: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});
