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
    
    const addUtensil = () => {
        const utensil = prompt("Nom de l'ustensile:");
        if (utensil && utensil.trim()) {
            onAddUtensil(utensil.trim());
        }
    };

    return (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Ustensiles</Text>
                <TouchableOpacity onPress={addUtensil} style={styles.addButton}>
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