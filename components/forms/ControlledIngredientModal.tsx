/**
 * Modale pour ajouter un ingrédient avec React Hook Form
 */

import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useForm } from 'react-hook-form';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';
import { ControlledInput } from './ControlledInput';
import { Ingredient } from '../../types/Recipe';

interface IngredientFormData {
  name: string;
  quantity: number;
  unit: string;
}

interface ControlledIngredientModalProps {
  visible: boolean;
  onSave: (ingredient: Omit<Ingredient, 'created_by'>) => void;
  onCancel: () => void;
}

export function ControlledIngredientModal({
  visible,
  onSave,
  onCancel,
}: ControlledIngredientModalProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<IngredientFormData>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      quantity: 0,
      unit: '',
    },
  });

  const onSubmit = (data: IngredientFormData) => {
    onSave({
      name: data.name,
      quantity: data.quantity,
      unit: data.unit,
    });
    reset();
  };

  const handleCancel = () => {
    reset();
    onCancel();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={handleCancel}>
              <Ionicons name="close" size={24} color={theme.colors.text.secondary} />
            </TouchableOpacity>
            <Text style={styles.title}>Ajouter un ingrédient</Text>
            <TouchableOpacity
              onPress={handleSubmit(onSubmit)}
              disabled={!isValid}
              style={[styles.saveButton, !isValid && styles.disabledButton]}
            >
              <Text style={[styles.saveButtonText, !isValid && styles.disabledText]}>
                Ajouter
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.form}>
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
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: theme.colors.background.overlay,
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: theme.colors.background.white,
    borderTopLeftRadius: theme.borderRadius.md,
    borderTopRightRadius: theme.borderRadius.md,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  saveButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.sm,
  },
  saveButtonText: {
    color: theme.colors.white,
    fontWeight: '500',
  },
  disabledButton: {
    backgroundColor: theme.colors.text.secondary,
  },
  disabledText: {
    color: theme.colors.text.placeholder,
  },
  form: {
    padding: theme.spacing.md,
  },
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
