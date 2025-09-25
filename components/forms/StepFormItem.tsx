/**
 * Composant pour afficher un élément d'étape dans une liste de formulaire
 * Respecte le principe SRP - responsable uniquement de l'affichage d'une étape
 */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../../constants/theme';
import { Step } from '../../types/Recipe';

interface StepFormItemProps {
  step: Omit<Step, 'created_by'>;
  index: number;
  onEdit?: () => void;
}

export function StepFormItem({ step, index, onEdit }: StepFormItemProps) {
  const formatDuration = (minutes: number): string => {
    if (minutes === 0) return '';
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (remainingMinutes === 0) return `${hours} h`;
    return `${hours} h ${remainingMinutes} min`;
  };

  const getDurationDisplay = () => {
    const durations = [];
    if (step.preparation_time > 0) {
      durations.push(`Prép: ${formatDuration(step.preparation_time)}`);
    }
    if (step.cooking_time > 0) {
      durations.push(`Cuisson: ${formatDuration(step.cooking_time)}`);
    }
    if (step.rest_time > 0) {
      durations.push(`Repos: ${formatDuration(step.rest_time)}`);
    }
    return durations.join(' • ');
  };

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onEdit}
      activeOpacity={onEdit ? 0.7 : 1}
      disabled={!onEdit}
    >
      <View style={styles.stepNumber}>
        <Text style={styles.stepNumberText}>{step.step_number}</Text>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title}>
          {step.title}
        </Text>
        <Text style={styles.description}>
          {step.description}
        </Text>

        {getDurationDisplay() && (
          <View style={styles.detailDurations}>
            <Text style={styles.detailDurationText}>
              {getDurationDisplay()}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: theme.colors.background.white,
    paddingTop: theme.spacing.sm,
    paddingHorizontal: theme.spacing.sm,
    paddingBottom: theme.spacing.xs,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.sm,
    flexShrink: 0,
  },
  stepNumberText: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.white,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  description: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    lineHeight: 20,
    marginBottom: theme.spacing.sm,
  },
  durationContainer: {
    marginBottom: theme.spacing.xs,
  },
  totalDurationText: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  detailDurations: {
    marginBottom: theme.spacing.sm,
  },
  detailDurationText: {
    fontSize: 12,
    color: theme.colors.text.secondary,
  },
});
