/**
 * Composant spécialisé pour la sélection des quantités/parts
 * Utilise CounterSelector avec une taille plus petite
 */

import React from 'react';
import { CounterSelector } from './CounterSelector';

interface QuantitySelectorProps {
  value: number;
  onValueChange: (value: number) => void;
  minQuantity?: number;
  maxQuantity?: number;
  disabled?: boolean;
  error?: string;
  unit?: string;
}

export function QuantitySelector({
  value,
  onValueChange,
  minQuantity = 1,
  maxQuantity = 99,
  disabled = false,
  error,
  unit = 'parts'
}: QuantitySelectorProps) {
  const getQuantityLabel = (quantity: number) => {
    if (unit === 'parts') {
      return quantity > 1 ? 'parts' : 'part';
    }
    return unit;
  };

  return (
    <CounterSelector
      value={value}
      onValueChange={onValueChange}
      minValue={minQuantity}
      maxValue={maxQuantity}
      step={1}
      disabled={disabled}
      size="small"
      label={getQuantityLabel(value)}
      error={error}
    />
  );
}
