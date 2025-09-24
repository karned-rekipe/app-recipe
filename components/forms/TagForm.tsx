/**
 * Composant pour gérer des tags simples (ustensiles, attributs)
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { FormInput } from './FormInput';
import { theme } from '../../constants/theme';

interface TagFormProps {
  tag?: string;
  onSave: (tag: string) => void;
  onCancel: () => void;
  visible: boolean;
  title: string;
  placeholder: string;
}

export function TagForm({ tag, onSave, onCancel, visible, title, placeholder }: TagFormProps) {
  const [value, setValue] = useState(tag || '');
  const [error, setError] = useState('');

  const validateForm = () => {
    if (!value.trim()) {
      setError('Ce champ est requis');
      return false;
    }
    setError('');
    return true;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(value.trim());
      setValue('');
      setError('');
    }
  };

  const handleCancel = () => {
    setValue(tag || '');
    setError('');
    onCancel();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleCancel}>
            <Text style={styles.cancelButton}>Annuler</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{title}</Text>
          <TouchableOpacity onPress={handleSave}>
            <Text style={styles.saveButton}>Sauvegarder</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.form}>
          <FormInput
            label="Nom"
            value={value}
            onChangeText={setValue}
            placeholder={placeholder}
            error={error}
            required
          />
        </View>
      </View>
    </Modal>
  );
}

interface TagItemProps {
  tag: string;
  index: number;
}

export function TagItem({ tag, index }: TagItemProps) {
  return (
    <View style={styles.tagContainer}>
      <Text style={styles.tagText}>{tag}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.white,
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
  cancelButton: {
    fontSize: 16,
    color: theme.colors.text.secondary,
  },
  saveButton: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  form: {
    flex: 1,
    padding: theme.spacing.md,
  },
  tagContainer: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    alignSelf: 'flex-start',
  },
  tagText: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.white,
  },
});
