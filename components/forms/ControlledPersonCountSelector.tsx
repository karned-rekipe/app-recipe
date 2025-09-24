/**
 * Composant contrôlé pour la sélection du nombre de personnes
 * Intégré avec React Hook Form
 */

import React from 'react';
import { Control, useController, FieldPath, FieldValues, RegisterOptions } from 'react-hook-form';
import { PersonCountSelector } from './PersonCountSelector';

interface ControlledPersonCountSelectorProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  name: TName;
  control: Control<TFieldValues>;
  rules?: RegisterOptions<TFieldValues, TName>;
  minCount?: number;
  maxCount?: number;
  disabled?: boolean;
}

export function ControlledPersonCountSelector<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  name,
  control,
  rules,
  minCount = 1,
  maxCount = 20,
  disabled = false
}: ControlledPersonCountSelectorProps<TFieldValues, TName>) {
  const {
    field: { value, onChange },
    fieldState: { error }
  } = useController({
    name,
    control,
    rules,
    defaultValue: minCount as any
  });

  const handleValueChange = (newValue: number) => {
    onChange(newValue);
  };

  return (
    <PersonCountSelector
      value={value || minCount}
      onValueChange={handleValueChange}
      minCount={minCount}
      maxCount={maxCount}
      disabled={disabled}
      error={error?.message}
    />
  );
}
