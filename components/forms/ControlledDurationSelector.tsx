/**
 * Composant contrôlé pour sélectionner une durée avec React Hook Form
 * Respecte le principe SRP - responsable uniquement de la gestion des durées avec form control
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Controller, Control, FieldValues, Path } from 'react-hook-form';
import { NumberSelector } from '../NumberSelector';
import { theme } from '../../constants/theme';

interface ControlledDurationSelectorProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  minValue?: number;
  maxValue?: number;
  step?: number;
  size?: 'small' | 'medium' | 'large';
  required?: boolean;
  disabled?: boolean;
}

export function ControlledDurationSelector<T extends FieldValues>({
  name,
  control,
  label,
  minValue = 0,
  maxValue = 999,
  step = 5,
  size = 'small',
  required = false,
  disabled = false,
}: ControlledDurationSelectorProps<T>) {
  return (
    <View style={styles.container}>
      <Text style={[styles.label, required && styles.required]}>
        {label}
        {required && ' *'}
      </Text>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value } }) => (
          <NumberSelector
            value={value || 0}
            onValueChange={onChange}
            minValue={minValue}
            maxValue={maxValue}
            step={step}
            suffix="min"
            size={size}
            disabled={disabled}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  required: {
    color: theme.colors.error,
  },
});
