/**
 * Composant StepsSection - Gère la section des étapes dans un processus
 * Extrait du ProcessCard pour une meilleure séparation des responsabilités
 */

import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {theme} from '../../constants/theme';
import {Step} from '../../types/Recipe';
import {ModernStepModal} from '../forms/ModernStepModal';

interface StepsSectionProps {
    steps: Omit<Step, 'created_by'>[];
    onAddStep: (step: Omit<Step, 'created_by'>) => void;
    onUpdateStep: (stepIndex: number, step: Omit<Step, 'created_by'>) => void;
    onRemoveStep: (index: number) => void;
}

export function StepsSection({
    steps,
    onAddStep,
    onUpdateStep,
    onRemoveStep
}: StepsSectionProps) {
    const [isModalVisible, setIsModalVisible] = React.useState(false);

    const handleAddStep = () => {
        setIsModalVisible(true);
    };

    const handleModalSave = (step: Omit<Step, 'created_by'>) => {
        onAddStep(step);
        setIsModalVisible(false);
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Étapes</Text>
                <TouchableOpacity onPress={handleAddStep} style={styles.addButton}>
                    <Ionicons name="add" size={20} color={theme.colors.primary}/>
                </TouchableOpacity>
            </View>
            {steps.map((step, sIndex) => (
                <React.Fragment key={sIndex}>
                    <View style={styles.listItem}>
                        <Text style={styles.listItemText}>
                            {step.step_number}. {step.title || step.description}
                        </Text>
                        <TouchableOpacity onPress={() => onRemoveStep(sIndex)}>
                            <Ionicons name="close" size={16} color={theme.colors.error}/>
                        </TouchableOpacity>
                    </View>
                </React.Fragment>
            ))}
            
            <ModernStepModal
                visible={isModalVisible}
                stepNumber={steps.length + 1}
                mode="add"
                onSave={handleModalSave}
                onCancel={handleModalCancel}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    section: {
        marginBottom: theme.spacing.md,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.sm,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.colors.text.primary,
    },
    addButton: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    listItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: '#F5F5F5',
        borderRadius: 6,
        marginBottom: 4,
    },
    listItemText: {
        flex: 1,
        fontSize: 14,
        color: theme.colors.text.primary,
    },
    timingText: {
        fontSize: 12,
        color: theme.colors.text.secondary,
        fontStyle: 'italic',
    },
});