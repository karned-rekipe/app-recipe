import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Recipe } from '../types/Recipe';
import { RecipeMetadata } from './RecipeMetadata';

type Props = {
  recipe: Recipe;
  onPress?: () => void;
};

export default function RecipeCard({ recipe, onPress }: Props) {
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
        
        <RecipeMetadata 
          recipe={recipe} 
          variant="card" 
          layout="horizontal" 
        />
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
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
});
