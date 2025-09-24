/**
 * Version contrôlée du CountrySelect pour React Hook Form
 * Respecte le principe SRP (Single Responsibility Principle)
 */

import React from 'react';
import { Control, Controller, FieldError } from 'react-hook-form';
import { CountrySelect } from './CountrySelect';

interface ControlledCountrySelectProps {
  name: string;
  control: Control<any>;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  style?: any;
  rules?: object;
}

/**
 * Composant de sélection de pays contrôlé par React Hook Form
 */
export function ControlledCountrySelect({
  name,
  control,
  label,
  placeholder,
  required = false,
  disabled = false,
  style,
  rules,
}: ControlledCountrySelectProps) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <CountrySelect
          value={value}
          onValueChange={onChange}
          label={label}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          error={error?.message}
          style={style}
        />
      )}
    />
  );
}
