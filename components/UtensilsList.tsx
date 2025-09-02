import React, { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../constants/theme';

interface UtensilsListProps {
  utensils: string[];
  title?: string;
}

interface UtensilItemProps {
  utensil: string;
  index: number;
  checked: boolean;
  onToggle: (index: number) => void;
}

/**
 * Composant pour afficher un ustensile individuel
 */
const UtensilItem: React.FC<UtensilItemProps> = ({ 
  utensil, 
  index, 
  checked, 
  onToggle 
}) => {
  return (
    <TouchableOpacity 
      style={styles.utensilItem} 
      onPress={() => onToggle(index)}
      activeOpacity={0.7}
    >
      <View style={styles.checkboxContainer}>
        <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
          {checked && <Text style={styles.checkmark}>✓</Text>}
        </View>
      </View>
      <Text style={styles.utensilBullet}>🍴</Text>
      <Text style={[
        styles.utensilText,
        checked && styles.utensilTextChecked
      ]}>
        {utensil}
      </Text>
    </TouchableOpacity>
  );
};

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
  const [checkedUtensils, setCheckedUtensils] = useState<boolean[]>(
    new Array(utensils.length).fill(false)
  );

  const toggleUtensil = (index: number) => {
    setCheckedUtensils(prev => {
      const newChecked = [...prev];
      newChecked[index] = !newChecked[index];
      return newChecked;
    });
  };

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
          <UtensilItem
            key={`utensil-${index}`}
            utensil={utensil}
            index={index}
            checked={checkedUtensils[index] || false}
            onToggle={toggleUtensil}
          />
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
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: theme.colors.background.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  checkboxContainer: {
    marginRight: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.background.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  checkmark: {
    color: theme.colors.background.white,
    fontSize: 12,
    fontWeight: 'bold',
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
  utensilTextChecked: {
    textDecorationLine: 'line-through',
    color: theme.colors.textSecondary,
    opacity: 0.6,
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
