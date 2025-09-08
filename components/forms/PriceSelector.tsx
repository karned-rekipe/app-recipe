/**
 * Composant de sélection de prix avec affichage € €€ €€€
 * Respecte le principe de responsabilité unique (SRP)
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '../../constants/theme';

export type PriceValue = 1 | 2 | 3;

interface PriceSelectorProps {
  value?: PriceValue;
  onValueChange: (value: PriceValue) => void;
  disabled?: boolean;
  error?: string;
}

const PRICE_OPTIONS: Array<{ value: PriceValue; display: string; label: string }> = [
  { value: 1, display: '€', label: 'Économique' },
  { value: 2, display: '€€', label: 'Modéré' },
  { value: 3, display: '€€€', label: 'Élevé' },
];

export function PriceSelector({ value, onValueChange, disabled = false, error }: PriceSelectorProps) {
  const handlePriceSelect = (priceValue: PriceValue) => {
    if (!disabled) {
      onValueChange(priceValue);
    }
  };

  return (
    <View style={styles.container}>
      
      <View style={styles.buttonContainer}>
        {PRICE_OPTIONS.map((option) => {
          const isSelected = value === option.value;
          const buttonStyle = [
            styles.priceButton,
            isSelected && styles.selectedButton,
            disabled && styles.disabledButton,
          ];
          const textStyle = [
            styles.priceText,
            isSelected && styles.selectedText,
            disabled && styles.disabledText,
          ];

          return (
            <TouchableOpacity
              key={option.value}
              style={buttonStyle}
              onPress={() => handlePriceSelect(option.value)}
              disabled={disabled}
              activeOpacity={0.7}
              accessibilityLabel={`Prix ${option.label}`}
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
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  priceButton: {
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
  priceText: {
    fontSize: 24,
    fontWeight: 'bold',
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
