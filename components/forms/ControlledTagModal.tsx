/**
 * Modale pour ajouter un tag avec React Hook Form
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

interface TagFormData {
  value: string;
}

interface ControlledTagModalProps {
  visible: boolean;
  title: string;
  placeholder: string;
  onSave: (tag: string) => void;
  onCancel: () => void;
}

export function ControlledTagModal({
  visible,
  title,
  placeholder,
  onSave,
  onCancel,
}: ControlledTagModalProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<TagFormData>({
    mode: 'onChange',
    defaultValues: {
      value: '',
    },
  });

  const onSubmit = (data: TagFormData) => {
    onSave(data.value.trim());
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
            <Text style={styles.title}>{title}</Text>
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
    maxHeight: '50%',
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
