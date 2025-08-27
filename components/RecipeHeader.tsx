import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { layout } from '../constants/theme';
import { CloseButton } from './CloseButton';

interface RecipeHeaderProps {
  image?: string;
  onClose: () => void;
}

export const RecipeHeader: React.FC<RecipeHeaderProps> = ({ image, onClose }) => {
  if (image) {
    return (
      <View style={styles.imageContainer}>
        <Image source={{ uri: image }} style={styles.recipeImage} />
        <CloseButton onPress={onClose} variant="overlay" />
      </View>
    );
  }

  return (
    <View style={styles.noImageContainer}>
      <CloseButton onPress={onClose} variant="light" />
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    position: 'relative',
  },
  noImageContainer: {
    height: layout.noImageContainerHeight,
    position: 'relative',
  },
  recipeImage: {
    width: '100%',
    height: layout.recipeImageHeight,
    resizeMode: 'cover',
  },
});
