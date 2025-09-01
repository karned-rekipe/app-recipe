import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { theme } from '../constants/theme';
import { LegacyRecipe } from '../types/Recipe';
import { getDifficultyStars } from '../utils/recipeHelpers';

interface DifficultyStarsProps {
  difficulty: LegacyRecipe['difficulty'];
  size?: 'small' | 'medium' | 'large';
}

export const DifficultyStars: React.FC<DifficultyStarsProps> = ({ 
  difficulty, 
  size = 'medium' 
}) => {
  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return styles.small;
      case 'large':
        return styles.large;
      default:
        return styles.medium;
    }
  };

  return (
    <Text style={[styles.base, getSizeStyle()]}>
      {getDifficultyStars(difficulty)}
    </Text>
  );
};

const styles = StyleSheet.create({
  base: {
    color: theme.colors.text.secondary,
  },
  small: {
    fontSize: 12,
  },
  medium: {
    fontSize: theme.fontSize.sm,
  },
  large: {
    fontSize: theme.fontSize.md,
  },
});
