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
  title: string;
  description: string;
  cooking_time: string;
  rest_time: string;
  preparation_time: string;
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
      title: initialData?.title || '',
      description: initialData?.description || '',
      cooking_time: initialData?.cooking_time ? Math.floor(initialData.cooking_time / 60).toString() : '',
      rest_time: initialData?.rest_time ? Math.floor(initialData.rest_time / 60).toString() : '',
      preparation_time: initialData?.preparation_time ? Math.floor(initialData.preparation_time / 60).toString() : '',
    },
    onSave: (data) => {
      const cookingTime = parseInt(data.cooking_time) || 0;
      const restDuration = parseInt(data.rest_time) || 0;
      const preparationTime = parseInt(data.preparation_time) || 0;
      const totalDuration = cookingTime + restDuration + preparationTime;
      
      onSave({
        step_number: stepNumber,
        title: data.title,
        description: data.description,
        duration: totalDuration * 60, // Total duration in seconds
        cooking_time: cookingTime * 60, // Convert to seconds
        rest_time: restDuration * 60, // Convert to seconds
        preparation_time: preparationTime * 60, // Convert to seconds
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
        name="title"
        control={control}
        label="Titre de l'étape"
        placeholder="Ex: Préparer la pâte, Cuire au four..."
        rules={{ required: 'Le titre est requis' }}
        required
      />

      <ControlledInput
        name="description"
        control={control}
        label="Description de l'étape"
        placeholder="Décrivez cette étape de préparation..."
        multiline
        numberOfLines={4}
        textAlignVertical="top"
      />

      <ControlledInput
        name="cooking_time"
        control={control}
        label="Temps de cuisson (en minutes)"
        placeholder="20"
        keyboardType="numeric"
        rules={{
          pattern: {
            value: /^\d*$/,
            message: 'Veuillez entrer un nombre valide'
          },
        }}
      />

      <ControlledInput
        name="rest_time"
        control={control}
        label="Temps de repos (en minutes)"
        placeholder="15"
        keyboardType="numeric"
        rules={{
          pattern: {
            value: /^\d*$/,
            message: 'Veuillez entrer un nombre valide'
          },
        }}
      />

      <ControlledInput
        name="preparation_time"
        control={control}
        label="Temps de préparation (en minutes)"
        placeholder="10"
        keyboardType="numeric"
        rules={{
          pattern: {
            value: /^\d*$/,
            message: 'Veuillez entrer un nombre valide'
          },
        }}
      />
    </BaseModal>
  );
}
