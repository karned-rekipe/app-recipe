/**
 * Modale pour ajouter/modifier un tag (attribut ou ustensile) avec React Hook Form
 * Utilise la composition avec BaseModal et useModalForm
 */

import React from 'react';
import { theme } from '../../constants/theme';
import { ControlledInput } from './ControlledInput';
import { BaseModal } from './BaseModal';
import { useModalForm } from './useModalForm';

interface TagFormData {
  value: string;
}

interface ModernTagModalProps {
  visible: boolean;
  title: string;
  placeholder: string;
  onSave: (tag: string) => void;
  onCancel: () => void;
  initialData?: string;
  mode?: 'add' | 'edit';
}

export function ModernTagModal({
  visible,
  title,
  placeholder,
  onSave,
  onCancel,
  initialData,
  mode = 'add',
}: ModernTagModalProps) {
  const {
    control,
    errors,
    isValid,
    onSubmit,
    handleCancel,
  } = useModalForm<TagFormData>({
    defaultValues: {
      value: initialData || '',
    },
    onSave: (data) => {
      onSave(data.value.trim());
    },
    onCancel,
  });

  return (
    <BaseModal
      visible={visible}
      title={title}
      onCancel={handleCancel}
      onSave={onSubmit}
      isValid={isValid}
      saveButtonText={mode === 'edit' ? 'Modifier' : 'Ajouter'}
    >
      <ControlledInput
        name="value"
        control={control}
        label="Valeur"
        placeholder={placeholder}
        rules={{ 
          required: 'Ce champ est requis',
          minLength: { value: 2, message: 'Minimum 2 caractères' }
        }}
        required
      />
    </BaseModal>
  );
}
