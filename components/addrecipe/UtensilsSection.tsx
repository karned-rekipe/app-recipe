/**
 * Composant UtensilsSection - Gère la section des ustensiles dans un processus
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
import {ModernUtensilModal} from '../forms/ModernUtensilModal';

interface UtensilsSectionProps {
    utensils: string[];
    onAddUtensil: (utensil: string) => void;
    onRemoveUtensil: (index: number) => void;
}

export function UtensilsSection({
    utensils,
    onAddUtensil,
    onRemoveUtensil
}: UtensilsSectionProps) {
    const [isModalVisible, setIsModalVisible] = React.useState(false);

    const handleAddUtensil = () => {
        setIsModalVisible(true);
    };

    const handleModalSave = (utensil: string) => {
        onAddUtensil(utensil);
        setIsModalVisible(false);
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Ustensiles</Text>
                <TouchableOpacity onPress={handleAddUtensil} style={styles.addButton}>
                    <Ionicons name="add" size={20} color={theme.colors.primary}/>
                </TouchableOpacity>
            </View>
            {utensils.map((utensil, uIndex) => (
                <React.Fragment key={uIndex}>
                    <View style={styles.listItem}>
                        <Text style={styles.listItemText}>{utensil}</Text>
                        <TouchableOpacity onPress={() => onRemoveUtensil(uIndex)}>
                            <Ionicons name="close" size={16} color={theme.colors.error}/>
                        </TouchableOpacity>
                    </View>
                </React.Fragment>
            ))}
            
            <ModernUtensilModal
                visible={isModalVisible}
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
});