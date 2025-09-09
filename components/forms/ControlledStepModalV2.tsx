/**
 * Modale pour ajouter/modifier une étape avec React Hook Form
 * Utilise la composition avec BaseModal et useModalForm
 * Respecte le principe SRP - responsable uniquement de la gestion des étapes
 */

import React, { useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';
import { ControlledInput } from './ControlledInput';
import { ControlledDurationWithUnitSelector } from './ControlledDurationWithUnitSelector';
import { Step } from '../../types/Recipe';
import { BaseModal } from './BaseModal';
import { useModalForm } from './useModalForm';
import { formatDurationFromMinutes } from '../DurationWithUnitSelector';

interface StepFormData {
  title: string;
  description: string;
  cooking_duration: number;
  rest_duration: number;
  preparation_duration: number;
}

interface ControlledStepModalV2Props {
  visible: boolean;
  stepNumber: number;
  onSave: (step: Omit<Step, 'created_by'>) => void;
  onCancel: () => void;
  onDelete?: () => void;
  initialData?: Omit<Step, 'created_by'>;
  mode?: 'add' | 'edit';
}

export function ControlledStepModalV2({
  visible,
  stepNumber,
  onSave,
  onCancel,
  onDelete,
  initialData,
  mode = 'add',
}: ControlledStepModalV2Props) {
  const {
    control,
    errors,
    isValid,
    onSubmit,
    handleCancel,
    watch,
    reset,
  } = useModalForm<StepFormData>({
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      cooking_duration: initialData?.cooking_duration || 0,
      rest_duration: initialData?.rest_duration || 0,
      preparation_duration: initialData?.preparation_duration || 0,
    },
    onSave: (data) => {
      const totalDuration = data.cooking_duration + data.rest_duration + data.preparation_duration;
      onSave({
        step_number: stepNumber,
        title: data.title,
        description: data.description,
        total_duration: totalDuration,
        cooking_duration: data.cooking_duration,
        rest_duration: data.rest_duration,
        preparation_duration: data.preparation_duration,
      });
    },
    onCancel,
  });

  // Réinitialiser le formulaire quand initialData change (pour la modification)
  useEffect(() => {
    if (visible && initialData) {
      reset({
        title: initialData.title || '',
        description: initialData.description || '',
        cooking_duration: initialData.cooking_duration || 0,
        rest_duration: initialData.rest_duration || 0,
        preparation_duration: initialData.preparation_duration || 0,
      });
    } else if (visible && !initialData) {
      reset({
        title: '',
        description: '',
        cooking_duration: 0,
        rest_duration: 0,
        preparation_duration: 0,
      });
    }
  }, [visible, initialData, reset]);

  // Surveiller les changements de durée pour calculer la durée totale
  const cookingDuration = watch('cooking_duration') || 0;
  const restDuration = watch('rest_duration') || 0;
  const preparationDuration = watch('preparation_duration') || 0;
  const totalDuration = cookingDuration + restDuration + preparationDuration;

  return (
    <BaseModal
      visible={visible}
      title={mode === 'edit' ? `Modifier l'étape ${stepNumber}` : `Étape ${stepNumber}`}
      onCancel={handleCancel}
      onSave={onSubmit}
      isValid={isValid}
      saveButtonText={mode === 'edit' ? 'Enregistrer' : 'Créer'}
    >
      <ControlledInput
        name="title"
        control={control}
        label=""
        placeholder="Etape (Ex: Préparation de la pâte, Cuisson...)"
        rules={{ required: 'Le titre est requis' }}
        required
      />

      <ControlledInput
        name="description"
        control={control}
        label=""
        placeholder="Description: Décrivez cette étape de préparation en détail..."
        multiline
        numberOfLines={4}
        textAlignVertical="top"
      />

      <View style={styles.durationSection}>        
        <View style={styles.durationList}>
          <ControlledDurationWithUnitSelector
            name="preparation_duration"
            control={control}
            label="Préparation"
            defaultUnit="minutes"
            size="small"
          />
          
          <ControlledDurationWithUnitSelector
            name="cooking_duration"
            control={control}
            label="Cuisson"
            defaultUnit="minutes"
            size="small"
          />
          
          <ControlledDurationWithUnitSelector
            name="rest_duration"
            control={control}
            label="Repos"
            defaultUnit="hours"
            size="small"
          />
        </View>

        {totalDuration > 0 && (
          <View style={styles.totalDuration}>
            <Text style={styles.totalDurationLabel}>Durée totale</Text>
            <Text style={styles.totalDurationValue}>
              {formatDurationFromMinutes(totalDuration)}
            </Text>
          </View>
        )}
      </View>

      {mode === 'edit' && onDelete && (
        <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
          <Ionicons name="trash-outline" size={20} color={theme.colors.error} />
          <Text style={styles.deleteButtonText}>Supprimer cette étape</Text>
        </TouchableOpacity>
      )}
    </BaseModal>
  );
}

const styles = StyleSheet.create({
  durationSection: {
    marginTop: theme.spacing.sm,
  },
  durationList: {
    gap: theme.spacing.xs,
  },
  totalDuration: {
    backgroundColor: theme.colors.background.overlayLight,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    marginTop: theme.spacing.sm,
    alignItems: 'center',
  },
  totalDurationLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  totalDurationValue: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.lg,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.overlayLight,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.error,
  },
  deleteButtonText: {
    marginLeft: theme.spacing.sm,
    fontSize: 16,
    color: theme.colors.error,
    fontWeight: '500',
  },
});
