/**
 * Modale pour ajouter/modifier un ingrédient avec React Hook Form
 * Utilise la composition avec BaseModal et useModalForm
 */

import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { theme } from '../../constants/theme';
import { ControlledInput } from './ControlledInput';
import { Ingredient } from '../../types/Recipe';
import { BaseModal } from './BaseModal';
import { useModalForm } from './useModalForm';

interface IngredientFormData {
  name: string;
  quantity: number;
  unit: string;
}

interface ModernIngredientModalProps {
  visible: boolean;
  onSave: (ingredient: Omit<Ingredient, 'created_by'>) => void;
  onCancel: () => void;
  initialData?: Omit<Ingredient, 'created_by'>;
  mode?: 'add' | 'edit';
}

export function ModernIngredientModal({
  visible,
  onSave,
  onCancel,
  initialData,
  mode = 'add',
}: ModernIngredientModalProps) {
  const {
    control,
    errors,
    isValid,
    onSubmit,
    handleCancel,
    reset,
  } = useModalForm<IngredientFormData>({
    defaultValues: {
      name: initialData?.name || '',
      quantity: initialData?.quantity || 0,
      unit: initialData?.unit || '',
    },
    onSave: (data) => {
      onSave({
        name: data.name,
        quantity: data.quantity,
        unit: data.unit,
      });
    },
    onCancel,
  });

  // Reset le formulaire avec les bonnes valeurs quand la modale s'ouvre
  useEffect(() => {
    if (visible) {
      if (mode === 'edit' && initialData) {
        reset({
          name: initialData.name,
          quantity: initialData.quantity,
          unit: initialData.unit,
        });
      } else if (mode === 'add') {
        reset({
          name: '',
          quantity: 0,
          unit: '',
        });
      }
    }
  }, [visible, mode, initialData, reset]);

  return (
    <BaseModal
      visible={visible}
      title={mode === 'edit' ? 'Modifier l\'ingrédient' : 'Ajouter un ingrédient'}
      onCancel={handleCancel}
      onSave={onSubmit}
      isValid={isValid}
      saveButtonText={mode === 'edit' ? 'Modifier' : 'Ajouter'}
    >
      <ControlledInput
        name="name"
        control={control}
        label="Nom de l'ingrédient"
        placeholder="Ex: Farine, Œufs, Beurre..."
        rules={{ required: 'Le nom est requis' }}
        required
      />

      <View style={styles.row}>
        <View style={styles.quantityContainer}>
          <ControlledInput
            name="quantity"
            control={control}
            label="Quantité"
            placeholder="250"
            keyboardType="numeric"
            rules={{
              required: 'La quantité est requise',
              min: { value: 0, message: 'La quantité doit être positive' },
            }}
            required
          />
        </View>
        <View style={styles.unitContainer}>
          <ControlledInput
            name="unit"
            control={control}
            label="Unité"
            placeholder="g, ml, pièce..."
            rules={{ required: 'L\'unité est requise' }}
            required
          />
        </View>
      </View>
    </BaseModal>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  quantityContainer: {
    flex: 1,
  },
  unitContainer: {
    flex: 1,
  },
});
