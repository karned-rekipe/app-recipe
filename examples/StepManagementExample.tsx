/**
 * Exemple d'utilisation des nouveaux composants d'étapes
 * Démonstration des bonnes pratiques et du principe SRP
 */
import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useForm, useFieldArray } from 'react-hook-form';
import { 
  StepListManager, 
  ControlledStepModalV2, 
  useModalState
} from '../components/forms';
import { NumberSelector } from '../components';
import { theme } from '../constants/theme';
import { Step } from '../types/Recipe';

interface ExampleFormData {
  name: string;
  number_of_persons: number;
  quantity: number;
  steps: Omit<Step, 'created_by'>[];
}

export function StepManagementExample() {
  const { control, handleSubmit, watch } = useForm<ExampleFormData>({
    defaultValues: {
      name: '',
      number_of_persons: 4,
      quantity: 12,
      steps: [],
    },
  });

  const { fields, append, update, remove } = useFieldArray({
    control,
    name: 'steps',
  });

  const {
    isVisible: stepModalVisible,
    data: editingStep,
    index: editingIndex,
    openAddModal: openStepAddModal,
    openEditModal: openStepEditModal,
    closeModal: closeStepModal,
    isEditMode,
  } = useModalState<Omit<Step, 'created_by'>>();

  const [persons, setPersons] = useState(4);
  const [quantity, setQuantity] = useState(12);

  const handleAddStep = () => {
    openStepAddModal();
  };

  const handleEditStep = (step: Omit<Step, 'created_by'>, index: number) => {
    openStepEditModal(step, index);
  };

  const handleSaveStep = (stepData: Omit<Step, 'created_by'>) => {
    if (isEditMode && editingIndex !== undefined) {
      // Mode édition
      update(editingIndex, stepData);
    } else {
      // Mode ajout
      const newStep = {
        ...stepData,
        step_number: fields.length + 1,
      };
      append(newStep);
    }
    closeStepModal();
  };

  const handleRemoveStep = (index: number) => {
    remove(index);
    // Renuméroter les étapes restantes
    fields.forEach((_, i) => {
      if (i > index) {
        update(i, { ...fields[i], step_number: i });
      }
    });
  };

  const getNextStepNumber = () => {
    return isEditMode ? editingStep?.step_number || 1 : fields.length + 1;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <View style={styles.selectors}>
          {/* Sélecteur de nombre de personnes - taille plus grande */}
          <View style={styles.personsSelector}>
            <NumberSelector
              value={persons}
              onValueChange={setPersons}
              minValue={1}
              maxValue={20}
              label="personne(s)"
              size="large"
            />
          </View>

          {/* Sélecteur de quantité - taille plus petite */}
          <View style={styles.quantitySelector}>
            <NumberSelector
              value={quantity}
              onValueChange={setQuantity}
              minValue={1}
              maxValue={100}
              label="part(s)"
              size="medium"
            />
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <StepListManager
          fields={fields}
          onAddItem={handleAddStep}
          onEditItem={handleEditStep}
          onRemoveItem={handleRemoveStep}
        />
      </View>

      <ControlledStepModalV2
        visible={stepModalVisible}
        stepNumber={getNextStepNumber()}
        onSave={handleSaveStep}
        onCancel={closeStepModal}
        initialData={editingStep}
        mode={isEditMode ? 'edit' : 'add'}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.white,
  },
  section: {
    padding: theme.spacing.md,
  },
  selectors: {
    backgroundColor: theme.colors.background.white,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  personsSelector: {
    marginBottom: theme.spacing.xl,
  },
  quantitySelector: {
    marginBottom: theme.spacing.md,
  },
});
