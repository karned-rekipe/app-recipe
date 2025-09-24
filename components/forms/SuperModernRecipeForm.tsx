/**
 * Formulaire de recette moderne et simplifié
 * Utilise les principes SRP et la composition pour une meilleure maintenabilité
 */

import React from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Alert,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import {useForm, useFieldArray, useWatch, SubmitHandler} from 'react-hook-form';
import {Ionicons} from '@expo/vector-icons';
import {theme} from '../../constants/theme';
import {Recipe} from '../../types/Recipe';
import {sampleRecipes} from '../../data/newSampleRecipes';

import {SimpleTagListManager} from './SimpleTagListManager';
import {ModernTagModal} from './ModernTagModal';
import {TagDisplay} from './DisplayComponents';
import {useModalState} from './useModalState';
import {ProcessCard} from './ProcessCard';
import {RecipeSelectionModal} from './RecipeSelectionModal';

// Imports des composants existants
import {
    ControlledInput,
    ControlledCountrySelect,
    ControlledPriceSelector,
    ControlledDifficultySelector,
    ControlledNumberSelector,
    RecipeFormData,
    ProcessFormData,
    PriceValue,
    DifficultyValue
} from './index';

interface SuperModernRecipeFormProps {
    initialData?: Partial<Recipe>;
    onSave: (data: RecipeFormData) => void;
    onCancel: () => void;
    isLoading?: boolean;
}

export function SuperModernRecipeForm({initialData, onSave, onCancel, isLoading = false}: SuperModernRecipeFormProps) {
    // États des modales avec le nouveau hook
    const attributeModal = useModalState<string>();

    // Extraction des données du processus si initialData existe
    const extractedProcessData = initialData?.process ? initialData.process.map(proc => ({
        name: proc.name,
        recipe_uuid: proc.recipe_uuid,
        utensils: proc.utensils || [],
        ingredients: (proc.ingredients || []).map(ing => ({
            name: ing.name,
            quantity: ing.quantity,
            unit: ing.unit
        })),
        steps: (proc.steps || []).map(step => ({
            step_number: step.step_number,
            title: step.title || '',
            description: step.description,
            total_duration: step.total_duration || 0,
            cooking_duration: step.cooking_duration || 0,
            rest_duration: step.rest_duration || 0,
            preparation_duration: step.preparation_duration || 0,
        }))
    })) : [{
        name: null,
        recipe_uuid: null,
        utensils: [],
        ingredients: [],
        steps: []
    }];

    // Configuration du formulaire avec React Hook Form
    const {
        control,
        handleSubmit,
        formState: {errors, isValid, isDirty},
        setValue,
    } = useForm<RecipeFormData>({
        mode: 'onChange',
        defaultValues: {
            name: initialData?.name || '',
            description: initialData?.description || '',
            price: (initialData?.price as PriceValue) || 1,
            difficulty: (initialData?.difficulty as DifficultyValue) || 1,
            quantity: initialData?.quantity || 1,
            number_of_persons: initialData?.number_of_persons || 4,
            origin_country: initialData?.origin_country || '',
            attributes: initialData?.attributes || [],
            process: extractedProcessData,
            thumbnail_url: initialData?.thumbnail_url || '',
            large_image_url: initialData?.large_image_url || '',
            source_reference: initialData?.source_reference || '',
        },
    });

    // Gestion des processus avec useFieldArray
    const processArray = useFieldArray({
        control,
        name: 'process'
    });

    // État pour le modal de sélection de recette
    const [recipeSelectionModal, setRecipeSelectionModal] = React.useState({
        visible: false,
        processIndex: -1
    });

    // Gestionnaires pour les processus
    const handleAddProcess = () => {
        const newProcess: ProcessFormData = {
            name: null,
            recipe_uuid: null,
            utensils: [],
            ingredients: [],
            steps: []
        };
        processArray.append(newProcess);
    };

    const handleUpdateProcess = (processIndex: number, updatedProcess: ProcessFormData) => {
        processArray.update(processIndex, updatedProcess);
    };

    const handleRemoveProcess = (processIndex: number) => {
        processArray.remove(processIndex);
    };

    const handleSelectRecipe = (processIndex: number) => {
        setRecipeSelectionModal({
            visible: true,
            processIndex
        });
    };

    const handleRecipeSelected = (recipe: Recipe) => {
        if (recipeSelectionModal.processIndex >= 0) {
            const updatedProcess: ProcessFormData = {
                name: recipe.name,
                recipe_uuid: recipe.uuid,
                utensils: [],
                ingredients: [],
                steps: []
            };
            processArray.update(recipeSelectionModal.processIndex, updatedProcess);
        }
        setRecipeSelectionModal({visible: false, processIndex: -1});
    };

    const handleRecipeSelectionCancel = () => {
        setRecipeSelectionModal({visible: false, processIndex: -1});
    };

    const onSubmit: SubmitHandler<RecipeFormData> = (data) => {
        onSave(data);
    };

    const handleCancel = () => {
        if (isDirty) {
            Alert.alert(
                "Confirmer l'annulation",
                "Toutes les modifications seront perdues. Êtes-vous sûr ?",
                [
                    {text: "Continuer l'édition", style: "cancel"},
                    {text: "Annuler", style: "destructive", onPress: onCancel}
                ]
            );
        } else {
            onCancel();
        }
    };


    // Utilisation de useWatch pour obtenir les valeurs actuelles
    const currentAttributes = useWatch({control, name: 'attributes'}) || [];

    // Gestionnaires pour les attributs
    const handleAddAttribute = (attribute: string) => {
        setValue('attributes', [...currentAttributes, attribute]);
        attributeModal.closeModal();
    };

    const handleEditAttribute = (attribute: string) => {
        if (attributeModal.index !== undefined) {
            const newAttributes = [...currentAttributes];
            newAttributes[attributeModal.index] = attribute;
            setValue('attributes', newAttributes);
        }
        attributeModal.closeModal();
    };

    const handleDeleteAttribute = () => {
        if (attributeModal.index !== undefined) {
            const newAttributes = currentAttributes.filter((_: string, i: number) => i !== attributeModal.index);
            setValue('attributes', newAttributes);
        }
        attributeModal.closeModal();
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={handleCancel} disabled={isLoading}>
                    <Text style={styles.cancelButton}>Annuler</Text>
                </TouchableOpacity>
                <Text style={styles.title}>
                    {initialData ? 'Modifier la recette' : 'Nouvelle recette'}
                </Text>
                <TouchableOpacity
                    onPress={handleSubmit(onSubmit)}
                    disabled={isLoading || !isValid}
                >
                    <Text style={[
                        styles.saveButton,
                        (isLoading || !isValid) && styles.disabledButton
                    ]}>
                        Enregistrer
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.form}>
                    {/* Informations de base */}
                    <View style={styles.section}>
                        <ControlledInput
                            name="name"
                            control={control}
                            label=""
                            placeholder="Nom de la recette"
                            rules={{required: 'Le nom de la recette est requis'}}
                            required
                        />

                        <ControlledInput
                            name="description"
                            control={control}
                            label=""
                            placeholder="Description"
                            multiline
                            numberOfLines={3}
                            textAlignVertical="top"
                        />

                        <ControlledInput
                            label=""
                            name="source_reference"
                            control={control}
                            placeholder="Référence : Site web, livre de cuisine..."
                        />

                        <ControlledCountrySelect
                            name="origin_country"
                            control={control}
                            placeholder="Pays d'origine"
                        />

                        <ControlledPriceSelector
                            name="price"
                            control={control}
                            rules={{required: 'Veuillez sélectionner un niveau de prix'}}
                        />

                        <ControlledDifficultySelector
                            name="difficulty"
                            control={control}
                            rules={{required: 'Veuillez sélectionner un niveau de difficulté'}}
                        />

                        {/* Nombre de personnes et quantité de parts - regroupés avec espacement réduit */}
                        <View style={styles.section}>
                            <View style={styles.quantityContainer}>
                                <ControlledNumberSelector
                                    name="number_of_persons"
                                    control={control}
                                    label=""
                                    suffix="personne(s)"
                                    minValue={1}
                                    maxValue={100}
                                    size="large"
                                />

                                <ControlledNumberSelector
                                    name="quantity"
                                    control={control}
                                    label=""
                                    suffix="part(s)"
                                    minValue={1}
                                    maxValue={1000}
                                    size="medium"
                                />
                            </View>
                        </View>
                    </View>

                    {/* Processus */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Processus ({processArray.fields.length})</Text>
                            <TouchableOpacity onPress={handleAddProcess} style={styles.addProcessButton}>
                                <Ionicons name="add" size={24} color={theme.colors.primary}/>
                                <Text style={styles.addProcessButtonText}>Ajouter un processus</Text>
                            </TouchableOpacity>
                        </View>

                        {processArray.fields.length === 0 ? (
                            <View style={styles.emptyProcessState}>
                                <Text style={styles.emptyStateText}>Aucun processus défini</Text>
                                <Text style={styles.emptyStateSubtext}>
                                    Ajoutez un processus pour définir les étapes, ingrédients et ustensiles
                                </Text>
                            </View>
                        ) : (
                            <View style={styles.processContainer}>
                                {processArray.fields.map((process, index) => (
                                    <ProcessCard
                                        key={process.id || index}
                                        process={process as ProcessFormData}
                                        index={index}
                                        onUpdate={(updatedProcess) => handleUpdateProcess(index, updatedProcess)}
                                        onRemove={() => handleRemoveProcess(index)}
                                        onSelectRecipe={() => handleSelectRecipe(index)}
                                        recipes={sampleRecipes}
                                    />
                                ))}
                            </View>
                        )}
                    </View>

                    {/* Attributs */}
                    <View style={styles.section}>
                        <SimpleTagListManager
                            control={control}
                            setValue={setValue}
                            fieldName="attributes"
                            title="Attributs (sans gluten...)"
                            addButtonText="Ajouter un attribut"
                            emptyStateText="Aucun attribut ajouté"
                            renderItem={(attribute, index, onEdit) => (
                                <TagDisplay
                                    tag={attribute}
                                    onEdit={onEdit}
                                    allowEdit={true}
                                />
                            )}
                            onAddItem={attributeModal.openAddModal}
                            onEditItem={(attribute, index) => attributeModal.openEditModal(attribute, index)}
                        />
                    </View>

                    {/* Images */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Images (optionnel)</Text>

                        <ControlledInput
                            name="thumbnail_url"
                            control={control}
                            label="URL de l'image miniature"
                            placeholder="https://example.com/image.jpg"
                            keyboardType="url"
                            rules={{
                                pattern: {
                                    value: /^https?:\/\/.+\..+/,
                                    message: 'URL invalide'
                                }
                            }}
                        />

                        <ControlledInput
                            name="large_image_url"
                            control={control}
                            label="URL de l'image haute résolution"
                            placeholder="https://example.com/large-image.jpg"
                            keyboardType="url"
                            rules={{
                                pattern: {
                                    value: /^https?:\/\/.+\..+/,
                                    message: 'URL invalide'
                                }
                            }}
                        />
                    </View>

                    {/* Espacement pour le bouton flottant */}
                    <View style={styles.bottomSpacing}/>
                </View>
            </ScrollView>

            {/* Modales */}
            <ModernTagModal
                visible={attributeModal.isVisible}
                onSave={attributeModal.isEditMode ? handleEditAttribute : handleAddAttribute}
                onCancel={attributeModal.closeModal}
                onDelete={attributeModal.isEditMode ? handleDeleteAttribute : undefined}
                title={attributeModal.isEditMode ? "Modifier l'attribut" : "Ajouter un attribut"}
                placeholder="Ex: Végétarien, Sans gluten, Épicé..."
                initialData={attributeModal.data}
                mode={attributeModal.modalState.mode}
            />

            <RecipeSelectionModal
                visible={recipeSelectionModal.visible}
                recipes={sampleRecipes}
                onSelect={handleRecipeSelected}
                onCancel={handleRecipeSelectionCancel}
                currentRecipeId={initialData?.uuid}
            />
        </KeyboardAvoidingView>
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
        backgroundColor: theme.colors.background.white,
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
    disabledButton: {
        opacity: 0.5,
    },
    scrollView: {
        flex: 1,
    },
    form: {
        padding: theme.spacing.md,
    },
    section: {
        marginBottom: theme.spacing.xl,
    },
    quantityContainer: {
        gap: theme.spacing.sm,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.md,
    },
    row: {
        flexDirection: 'row',
        gap: theme.spacing.md,
    },
    flex1: {
        flex: 1,
    },
    bottomSpacing: {
        height: 100, // Pour laisser de l'espace pour le bouton flottant
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
    },
    addProcessButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        backgroundColor: theme.colors.background.secondary,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: theme.colors.primary,
        gap: theme.spacing.xs,
    },
    addProcessButtonText: {
        fontSize: 14,
        fontWeight: '500',
        color: theme.colors.primary,
    },
    emptyProcessState: {
        padding: theme.spacing.lg,
        alignItems: 'center',
        backgroundColor: theme.colors.background.secondary,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderStyle: 'dashed',
    },
    emptyStateText: {
        fontSize: 16,
        fontWeight: '500',
        color: theme.colors.text.secondary,
        marginBottom: theme.spacing.xs,
    },
    emptyStateSubtext: {
        fontSize: 14,
        color: theme.colors.text.secondary,
        textAlign: 'center',
    },
    processContainer: {
        gap: theme.spacing.md,
    },
});
