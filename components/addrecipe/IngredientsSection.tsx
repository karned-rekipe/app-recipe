/**
 * Composant IngredientsSection - Gère la section des ingrédients dans un processus
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
import {Ingredient} from '../../types/Recipe';
import {ModernIngredientModal} from '../forms/ModernIngredientModal';

interface IngredientsSectionProps {
    ingredients: Omit<Ingredient, 'created_by'>[];
    onAddIngredient: (ingredient: Omit<Ingredient, 'created_by'>) => void;
    onUpdateIngredient: (ingredientIndex: number, ingredient: Omit<Ingredient, 'created_by'>) => void;
    onRemoveIngredient: (index: number) => void;
}

export function IngredientsSection({
    ingredients,
    onAddIngredient,
    onUpdateIngredient,
    onRemoveIngredient
}: IngredientsSectionProps) {
    const [isModalVisible, setIsModalVisible] = React.useState(false);

    const handleAddIngredient = () => {
        setIsModalVisible(true);
    };

    const handleModalSave = (ingredient: Omit<Ingredient, 'created_by'>) => {
        onAddIngredient(ingredient);
        setIsModalVisible(false);
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Ingrédients</Text>
                <TouchableOpacity onPress={handleAddIngredient} style={styles.addButton}>
                    <Ionicons name="add" size={20} color={theme.colors.primary}/>
                </TouchableOpacity>
            </View>
            {ingredients.map((ingredient, iIndex) => (
                <React.Fragment key={iIndex}>
                    <View style={styles.listItem}>
                        <Text style={styles.listItemText}>
                            {ingredient.name} - {ingredient.quantity} {ingredient.unit}
                        </Text>
                        <TouchableOpacity onPress={() => onRemoveIngredient(iIndex)}>
                            <Ionicons name="close" size={16} color={theme.colors.error}/>
                        </TouchableOpacity>
                    </View>
                </React.Fragment>
            ))}
            
            <ModernIngredientModal
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