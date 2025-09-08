/**
 * Test d'intégration du DifficultySelector avec les autres composants
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useForm } from 'react-hook-form';
import { 
  DifficultySelector,
  PriceSelector,
  PersonCountSelector,
  ControlledDifficultySelector,
  ControlledPriceSelector,
  ControlledPersonCountSelector,
  DifficultyValue,
  PriceValue
} from '../components/forms';
import { theme } from '../constants/theme';

interface TestFormData {
  price: PriceValue;
  difficulty: DifficultyValue;
  persons: number;
}

export default function DifficultyIntegrationTest() {
  // État pour l'utilisation standalone
  const [price, setPrice] = useState<PriceValue | undefined>();
  const [difficulty, setDifficulty] = useState<DifficultyValue | undefined>();
  const [persons, setPersons] = useState<number>(4);

  // Configuration React Hook Form
  const { control, handleSubmit, watch, formState: { errors } } = useForm<TestFormData>({
    defaultValues: {
      price: undefined,
      difficulty: undefined,
      persons: 4,
    },
  });

  const watchedValues = watch();

  const onSubmit = (data: TestFormData) => {
    Alert.alert(
      'Données du formulaire',
      `Prix: ${data.price}\nDifficulté: ${data.difficulty}\nPersonnes: ${data.persons}`,
      [{ text: 'OK' }]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Test d'Intégration DifficultySelector</Text>
      
      {/* Utilisation standalone */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Utilisation Standalone</Text>
        <Text style={styles.description}>
          Ordre: Prix → Difficulté → Nombre de personnes
        </Text>
        
        <Text style={styles.label}>Prix</Text>
        <PriceSelector
          value={price}
          onValueChange={setPrice}
        />
        
        <Text style={styles.label}>Difficulté</Text>
        <DifficultySelector
          value={difficulty}
          onValueChange={setDifficulty}
        />
        
        <Text style={styles.label}>Nombre de personnes</Text>
        <PersonCountSelector
          value={persons}
          onValueChange={setPersons}
          minCount={1}
          maxCount={12}
        />
        
        {(price || difficulty || persons !== 4) && (
          <View style={styles.result}>
            <Text style={styles.resultText}>
              Prix: {price ? `${price}/3` : 'Non défini'}
            </Text>
            <Text style={styles.resultText}>
              Difficulté: {difficulty ? `${difficulty}/3` : 'Non définie'}
            </Text>
            <Text style={styles.resultText}>
              Personnes: {persons}
            </Text>
          </View>
        )}
      </View>

      {/* Utilisation avec React Hook Form */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Avec React Hook Form</Text>
        <Text style={styles.description}>
          Intégration complète avec validation
        </Text>
        
        <Text style={styles.label}>Prix</Text>
        <ControlledPriceSelector
          name="price"
          control={control}
          rules={{ required: 'Veuillez sélectionner un prix' }}
        />
        
        <Text style={styles.label}>Difficulté</Text>
        <ControlledDifficultySelector
          name="difficulty"
          control={control}
          rules={{ required: 'Veuillez sélectionner une difficulté' }}
        />
        
        <Text style={styles.label}>Nombre de personnes</Text>
        <ControlledPersonCountSelector
          name="persons"
          control={control}
          rules={{ 
            required: 'Le nombre de personnes est requis',
            min: { value: 1, message: 'Minimum 1 personne' },
            max: { value: 12, message: 'Maximum 12 personnes' }
          }}
          minCount={1}
          maxCount={12}
        />
        
        {(watchedValues.price || watchedValues.difficulty || watchedValues.persons !== 4) && (
          <View style={styles.result}>
            <Text style={styles.resultText}>
              Prix formulaire: {watchedValues.price ? `${watchedValues.price}/3` : 'Non défini'}
            </Text>
            <Text style={styles.resultText}>
              Difficulté formulaire: {watchedValues.difficulty ? `${watchedValues.difficulty}/3` : 'Non définie'}
            </Text>
            <Text style={styles.resultText}>
              Personnes formulaire: {watchedValues.persons}
            </Text>
          </View>
        )}
      </View>

      {/* Test de cohérence visuelle */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Test de Cohérence Visuelle</Text>
        <Text style={styles.description}>
          Tous les composants avec valeurs prédéfinies
        </Text>
        
        <Text style={styles.label}>Prix: Modéré (€€)</Text>
        <PriceSelector
          value={2}
          onValueChange={() => {}}
        />
        
        <Text style={styles.label}>Difficulté: Moyen (👨‍🍳👨‍🍳)</Text>
        <DifficultySelector
          value={2}
          onValueChange={() => {}}
        />
        
        <Text style={styles.label}>Personnes: 6</Text>
        <PersonCountSelector
          value={6}
          onValueChange={() => {}}
          minCount={1}
          maxCount={12}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: theme.spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  section: {
    backgroundColor: theme.colors.background.white,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  description: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.lg,
    lineHeight: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
    marginTop: theme.spacing.md,
  },
  result: {
    marginTop: theme.spacing.lg,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.primary + '10',
    borderRadius: theme.borderRadius.md,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  resultText: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: '500',
    marginBottom: 4,
  },
});
