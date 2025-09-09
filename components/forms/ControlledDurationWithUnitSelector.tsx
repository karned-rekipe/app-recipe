/**
 * Composant contrôlé pour sélectionner une durée avec unité de temps et React Hook Form
 * Respecte le principe SRP - responsable uniquement de l'intégration avec React Hook Form
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Controller, Control, FieldValues, Path } from 'react-hook-form';
import { DurationWithUnitSelector, TimeUnit } from '../DurationWithUnitSelector';
import { theme } from '../../constants/theme';

interface ControlledDurationWithUnitSelectorProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  defaultUnit?: TimeUnit;
  required?: boolean;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  rules?: any;
}

export function ControlledDurationWithUnitSelector<T extends FieldValues>({
  name,
  control,
  label,
  defaultUnit = 'minutes',
  required = false,
  disabled = false,
  size = 'small',
  rules,
}: ControlledDurationWithUnitSelectorProps<T>) {
  return (
    <View style={styles.container}>
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <View>
            <DurationWithUnitSelector
              value={value || 0}
              onValueChange={onChange}
              label={required ? `${label} *` : label}
              defaultUnit={defaultUnit}
              disabled={disabled}
              size={size}
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
  errorText: {
    fontSize: 12,
    color: theme.colors.error,
    textAlign: 'center',
    marginTop: theme.spacing.xs,
  },
});
