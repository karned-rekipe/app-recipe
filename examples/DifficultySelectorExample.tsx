/**
 * Exemple d'utilisation du DifficultySelector
 * Démontre l'utilisation standalone et avec React Hook Form
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useForm } from 'react-hook-form';
import { 
  DifficultySelector, 
  ControlledDifficultySelector, 
  DifficultyValue 
} from '../components/forms';
import { theme } from '../constants/theme';

interface FormData {
  difficulty: DifficultyValue;
  recipeName: string;
}

export default function DifficultySelectorExample() {
  // État pour l'utilisation standalone
  const [standaloneDifficulty, setStandaloneDifficulty] = useState<DifficultyValue | undefined>();
  
  // Configuration React Hook Form
  const { control, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      difficulty: undefined,
      recipeName: '',
    },
  });

  const watchedDifficulty = watch('difficulty');

  const onSubmit = (data: FormData) => {
    Alert.alert(
      'Données du formulaire',
      `Difficulté: ${data.difficulty}\nRecette: ${data.recipeName}`,
      [{ text: 'OK' }]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Exemples DifficultySelector</Text>
      
      {/* Utilisation standalone */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Utilisation Standalone</Text>
        <Text style={styles.description}>
          Sélection libre sans formulaire
        </Text>
        
        <DifficultySelector
          value={standaloneDifficulty}
          onValueChange={setStandaloneDifficulty}
        />
        
        {standaloneDifficulty && (
          <Text style={styles.result}>
            Difficulté sélectionnée: {standaloneDifficulty}
          </Text>
        )}
      </View>

      {/* Utilisation avec React Hook Form */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Avec React Hook Form</Text>
        <Text style={styles.description}>
          Intégration complète avec validation
        </Text>
        
        <ControlledDifficultySelector
          name="difficulty"
          control={control}
          rules={{ 
            required: 'Veuillez sélectionner une difficulté' 
          }}
        />
        
        {watchedDifficulty && (
          <Text style={styles.result}>
            Difficulté du formulaire: {watchedDifficulty}
          </Text>
        )}
      </View>

      {/* Exemple désactivé */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>État Désactivé</Text>
        <Text style={styles.description}>
          Composant en lecture seule
        </Text>
        
        <DifficultySelector
          value={2}
          onValueChange={() => {}}
          disabled={true}
        />
      </View>

      {/* Exemple avec erreur */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Avec Message d'Erreur</Text>
        <Text style={styles.description}>
          Affichage d'une erreur de validation
        </Text>
        
        <DifficultySelector
          value={undefined}
          onValueChange={() => {}}
          error="La difficulté est requise pour cette recette"
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
  result: {
    fontSize: 16,
    color: theme.colors.primary,
    fontWeight: '500',
    marginTop: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.primary + '10',
    borderRadius: theme.borderRadius.md,
    textAlign: 'center',
  },
});
