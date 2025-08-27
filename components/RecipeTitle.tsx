import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { layout, theme } from '../constants/theme';

interface RecipeTitleProps {
  name: string;
  countryFlag: string;
}

export const RecipeTitle: React.FC<RecipeTitleProps> = ({ name, countryFlag }) => {
  return (
    <View style={styles.titleSection}>
      <Text style={styles.recipeName}>{name}</Text>
      <Text style={styles.countryFlag}>{countryFlag}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  recipeName: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text.primary,
    flex: 1,
  },
  countryFlag: {
    fontSize: layout.flagSize,
    marginLeft: theme.spacing.md,
  },
});
