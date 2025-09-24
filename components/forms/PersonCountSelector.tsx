/**
 * Composant spécialisé pour la sélection du nombre de personnes
 * Utilise CounterSelector avec des configurations appropriées
 */

import React from 'react';
import { CounterSelector } from './CounterSelector';

interface PersonCountSelectorProps {
  value: number;
  onValueChange: (value: number) => void;
  minCount?: number;
  maxCount?: number;
  disabled?: boolean;
  error?: string;
}

export function PersonCountSelector({
  value,
  onValueChange,
  minCount = 1,
  maxCount = 20,
  disabled = false,
  error
}: PersonCountSelectorProps) {
  const getPersonLabel = (count: number) => {
    return count > 1 ? 'personnes' : 'personne';
  };

  return (
    <CounterSelector
      value={value}
      onValueChange={onValueChange}
      minValue={minCount}
      maxValue={maxCount}
      step={1}
      disabled={disabled}
      size="large"
      label={getPersonLabel(value)}
      error={error}
    />
  );
}
