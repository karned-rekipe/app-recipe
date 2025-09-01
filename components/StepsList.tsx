import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Step } from '../types/Recipe';
import { theme } from '../constants/theme';

interface StepItemProps {
  step: Step;
}

interface StepsListProps {
  steps: Step[];
  title?: string;
}

/**
 * Composant pour afficher une étape individuelle
 * Responsabilité : formatage et affichage d'une seule étape de recette
 */
export const StepItem: React.FC<StepItemProps> = ({ step }) => {
  return (
    <View style={styles.stepItem}>
      <View style={styles.stepNumber}>
        <Text style={styles.stepNumberText}>{step.step_number}</Text>
      </View>
      <View style={styles.stepContent}>
        <Text style={styles.stepDescription}>{step.description}</Text>
        {step.duration ? (
          <Text style={styles.stepDuration}>⏱️ {step.duration}</Text>
        ) : null}
      </View>
    </View>
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
  stepDuration: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontWeight: '500',
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
