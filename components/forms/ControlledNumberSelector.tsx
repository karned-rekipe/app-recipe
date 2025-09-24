/**
 * Composants contrôlés pour les sélecteurs numériques avec React Hook Form
 * Respectent le principe SRP et réutilisent NumberSelector
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Controller, Control, FieldValues, Path } from 'react-hook-form';
import { NumberSelector } from '../NumberSelector';
import { theme } from '../../constants/theme';

interface ControlledNumberSelectorProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  suffix?: string;
  minValue?: number;
  maxValue?: number;
  step?: number;
  size?: 'small' | 'medium' | 'large';
  required?: boolean;
  disabled?: boolean;
  rules?: any;
}

export function ControlledNumberSelector<T extends FieldValues>({
  name,
  control,
  label,
  suffix,
  minValue = 1,
  maxValue = 999,
  step = 1,
  size = 'medium',
  required = false,
  disabled = false,
  rules,
}: ControlledNumberSelectorProps<T>) {
  return (
    <View style={styles.container}>
      <Text style={[styles.label, required && styles.required]}>
        {label}
        {required && ' *'}
      </Text>
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <View>
            <NumberSelector
              value={value || minValue}
              onValueChange={onChange}
              minValue={minValue}
              maxValue={maxValue}
              step={step}
              suffix={suffix}
              size={size}
              disabled={disabled}
            />
            {error && <Text style={styles.errorText}>{error.message}</Text>}
          </View>
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
    textAlign: 'center',
  },
  required: {
    color: theme.colors.error,
  },
  errorText: {
    fontSize: 12,
    color: theme.colors.error,
    textAlign: 'center',
    marginTop: theme.spacing.xs,
  },
});
