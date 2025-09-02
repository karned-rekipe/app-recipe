import React, { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Step } from '../types/Recipe';
import { theme } from '../constants/theme';

interface StepItemProps {
  step: Step;
  index: number;
  checked: boolean;
  onToggle: (index: number) => void;
}

interface StepsListProps {
  steps: Step[];
  title?: string;
}

/**
 * Composant pour afficher une étape individuelle
 * Responsabilité : formatage et affichage d'une seule étape de recette
 */
export const StepItem: React.FC<StepItemProps> = ({ 
  step, 
  index, 
  checked, 
  onToggle 
}) => {
  return (
    <TouchableOpacity 
      style={styles.stepItem} 
      onPress={() => onToggle(index)}
      activeOpacity={0.7}
    >
      <View style={styles.checkboxContainer}>
        <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
          {checked && <Text style={styles.checkmark}>✓</Text>}
        </View>
      </View>
      <View style={styles.stepNumber}>
        <Text style={styles.stepNumberText}>{step.step_number}</Text>
      </View>
      <View style={styles.stepContent}>
        <Text style={[
          styles.stepDescription,
          checked && styles.stepDescriptionChecked
        ]}>
          {step.description}
        </Text>
        {step.duration ? (
          <Text style={[
            styles.stepDuration,
            checked && styles.stepDurationChecked
          ]}>
            ⏱️ {step.duration}
          </Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

/**
 * Composant pour afficher la liste complète des étapes
 * Responsabilité : gestion de la liste des étapes de préparation
 */
export const StepsList: React.FC<StepsListProps> = ({ 
  steps, 
  title = "Étapes de préparation" 
}) => {
  const [checkedSteps, setCheckedSteps] = useState<boolean[]>(
    new Array(steps.length).fill(false)
  );

  const toggleStep = (index: number) => {
    setCheckedSteps(prev => {
      const newChecked = [...prev];
      newChecked[index] = !newChecked[index];
      return newChecked;
    });
  };

  if (steps.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.noSteps}>Aucune étape de préparation spécifiée</Text>
      </View>
    );
  }

  // Trier les étapes par numéro pour s'assurer de l'ordre correct
  const sortedSteps = [...steps].sort((a, b) => a.step_number - b.step_number);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.stepsList}>
        {sortedSteps.map((step, index) => (
          <StepItem 
            key={`step-${step.step_number}-${index}`} 
            step={step}
            index={index}
            checked={checkedSteps[index] || false}
            onToggle={toggleStep}
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
  stepsList: {
    gap: 16,
  },
  stepItem: {
    flexDirection: 'row',
    backgroundColor: theme.colors.background.white,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'flex-start',
  },
  checkboxContainer: {
    marginRight: 12,
    marginTop: 2,
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
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    flexShrink: 0,
  },
  stepNumberText: {
    color: theme.colors.white,
    fontWeight: '600',
    fontSize: 14,
  },
  stepContent: {
    flex: 1,
  },
  stepDescription: {
    fontSize: 14,
    color: theme.colors.text.primary,
    lineHeight: 20,
    marginBottom: 8,
  },
  stepDescriptionChecked: {
    textDecorationLine: 'line-through',
    color: theme.colors.textSecondary,
    opacity: 0.6,
  },
  stepDuration: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  stepDurationChecked: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  noSteps: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 20,
  },
});

export default StepsList;
