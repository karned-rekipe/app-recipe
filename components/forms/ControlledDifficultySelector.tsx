/**
 * Composant contrôlé pour la sélection de difficulté
 * Intégration avec React Hook Form
 */

import React from 'react';
import { Controller, FieldPath, FieldValues, Control, RegisterOptions } from 'react-hook-form';
import { DifficultySelector, DifficultyValue } from './DifficultySelector';

interface ControlledDifficultySelectorProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  name: TName;
  control: Control<TFieldValues>;
  rules?: Omit<RegisterOptions<TFieldValues, TName>, 'valueAsNumber' | 'valueAsDate' | 'setValueAs'>;
  disabled?: boolean;
}

export function ControlledDifficultySelector<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({ 
  name, 
  control, 
  rules, 
  disabled = false 
}: ControlledDifficultySelectorProps<TFieldValues, TName>) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <DifficultySelector
          value={field.value as DifficultyValue}
          onValueChange={(value: DifficultyValue) => {
            field.onChange(value);
          }}
          disabled={disabled}
          error={fieldState.error?.message}
        />
      )}
    />
  );
}
