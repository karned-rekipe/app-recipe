/**
 * Composant contrôlé pour la sélection de prix
 * Intégration avec React Hook Form
 */

import React from 'react';
import { Controller, FieldPath, FieldValues, Control, RegisterOptions } from 'react-hook-form';
import { PriceSelector, PriceValue } from './PriceSelector';

interface ControlledPriceSelectorProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  name: TName;
  control: Control<TFieldValues>;
  rules?: Omit<RegisterOptions<TFieldValues, TName>, 'valueAsNumber' | 'valueAsDate' | 'setValueAs'>;
  disabled?: boolean;
}

export function ControlledPriceSelector<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({ 
  name, 
  control, 
  rules, 
  disabled = false 
}: ControlledPriceSelectorProps<TFieldValues, TName>) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <PriceSelector
          value={field.value as PriceValue}
          onValueChange={(value: PriceValue) => {
            field.onChange(value);
          }}
          disabled={disabled}
          error={fieldState.error?.message}
        />
      )}
    />
  );
}
