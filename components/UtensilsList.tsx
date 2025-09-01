import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { theme } from '../constants/theme';

interface UtensilsListProps {
  utensils: string[];
  title?: string;
}

/**
 * Composant pour afficher la liste des ustensiles nécessaires
 * Responsabilité : affichage et formatage des ustensiles requis pour la recette
 */
export const UtensilsList: React.FC<UtensilsListProps> = ({ 
  utensils, 
  title = "Ustensiles" 
}) => {
  if (utensils.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.noUtensils}>Aucun ustensile spécifique requis</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.utensilsList}>
        {utensils.map((utensil, index) => (
          <View key={`utensil-${index}`} style={styles.utensilItem}>
            <Text style={styles.utensilBullet}>🍴</Text>
            <Text style={styles.utensilText}>{utensil}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: 12,
  },
  utensilsList: {
    gap: 8,
  },
  utensilItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: theme.colors.background.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  utensilBullet: {
    fontSize: 16,
    marginRight: 10,
  },
  utensilText: {
    fontSize: 14,
    color: theme.colors.text.primary,
    flex: 1,
  },
  noUtensils: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 20,
  },
});

export default UtensilsList;
