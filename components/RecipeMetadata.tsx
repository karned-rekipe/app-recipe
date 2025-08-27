import React from 'react';
import { StyleSheet, View } from 'react-native';
import { theme } from '../constants/theme';
import { Recipe } from '../types/Recipe';
import { DifficultyStars } from './DifficultyStars';
import { TimeDisplay } from './TimeDisplay';
import { TypeBadge } from './TypeBadge';

interface RecipeMetadataProps {
  recipe: Recipe;
  variant?: 'card' | 'detail';
  layout?: 'horizontal' | 'vertical';
}

export const RecipeMetadata: React.FC<RecipeMetadataProps> = ({ 
  recipe, 
  variant = 'detail',
  layout = 'vertical'
}) => {
  const isCard = variant === 'card';
  const timeVariant = isCard ? 'compact' : 'default';
  const size = isCard ? 'small' : 'medium';

  if (layout === 'horizontal') {
    return (
      <View style={styles.horizontalContainer}>
        <TypeBadge type={recipe.type} />
        <View style={styles.horizontalInfo}>
          <DifficultyStars difficulty={recipe.difficulty} size={size} />
          <TimeDisplay minutes={recipe.totalTime} variant={timeVariant} size={size} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.verticalContainer}>
      <TypeBadge type={recipe.type} />
      <View style={styles.infoRow}>
        <DifficultyStars difficulty={recipe.difficulty} size={size} />
        <TimeDisplay minutes={recipe.totalTime} variant={timeVariant} size={size} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  verticalContainer: {
    marginBottom: theme.spacing.md,
  },
  horizontalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  horizontalInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
  },
});
