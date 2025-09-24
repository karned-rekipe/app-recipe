/**
 * Modale pour ajouter/modifier un ustensile avec React Hook Form
 * Utilise la composition avec BaseModal et useModalForm
 */

import React, { useMemo } from 'react';
import { theme } from '../../constants/theme';
import { ControlledInput } from './ControlledInput';
import { BaseModal } from './BaseModal';
import { useModalForm } from './useModalForm';

interface UtensilFormData {
  name: string;
}

interface ModernUtensilModalProps {
  visible: boolean;
  onSave: (utensil: string) => void;
  onCancel: () => void;
  onDelete?: () => void;
  initialData?: string;
  mode?: 'add' | 'edit';
}

export function ModernUtensilModal({
  visible,
  onSave,
  onCancel,
  onDelete,
  initialData,
  mode = 'add',
}: ModernUtensilModalProps) {
  const defaultValues = useMemo(() => ({
    name: initialData || '',
  }), [initialData]);

  const {
    control,
    errors,
    isValid,
    onSubmit,
    handleCancel,
  } = useModalForm<UtensilFormData>({
    defaultValues,
    onSave: (data) => {
      onSave(data.name.trim());
    },
    onCancel,
  });

  return (
    <BaseModal
      visible={visible}
      title={mode === 'edit' ? 'Modifier l\'ustensile' : 'Ajouter un ustensile'}
      onCancel={handleCancel}
      onSave={onSubmit}
      onDelete={mode === 'edit' ? onDelete : undefined}
      isValid={isValid}
      saveButtonText={mode === 'edit' ? 'Modifier' : 'Ajouter'}
    >
      <ControlledInput
        name="name"
        control={control}
        label="Nom de l'ustensile"
        placeholder="Ex: Fouet, Casserole, Spatule..."
        rules={{ 
          required: 'Le nom de l\'ustensile est requis',
          minLength: { value: 2, message: 'Minimum 2 caractères' }
        }}
        required
      />
    </BaseModal>
  );
}