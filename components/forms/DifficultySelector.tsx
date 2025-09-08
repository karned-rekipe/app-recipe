/**
 * Composant de sélection de difficulté avec affichage 👨‍🍳 👨‍🍳👨‍🍳 👨‍🍳👨‍🍳👨‍🍳
 * Respecte le principe de responsabilité unique (SRP)
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '../../constants/theme';

export type DifficultyValue = 1 | 2 | 3;

interface DifficultySelectorProps {
  value?: DifficultyValue;
  onValueChange: (value: DifficultyValue) => void;
  disabled?: boolean;
  error?: string;
}

const DIFFICULTY_OPTIONS: Array<{ value: DifficultyValue; display: string; label: string }> = [
  { value: 1, display: '👨‍🍳', label: 'Facile' },
  { value: 2, display: '👨‍🍳👨‍🍳', label: 'Moyen' },
  { value: 3, display: '👨‍🍳👨‍🍳👨‍🍳', label: 'Difficile' },
];

export function DifficultySelector({ value, onValueChange, disabled = false, error }: DifficultySelectorProps) {
  const handleDifficultySelect = (difficultyValue: DifficultyValue) => {
    if (!disabled) {
      onValueChange(difficultyValue);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        {DIFFICULTY_OPTIONS.map((option) => {
          const isSelected = value === option.value;
          const buttonStyle = [
            styles.difficultyButton,
            isSelected && styles.selectedButton,
            disabled && styles.disabledButton,
          ];
          const textStyle = [
            styles.difficultyText,
            isSelected && styles.selectedText,
            disabled && styles.disabledText,
          ];

          return (
            <TouchableOpacity
              key={option.value}
              style={buttonStyle}
              onPress={() => handleDifficultySelect(option.value)}
              disabled={disabled}
              activeOpacity={0.7}
              accessibilityLabel={`Difficulté ${option.label}`}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected, disabled }}
            >
              <Text style={textStyle}>{option.display}</Text>
              <Text style={[styles.labelText, isSelected && styles.selectedLabelText]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  difficultyButton: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.background.white,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
  },
  selectedButton: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary + '10', // 10% opacity
  },
  disabledButton: {
    opacity: 0.5,
  },
  difficultyText: {
    fontSize: 24,
    color: theme.colors.text.secondary,
    marginBottom: 4,
  },
  selectedText: {
    color: theme.colors.primary,
  },
  disabledText: {
    color: theme.colors.text.placeholder,
  },
  labelText: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  selectedLabelText: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 14,
    color: theme.colors.error,
    marginTop: theme.spacing.xs,
  },
});
