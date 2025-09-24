/**
 * Exemple d'utilisation du composant PriceSelector
 * Démonstration des bonnes pratiques et du principe SRP
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PriceSelector, PriceValue } from '../components/forms/PriceSelector';
import { theme } from '../constants/theme';

export function PriceSelectorExample() {
  const [selectedPrice, setSelectedPrice] = useState<PriceValue>(1);

  const handlePriceChange = (value: PriceValue) => {
    setSelectedPrice(value);
    console.log('Prix sélectionné:', value);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Exemple de sélection de prix</Text>
      
      <PriceSelector
        value={selectedPrice}
        onValueChange={handlePriceChange}
      />
      
      <Text style={styles.selectedValue}>
        Valeur sélectionnée: {selectedPrice} ({getPriceLabel(selectedPrice)})
      </Text>
      
      {/* Exemple avec erreur */}
      <Text style={styles.subtitle}>Avec erreur :</Text>
      <PriceSelector
        value={selectedPrice}
        onValueChange={handlePriceChange}
        error="Veuillez sélectionner un niveau de prix"
      />
      
      {/* Exemple désactivé */}
      <Text style={styles.subtitle}>Désactivé :</Text>
      <PriceSelector
        value={selectedPrice}
        onValueChange={handlePriceChange}
        disabled
      />
    </View>
  );
}

function getPriceLabel(value: PriceValue): string {
  switch (value) {
    case 1: return 'Économique';
    case 2: return 'Modéré';
    case 3: return 'Élevé';
    default: return 'Inconnu';
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.white,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xl,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.sm,
  },
  selectedValue: {
    fontSize: 16,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.md,
    textAlign: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.overlay + '10',
    borderRadius: theme.borderRadius.sm,
  },
});
