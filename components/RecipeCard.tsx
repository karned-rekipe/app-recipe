import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Recipe } from '../types/Recipe';

type Props = {
  recipe: Recipe;
  onPress?: () => void;
};

export default function RecipeCard({ recipe, onPress }: Props) {
  const formatTime = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes}min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h${remainingMinutes}min` : `${hours}h`;
  };

  const renderDifficulty = (difficulty: number): string => {
    return '👨‍🍳'.repeat(difficulty);
  };

  const getTypeColor = (type: string): string => {
    switch (type) {
      case 'entrée':
        return '#4CAF50'; // Vert
      case 'plat':
        return '#FF9800'; // Orange
      case 'dessert':
        return '#E91E63'; // Rose
      default:
        return '#757575'; // Gris
    }
  };

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [
      styles.container,
      pressed && styles.pressed
    ]}>
      <View style={styles.imageContainer}>
        {recipe.image ? (
          <Image source={{ uri: recipe.image }} style={styles.recipeImage} />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>🍽️</Text>
          </View>
        )}
      </View>
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.recipeName} numberOfLines={2}>{recipe.name}</Text>
          <Text style={styles.countryFlag}>{recipe.countryFlag}</Text>
        </View>
        
        <View style={[styles.typeTag, { backgroundColor: getTypeColor(recipe.type) }]}>
          <Text style={styles.typeText}>{recipe.type.toUpperCase()}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.difficultyText}>{renderDifficulty(recipe.difficulty)}</Text>
          <Text style={styles.timeText}>{formatTime(recipe.totalTime)}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 0,
    margin: 8,
    flex: 1,
    maxWidth: '45%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  imageContainer: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: 'hidden',
  },
  recipeImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 32,
  },
  content: {
    padding: 12,
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  recipeName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#25292e',
    flex: 1,
    marginRight: 4,
    lineHeight: 18,
  },
  countryFlag: {
    fontSize: 16,
  },
  typeTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginBottom: 8,
  },
  typeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  difficultyText: {
    fontSize: 14,
  },
  timeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
});
