/**
 * Composant pour gérer une étape dans le formulaire
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { FormInput } from './FormInput';
import { theme } from '../../constants/theme';
import { Step } from '../../types/Recipe';

interface StepFormProps {
  step?: Partial<Step>;
  stepNumber: number;
  onSave: (step: Omit<Step, 'created_by'>) => void;
  onCancel: () => void;
  visible: boolean;
}

export function StepForm({ step, stepNumber, onSave, onCancel, visible }: StepFormProps) {
  const [description, setDescription] = useState(step?.description || '');
  const [duration, setDuration] = useState(step?.duration || '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!description.trim()) {
      newErrors.description = 'La description de l\'étape est requise';
    }
    
    if (!duration.trim()) {
      newErrors.duration = 'La durée est requise';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave({
        step_number: stepNumber,
        description: description.trim(),
        duration: duration.trim(),
      });
      // Reset form
      setDescription('');
      setDuration('');
      setErrors({});
    }
  };

  const handleCancel = () => {
    setDescription(step?.description || '');
    setDuration(step?.duration || '');
    setErrors({});
    onCancel();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleCancel}>
            <Text style={styles.cancelButton}>Annuler</Text>
          </TouchableOpacity>
          <Text style={styles.title}>
            {step ? `Modifier l'étape ${stepNumber}` : `Ajouter une étape`}
          </Text>
          <TouchableOpacity onPress={handleSave}>
            <Text style={styles.saveButton}>Sauvegarder</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.form}>
          <FormInput
            label="Description de l'étape"
            value={description}
            onChangeText={setDescription}
            placeholder="Décrivez cette étape de la recette..."
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            error={errors.description}
            required
          />
          
          <FormInput
            label="Durée estimée"
            value={duration}
            onChangeText={setDuration}
            placeholder="Ex: 10 min, 2h, 30 sec..."
            error={errors.duration}
            required
          />
        </View>
      </View>
    </Modal>
  );
}

interface StepItemProps {
  step: Omit<Step, 'created_by'>;
  index: number;
}

export function StepItem({ step, index }: StepItemProps) {
  return (
    <View style={styles.itemContainer}>
      <View style={styles.stepNumber}>
        <Text style={styles.stepNumberText}>{index + 1}</Text>
      </View>
      <View style={styles.itemDetails}>
        <Text style={styles.itemDescription} numberOfLines={3}>
          {step.description}
        </Text>
        <Text style={styles.itemDuration}>⏱️ {step.duration}</Text>
      </View>
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
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
    marginTop: 2,
  },
  stepNumberText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.white,
  },
  itemDetails: {
    flex: 1,
  },
  itemDescription: {
    fontSize: 16,
    color: theme.colors.text.primary,
    lineHeight: 22,
  },
  itemDuration: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
    fontWeight: '500',
  },
});
