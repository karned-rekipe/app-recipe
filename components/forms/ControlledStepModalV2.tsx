/**
 * Modale pour ajouter/modifier une étape avec React Hook Form
 * Utilise la composition avec BaseModal et useModalForm
 * Respecte le principe SRP - responsable uniquement de la gestion des étapes
 */

import React, {useEffect, useMemo} from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {theme} from '../../constants/theme';
import {ControlledInput} from './ControlledInput';
import {ControlledDurationWithUnitSelector} from './ControlledDurationWithUnitSelector';
import {Step} from '../../types/Recipe';
import {BaseModal} from './BaseModal';
import {useModalForm} from './useModalForm';
import {formatDurationFromMinutes} from '../DurationWithUnitSelector';

interface StepFormData {
    title: string;
    description: string;
    duration: number;
    cooking_time: number;
    rest_time: number;
    preparation_time: number;
}

interface ControlledStepModalV2Props {
    visible: boolean;
    stepNumber: number;
    onSave: (step: Omit<Step, 'created_by'>) => void;
    onCancel: () => void;
    onDelete?: () => void;
    initialData?: Omit<Step, 'created_by'>;
    mode?: 'add' | 'edit';
}

export function ControlledStepModalV2({
                                          visible,
                                          stepNumber,
                                          onSave,
                                          onCancel,
                                          onDelete,
                                          initialData,
                                          mode = 'add',
                                      }: ControlledStepModalV2Props) {
    const defaultValues = useMemo(() => ({
        title: initialData?.title || '',
        description: initialData?.description || '',
        cooking_time: initialData?.cooking_time || 0,
        rest_time: initialData?.rest_time || 0,
        preparation_time: initialData?.preparation_time || 0,
    }), [
        initialData?.title,
        initialData?.description,
        initialData?.cooking_time,
        initialData?.rest_time,
        initialData?.preparation_time,
    ]);

    const {
        control,
        errors,
        isValid,
        onSubmit,
        handleCancel,
        watch,
        reset,
    } = useModalForm<StepFormData>({
        defaultValues,
        onSave: (data) => {
            onSave({
                step_number: stepNumber,
                title: data.title,
                description: data.description,
                duration: data.duration,
                cooking_time: data.cooking_time,
                rest_time: data.rest_time,
                preparation_time: data.preparation_time,
            });
        },
        onCancel,
    });

    // Réinitialiser le formulaire quand initialData change (pour la modification)
    useEffect(() => {
        if (visible && initialData) {
            reset({
                title: initialData.title || '',
                description: initialData.description || '',
                cooking_time: initialData.cooking_time || 0,
                rest_time: initialData.rest_time || 0,
                preparation_time: initialData.preparation_time || 0,
            });
        } else if (visible && !initialData) {
            reset({
                title: '',
                description: '',
                cooking_time: 0,
                rest_time: 0,
                preparation_time: 0,
            });
        }
    }, [visible, initialData, reset]);

    // Surveiller les changements de durée pour calculer la durée totale
    const cookingDuration = watch('cooking_time') || 0;
    const restDuration = watch('rest_time') || 0;
    const preparationDuration = watch('preparation_time') || 0;
    const totalDuration = cookingDuration + restDuration + preparationDuration;

    return (
        <BaseModal
            visible={visible}
            title={mode === 'edit' ? `Modifier l'étape ${stepNumber}` : `Étape ${stepNumber}`}
            onCancel={handleCancel}
            onSave={onSubmit}
            isValid={isValid}
            saveButtonText={mode === 'edit' ? 'Enregistrer' : 'Créer'}
        >
            <ControlledInput
                name="title"
                control={control}
                label=""
                placeholder="Etape (Ex: Préparation de la pâte, Cuisson...)"
                rules={{required: 'Le titre est requis'}}
                required
            />

            <ControlledInput
                name="description"
                control={control}
                label=""
                placeholder="Description: Décrivez cette étape de préparation en détail..."
                multiline
                numberOfLines={4}
                textAlignVertical="top"
            />

            <View style={styles.durationSection}>
                <View style={styles.durationList}>
                    <ControlledDurationWithUnitSelector
                        name="preparation_time"
                        control={control}
                        label="Préparation"
                        defaultUnit="minutes"
                        size="small"
                    />

                    <ControlledDurationWithUnitSelector
                        name="cooking_time"
                        control={control}
                        label="Cuisson"
                        defaultUnit="minutes"
                        size="small"
                    />

                    <ControlledDurationWithUnitSelector
                        name="rest_time"
                        control={control}
                        label="Repos"
                        defaultUnit="hours"
                        size="small"
                    />
                </View>

                {totalDuration > 0 && (
                    <View style={styles.totalDuration}>
                        <Text style={styles.totalDurationLabel}>Durée totale</Text>
                        <Text style={styles.totalDurationValue}>
                            {formatDurationFromMinutes(totalDuration)}
                        </Text>
                    </View>
                )}
            </View>

            {mode === 'edit' && onDelete && (
                <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
                    <Ionicons name="trash-outline" size={20} color={theme.colors.error}/>
                    <Text style={styles.deleteButtonText}>Supprimer cette étape</Text>
                </TouchableOpacity>
            )}
        </BaseModal>
    );
}

const styles = StyleSheet.create({
    durationSection: {
        marginTop: theme.spacing.sm,
    },
    durationList: {
        gap: theme.spacing.xs,
    },
    totalDuration: {
        backgroundColor: theme.colors.background.overlayLight,
        padding: theme.spacing.sm,
        borderRadius: theme.borderRadius.sm,
        marginTop: theme.spacing.sm,
        alignItems: 'center',
    },
    totalDurationLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: theme.colors.text.secondary,
        marginBottom: theme.spacing.xs,
    },
    totalDurationValue: {
        fontSize: 18,
        fontWeight: '700',
        color: theme.colors.primary,
    },
    deleteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: theme.spacing.lg,
        padding: theme.spacing.md,
        backgroundColor: theme.colors.background.overlayLight,
        borderRadius: theme.borderRadius.sm,
        borderWidth: 1,
        borderColor: theme.colors.error,
    },
    deleteButtonText: {
        marginLeft: theme.spacing.sm,
        fontSize: 16,
        color: theme.colors.error,
        fontWeight: '500',
    },
});
