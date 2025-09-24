/**
 * Composant pour gérer un ingrédient dans le formulaire
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { FormInput } from './FormInput';
import { theme } from '../../constants/theme';
import { Ingredient } from '../../types/Recipe';

interface IngredientFormProps {
  ingredient?: Partial<Ingredient>;
  onSave: (ingredient: Omit<Ingredient, 'created_by'>) => void;
  onCancel: () => void;
  visible: boolean;
}

export function IngredientForm({ ingredient, onSave, onCancel, visible }: IngredientFormProps) {
  const [name, setName] = useState(ingredient?.name || '');
  const [quantity, setQuantity] = useState(ingredient?.quantity?.toString() || '');
  const [unit, setUnit] = useState(ingredient?.unit || '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) {
      newErrors.name = 'Le nom de l\'ingrédient est requis';
    }
    
    if (!quantity.trim()) {
      newErrors.quantity = 'La quantité est requise';
    } else if (isNaN(Number(quantity)) || Number(quantity) <= 0) {
      newErrors.quantity = 'La quantité doit être un nombre positif';
    }
    
    if (!unit.trim()) {
      newErrors.unit = 'L\'unité est requise';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave({
        name: name.trim(),
        quantity: Number(quantity),
        unit: unit.trim(),
      });
      // Reset form
      setName('');
      setQuantity('');
      setUnit('');
      setErrors({});
    }
  };

  const handleCancel = () => {
    setName(ingredient?.name || '');
    setQuantity(ingredient?.quantity?.toString() || '');
    setUnit(ingredient?.unit || '');
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
            {ingredient ? 'Modifier l\'ingrédient' : 'Ajouter un ingrédient'}
          </Text>
          <TouchableOpacity onPress={handleSave}>
            <Text style={styles.saveButton}>Sauvegarder</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.form}>
          <FormInput
            label="Nom de l'ingrédient"
            value={name}
            onChangeText={setName}
            placeholder="Ex: Farine, Tomates, Œufs..."
            error={errors.name}
            required
          />
          
          <View style={styles.row}>
            <View style={styles.quantityContainer}>
              <FormInput
                label="Quantité"
                value={quantity}
                onChangeText={setQuantity}
                placeholder="Ex: 250"
                keyboardType="numeric"
                error={errors.quantity}
                required
              />
            </View>
            <View style={styles.unitContainer}>
              <FormInput
                label="Unité"
                value={unit}
                onChangeText={setUnit}
                placeholder="Ex: g, ml, pcs"
                error={errors.unit}
                required
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

interface IngredientItemProps {
  ingredient: Omit<Ingredient, 'created_by'>;
  index: number;
}

export function IngredientItem({ ingredient, index }: IngredientItemProps) {
  return (
    <View style={styles.itemContainer}>
      <Text style={styles.itemNumber}>{index + 1}.</Text>
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{ingredient.name}</Text>
        <Text style={styles.itemQuantity}>
          {ingredient.quantity} {ingredient.unit}
        </Text>
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
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.secondary,
    marginRight: theme.spacing.sm,
    minWidth: 24,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  itemQuantity: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    marginTop: 2,
  },
});
