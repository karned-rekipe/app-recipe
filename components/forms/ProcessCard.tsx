/**
 * Composant ProcessCard - Gère un élément de processus dans le formulaire
 * Permet de choisir entre une recette existante ou des éléments manuels
 */

import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Alert,
    TextInput,
    FlatList
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {theme} from '../../constants/theme';
import {ProcessFormData} from './types';
import {Recipe, Ingredient, Step} from '../../types/Recipe';
import {UtensilsSection} from '../addrecipe/UtensilsSection';
import {IngredientsSection} from '../addrecipe/IngredientsSection';
import {StepsSection} from '../addrecipe/StepsSection';

interface ProcessCardProps {
    process: ProcessFormData;
    index: number;
    onUpdate: (process: ProcessFormData) => void;
    onRemove: () => void;
    onSelectRecipe: () => void;
    recipes?: Recipe[]; // Liste des recettes disponibles pour la sélection
}

export function ProcessCard({
                                process,
                                index,
                                onUpdate,
                                onRemove,
                                onSelectRecipe,
                                recipes = []
                            }: ProcessCardProps) {
    const [isManualMode, setIsManualMode] = React.useState(!process.recipe_uuid);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

    // Trouver la recette sélectionnée si recipe_uuid existe
    const selectedRecipe = process.recipe_uuid
        ? recipes.find(r => r.uuid === process.recipe_uuid)
        : null;

    // Filtrer les recettes selon le terme de recherche
    const filteredRecipes = recipes.filter(recipe =>
        recipe.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Gérer la sélection d'une recette depuis la liste déroulante
    const handleRecipeSelect = (recipe: Recipe) => {
        console.log(process);
        onUpdate({
            ...process,
            name: recipe.name,
            recipe_uuid: recipe.uuid,
            utensils: [],
            ingredients: [],
            steps: []
        });
        setIsDropdownOpen(false);
        setSearchTerm('');
        console.log(process);
    };

    // Fermer la liste déroulante
    const closeDropdown = () => {
        setIsDropdownOpen(false);
        setSearchTerm('');
    };

    const handleModeChange = (manual: boolean) => {
        if (manual !== isManualMode) {
            setIsManualMode(manual);
            // if (manual) {
            //     // Passer en mode manuel - vider recipe_uuid et conserver les éléments manuels existants
            //     onUpdate({
            //         ...process,
            //         recipe_uuid: null,
            //         name: null
            //     });
            // } else {
            //     // Passer en mode recette existante - vider les éléments manuels mais laisser recipe_uuid null
            //     // pour permettre l'affichage de la liste déroulante
            //     onUpdate({
            //         ...process,
            //         recipe_uuid: null,
            //         name: null,
            //         utensils: [],
            //         ingredients: [],
            //         steps: []
            //     });
            // }
        }
    };




    return (
        <View style={styles.card}>
            {/* Header de la carte */}
            <View style={styles.header}>
                <Text style={styles.title}>Processus {index + 1}</Text>
                <TouchableOpacity onPress={onRemove} style={styles.removeButton}>
                    <Ionicons name="trash-outline" size={20} color={theme.colors.error}/>
                </TouchableOpacity>
            </View>

            {/* Sélecteur de mode */}
            <View style={styles.modeSelector}>
                <TouchableOpacity
                    style={[styles.modeButton, !isManualMode && styles.modeButtonActive]}
                    onPress={() => handleModeChange(false)}
                >
                    <Text style={[styles.modeButtonText, !isManualMode && styles.modeButtonTextActive]}>
                        Recette existante
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.modeButton, isManualMode && styles.modeButtonActive]}
                    onPress={() => handleModeChange(true)}
                >
                    <Text style={[styles.modeButtonText, isManualMode && styles.modeButtonTextActive]}>
                        Manuel
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Contenu selon le mode */}
            {!isManualMode ? (
                <View style={styles.content}>
                    {selectedRecipe ? (
                        <View style={styles.selectedRecipe}>
                            <Text style={styles.selectedRecipeText}>
                                Recette sélectionnée: {selectedRecipe.name}
                            </Text>
                            <TouchableOpacity 
                                onPress={() => {
                                    onUpdate({
                                        ...process,
                                        name: null,
                                        recipe_uuid: null
                                    });
                                }}
                                style={styles.changeRecipeButton}
                            >
                                <Text style={styles.changeRecipeButtonText}>Changer</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={styles.recipeDropdownContainer}>
                            <View style={styles.searchContainer}>
                                <Ionicons name="search-outline" size={20} color={theme.colors.text.secondary} style={styles.searchIcon}/>
                                <TextInput
                                    style={styles.searchInput}
                                    placeholder="Rechercher une recette..."
                                    value={searchTerm}
                                    onChangeText={setSearchTerm}
                                    onFocus={() => setIsDropdownOpen(true)}
                                />
                                {isDropdownOpen && (
                                    <TouchableOpacity onPress={closeDropdown} style={styles.closeButton}>
                                        <Ionicons name="close" size={20} color={theme.colors.text.secondary}/>
                                    </TouchableOpacity>
                                )}
                            </View>
                            {isDropdownOpen && (
                                <View style={styles.dropdown}>
                                    {filteredRecipes.length > 0 ? (
                                        <FlatList
                                            data={filteredRecipes}
                                            keyExtractor={(item) => item.uuid}
                                            maxToRenderPerBatch={10}
                                            renderItem={({ item }) => (
                                                <TouchableOpacity
                                                    style={styles.recipeOption}
                                                    onPress={() => handleRecipeSelect(item)}
                                                >
                                                    <Text style={styles.recipeOptionText}>{item.name}</Text>
                                                    {item.origin_country && (
                                                        <Text style={styles.recipeOrigin}>{item.origin_country}</Text>
                                                    )}
                                                </TouchableOpacity>
                                            )}
                                        />
                                    ) : (
                                        <View style={styles.noResults}>
                                            <Text style={styles.noResultsText}>
                                                {searchTerm ? 'Aucune recette trouvée' : 'Commencez à taper pour rechercher'}
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            )}
                        </View>
                    )}
                </View>
            ) : (
                <View style={styles.content}>
                    {/* Ustensiles */}
                    <UtensilsSection 
                        utensils={process.utensils}
                        onAddUtensil={(utensil: string) => {
                            onUpdate({
                                ...process,
                                utensils: [...process.utensils, utensil]
                            });
                        }}
                        onRemoveUtensil={(index: number) => {
                            onUpdate({
                                ...process,
                                utensils: process.utensils.filter((_, i) => i !== index)
                            });
                        }}
                    />

                    {/* Ingrédients */}
                    <IngredientsSection 
                        ingredients={process.ingredients}
                        onAddIngredient={(ingredient: Omit<Ingredient, 'created_by'>) => {
                            onUpdate({
                                ...process,
                                ingredients: [...process.ingredients, ingredient]
                            });
                        }}
                        onUpdateIngredient={(ingredientIndex: number, ingredient: Omit<Ingredient, 'created_by'>) => {
                            const newIngredients = [...process.ingredients];
                            newIngredients[ingredientIndex] = ingredient;
                            onUpdate({
                                ...process,
                                ingredients: newIngredients
                            });
                        }}
                        onRemoveIngredient={(index: number) => {
                            onUpdate({
                                ...process,
                                ingredients: process.ingredients.filter((_, i) => i !== index)
                            });
                        }}
                    />

                    {/* Étapes */}
                    <StepsSection 
                        steps={process.steps}
                        onAddStep={(step: Omit<Step, 'created_by'>) => {
                            onUpdate({
                                ...process,
                                steps: [...process.steps, step]
                            });
                        }}
                        onUpdateStep={(stepIndex: number, step: Omit<Step, 'created_by'>) => {
                            const newSteps = [...process.steps];
                            newSteps[stepIndex] = step;
                            onUpdate({
                                ...process,
                                steps: newSteps
                            });
                        }}
                        onRemoveStep={(index: number) => {
                            onUpdate({
                                ...process,
                                steps: process.steps.filter((_, i) => i !== index)
                            });
                        }}
                    />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: theme.colors.background.white,
        borderRadius: 12,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.md,
        borderWidth: 1,
        borderColor: theme.colors.border,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: theme.colors.text.primary,
    },
    removeButton: {
        padding: 8,
    },
    modeSelector: {
        flexDirection: 'row',
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
        padding: 4,
        marginBottom: theme.spacing.md,
    },
    modeButton: {
        flex: 1,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 6,
        alignItems: 'center',
    },
    modeButtonActive: {
        backgroundColor: theme.colors.primary,
    },
    modeButtonText: {
        fontSize: 14,
        fontWeight: '500',
        color: theme.colors.text.secondary,
    },
    modeButtonTextActive: {
        color: theme.colors.background.white,
    },
    content: {
        minHeight: 100,
    },
    selectedRecipe: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: theme.spacing.md,
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
    },
    selectedRecipeText: {
        flex: 1,
        fontSize: 16,
        color: theme.colors.text.primary,
    },
    changeRecipeButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: theme.colors.primary,
        borderRadius: 6,
    },
    changeRecipeButtonText: {
        color: theme.colors.background.white,
        fontSize: 14,
        fontWeight: '500',
    },
    selectRecipeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing.lg,
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
        borderWidth: 2,
        borderColor: theme.colors.primary,
        borderStyle: 'dashed',
    },
    selectRecipeButtonText: {
        marginLeft: 8,
        fontSize: 16,
        color: theme.colors.primary,
        fontWeight: '500',
    },
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
    // Styles pour la liste déroulante avec recherche
    recipeDropdownContainer: {
        position: 'relative',
        zIndex: 1000,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.background.white,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginBottom: 4,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: theme.colors.text.primary,
        paddingVertical: 4,
    },
    closeButton: {
        marginLeft: 8,
        padding: 4,
    },
    dropdown: {
        backgroundColor: theme.colors.background.white,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderTopWidth: 0,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
        maxHeight: 200,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    recipeOption: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    recipeOptionText: {
        fontSize: 16,
        color: theme.colors.text.primary,
        fontWeight: '500',
    },
    recipeOrigin: {
        fontSize: 14,
        color: theme.colors.text.secondary,
        marginTop: 2,
    },
    noResults: {
        padding: 16,
        alignItems: 'center',
    },
    noResultsText: {
        fontSize: 14,
        color: theme.colors.text.secondary,
        textAlign: 'center',
    },
});