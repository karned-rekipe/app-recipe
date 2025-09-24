/**
 * Composant contrôlé pour la sélection des quantités
 * Intégré avec React Hook Form
 */

import React from 'react';
import { Control, useController, FieldPath, FieldValues, RegisterOptions } from 'react-hook-form';
import { QuantitySelector } from './QuantitySelector';

interface ControlledQuantitySelectorProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  name: TName;
  control: Control<TFieldValues>;
  rules?: RegisterOptions<TFieldValues, TName>;
  minQuantity?: number;
  maxQuantity?: number;
  disabled?: boolean;
  unit?: string;
}

export function ControlledQuantitySelector<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  name,
  control,
  rules,
  minQuantity = 1,
  maxQuantity = 99,
  disabled = false,
  unit = 'parts'
}: ControlledQuantitySelectorProps<TFieldValues, TName>) {
  const {
    field: { value, onChange },
    fieldState: { error }
  } = useController({
    name,
    control,
    rules,
    defaultValue: minQuantity as any
  });

  const handleValueChange = (newValue: number) => {
    onChange(newValue);
  };

  return (
    <QuantitySelector
      value={value || minQuantity}
      onValueChange={handleValueChange}
      minQuantity={minQuantity}
      maxQuantity={maxQuantity}
      disabled={disabled}
      unit={unit}
      error={error?.message}
    />
  );
}
