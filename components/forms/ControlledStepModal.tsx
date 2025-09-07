/**
 * Modale pour ajouter une étape avec React Hook Form
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
import { Step } from '../../types/Recipe';

interface StepFormData {
  description: string;
  duration: string;
}

interface ControlledStepModalProps {
  visible: boolean;
  stepNumber: number;
  onSave: (step: Omit<Step, 'created_by'>) => void;
  onCancel: () => void;
}

export function ControlledStepModal({
  visible,
  stepNumber,
  onSave,
  onCancel,
}: ControlledStepModalProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<StepFormData>({
    mode: 'onChange',
    defaultValues: {
      description: '',
      duration: '',
    },
  });

  const onSubmit = (data: StepFormData) => {
    onSave({
      step_number: stepNumber,
      description: data.description,
      duration: data.duration,
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
            <Text style={styles.title}>Étape {stepNumber}</Text>
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
});
