import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/theme';
import { Recipe } from '../types/Recipe';
import { getTypeBadgeColor } from '../utils/recipeHelpers';

interface TypeBadgeProps {
  type: Recipe['type'];
}

export const TypeBadge: React.FC<TypeBadgeProps> = ({ type }) => {
  return (
    <View style={[styles.badge, { backgroundColor: getTypeBadgeColor(type) }]}>
      <Text style={styles.text}>{type.toUpperCase()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: theme.spacing.md,
  },
  text: {
    color: theme.colors.white,
    fontSize: 10,
    fontWeight: theme.fontWeight.bold,
  },
});
