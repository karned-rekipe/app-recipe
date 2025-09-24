/**
 * Modale pour ajouter/modifier une étape avec React Hook Form
 * Utilise la composition avec BaseModal et useModalForm
 */

import React from 'react';
import { theme } from '../../constants/theme';
import { ControlledInput } from './ControlledInput';
import { Step } from '../../types/Recipe';
import { BaseModal } from './BaseModal';
import { useModalForm } from './useModalForm';

interface StepFormData {
  description: string;
  duration: string;
}

interface ModernStepModalProps {
  visible: boolean;
  stepNumber: number;
  onSave: (step: Omit<Step, 'created_by'>) => void;
  onCancel: () => void;
  initialData?: Omit<Step, 'created_by'>;
  mode?: 'add' | 'edit';
}

export function ModernStepModal({
  visible,
  stepNumber,
  onSave,
  onCancel,
  initialData,
  mode = 'add',
}: ModernStepModalProps) {
  const {
    control,
    errors,
    isValid,
    onSubmit,
    handleCancel,
  } = useModalForm<StepFormData>({
    defaultValues: {
      description: initialData?.description || '',
      duration: initialData?.duration || '',
    },
    onSave: (data) => {
      const durationInMinutes = parseInt(data.duration) || 0;
      onSave({
        step_number: stepNumber,
        title: '', // Empty title as we're using description
        description: data.description,
        duration: durationInMinutes * 60, // Convert minutes to seconds for duration field
        total_duration: durationInMinutes, // Store in minutes for display
        cooking_duration: 0,
        rest_duration: 0,
        preparation_duration: durationInMinutes * 60, // Assume all duration is preparation
      });
    },
    onCancel,
  });

  return (
    <BaseModal
      visible={visible}
      title={mode === 'edit' ? `Modifier l'étape ${stepNumber}` : `Étape ${stepNumber}`}
      onCancel={handleCancel}
      onSave={onSubmit}
      isValid={isValid}
      saveButtonText={mode === 'edit' ? 'Modifier' : 'Ajouter'}
    >
      <ControlledInput
        name="description"
        control={control}
        label="Description de l'étape"
        placeholder="Décrivez cette étape de préparation..."
        multiline
        numberOfLines={4}
        textAlignVertical="top"
        rules={{ required: 'La description est requise' }}
        required
      />

      <ControlledInput
        name="duration"
        control={control}
        label="Durée (en minutes)"
        placeholder="15"
        keyboardType="numeric"
        rules={{
          pattern: {
            value: /^\d+$/,
            message: 'Veuillez entrer un nombre valide'
          },
        }}
      />
    </BaseModal>
  );
}
