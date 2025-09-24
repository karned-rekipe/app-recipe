/**
 * Test rapide des nouveaux composants de compteurs
 * Pour vérifier que l'implémentation fonctionne correctement
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useForm } from 'react-hook-form';
import { theme } from '../constants/theme';

import {
  ControlledPersonCountSelector,
  ControlledQuantitySelector,
  RecipeFormData
} from '../components/forms';

export function CounterTestScreen() {
  const { control, watch } = useForm<Pick<RecipeFormData, 'number_of_persons' | 'quantity'>>({
    defaultValues: {
      number_of_persons: 4,
      quantity: 12,
    }
  });

  const numberOfPersons = watch('number_of_persons');
  const quantity = watch('quantity');
  const partsPerPerson = numberOfPersons > 0 ? Math.round(quantity / numberOfPersons) : 0;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Test des Nouveaux Composants</Text>
      
      {/* Test du sélecteur de personnes */}
      <View style={styles.section}>
        <Text style={styles.label}>Nombre de personnes (taille large)</Text>
        <ControlledPersonCountSelector
          name="number_of_persons"
          control={control}
          rules={{ 
            required: 'Le nombre de personnes est requis',
            min: { value: 1, message: 'Minimum 1 personne' },
            max: { value: 20, message: 'Maximum 20 personnes' }
          }}
          minCount={1}
          maxCount={20}
        />
      </View>

      {/* Test du sélecteur de quantité */}
      <View style={styles.section}>
        <Text style={styles.label}>Quantité totale (taille réduite)</Text>
        <ControlledQuantitySelector
          name="quantity"
          control={control}
          rules={{ 
            required: 'La quantité est requise',
            min: { value: 1, message: 'Minimum 1 part' },
            max: { value: 99, message: 'Maximum 99 parts' }
          }}
          minQuantity={1}
          maxQuantity={99}
          unit="parts"
        />
      </View>

      {/* Résultat calculé */}
      <View style={styles.result}>
        <Text style={styles.resultText}>
          📊 Calcul automatique: {partsPerPerson} parts par personne
        </Text>
        <Text style={styles.resultSubtext}>
          ({quantity} parts ÷ {numberOfPersons} personnes)
        </Text>
      </View>

      {/* Test avec l'exemple des crêpes */}
      <View style={styles.exampleSection}>
        <Text style={styles.exampleTitle}>🥞 Exemple Crêpes</Text>
        <Text style={styles.exampleText}>
          Pour {numberOfPersons} personne{numberOfPersons > 1 ? 's' : ''}, 
          prévoir {quantity} crêpe{quantity > 1 ? 's' : ''} 
          (soit {partsPerPerson} par personne)
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.white,
    padding: theme.spacing.md,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  result: {
    backgroundColor: theme.colors.primary + '10',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginVertical: theme.spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  resultText: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.primary,
    textAlign: 'center',
  },
  resultSubtext: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginTop: 4,
  },
  exampleSection: {
    backgroundColor: '#F8F9FA',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.lg,
  },
  exampleTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  exampleText: {
    fontSize: 16,
    color: theme.colors.text.secondary,
    lineHeight: 24,
  },
});
