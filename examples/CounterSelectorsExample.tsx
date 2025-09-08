/**
 * Exemple d'utilisation des nouveaux composants de compteurs
 * Démontre l'utilisation avec React Hook Form et les bonnes pratiques
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useForm } from 'react-hook-form';
import { theme } from '../constants/theme';

import {
  PersonCountSelector,
  QuantitySelector,
  ControlledPersonCountSelector,
  ControlledQuantitySelector,
} from '../components/forms/index';

interface ExampleFormData {
  number_of_persons: number;
  quantity: number;
  servings: number;
}

export function CounterSelectorsExample() {
  // Exemple avec React Hook Form
  const { control, watch } = useForm<ExampleFormData>({
    defaultValues: {
      number_of_persons: 4,
      quantity: 12,
      servings: 8,
    }
  });

  // Observer les valeurs pour calculer les parts par personne
  const numberOfPersons = watch('number_of_persons');
  const quantity = watch('quantity');
  const partsPerPerson = numberOfPersons > 0 ? Math.round(quantity / numberOfPersons) : 0;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Exemples de Sélecteurs de Compteurs</Text>

      {/* Section des composants contrôlés (recommandé avec React Hook Form) */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Avec React Hook Form (Recommandé)</Text>
        
        <Text style={styles.subtitle}>Nombre de personnes</Text>
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

        <Text style={styles.subtitle}>Quantité totale (parts)</Text>
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

        <Text style={styles.subtitle}>Portions individuelles</Text>
        <ControlledQuantitySelector
          name="servings"
          control={control}
          minQuantity={1}
          maxQuantity={50}
          unit="portions"
        />

        {/* Calcul automatique */}
        <View style={styles.calculationContainer}>
          <Text style={styles.calculationText}>
            📊 Calcul automatique: {partsPerPerson} parts par personne
          </Text>
          <Text style={styles.calculationSubtext}>
            ({quantity} parts ÷ {numberOfPersons} personnes)
          </Text>
        </View>
      </View>

      {/* Section des composants non contrôlés (usage basique) */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Composants de base (sans formulaire)</Text>
        
        <Text style={styles.subtitle}>Sélecteur de personnes - Taille normale</Text>
        <PersonCountSelector
          value={4}
          onValueChange={(value) => console.log('Personnes:', value)}
          minCount={1}
          maxCount={12}
        />

        <Text style={styles.subtitle}>Sélecteur de quantité - Taille réduite</Text>
        <QuantitySelector
          value={8}
          onValueChange={(value) => console.log('Quantité:', value)}
          minQuantity={1}
          maxQuantity={50}
          unit="pièces"
        />
      </View>

      {/* Exemples d'usage spécialisés */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Cas d'usage spécialisés</Text>
        
        <Text style={styles.subtitle}>Crêpes (exemple utilisateur)</Text>
        <View style={styles.exampleContainer}>
          <Text style={styles.exampleDescription}>
            🥞 Pour des crêpes: 4 personnes, 12 crêpes au total
          </Text>
          <PersonCountSelector
            value={4}
            onValueChange={() => {}}
            minCount={1}
            maxCount={8}
          />
          <QuantitySelector
            value={12}
            onValueChange={() => {}}
            minQuantity={1}
            maxQuantity={48}
            unit="crêpes"
          />
          <Text style={styles.resultText}>
            → 3 crêpes par personne
          </Text>
        </View>

        <Text style={styles.subtitle}>Pizza (autre exemple)</Text>
        <View style={styles.exampleContainer}>
          <Text style={styles.exampleDescription}>
            🍕 Pour des pizzas: 6 personnes, 18 parts
          </Text>
          <PersonCountSelector
            value={6}
            onValueChange={() => {}}
            minCount={1}
            maxCount={10}
          />
          <QuantitySelector
            value={18}
            onValueChange={() => {}}
            minQuantity={1}
            maxQuantity={50}
            unit="parts"
          />
          <Text style={styles.resultText}>
            → 3 parts par personne
          </Text>
        </View>
      </View>

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.white,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginVertical: theme.spacing.lg,
  },
  section: {
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.xl,
    padding: theme.spacing.md,
    backgroundColor: '#F8F9FA',
    borderRadius: theme.borderRadius.md,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
    marginTop: theme.spacing.md,
  },
  calculationContainer: {
    backgroundColor: theme.colors.primary + '10',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  calculationText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.primary,
    textAlign: 'center',
  },
  calculationSubtext: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginTop: 4,
  },
  exampleContainer: {
    backgroundColor: theme.colors.background.white,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
  },
  exampleDescription: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
    fontStyle: 'italic',
  },
  resultText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.success,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
  },
  bottomSpacing: {
    height: 50,
  },
});
