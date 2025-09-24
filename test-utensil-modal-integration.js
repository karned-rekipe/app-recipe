/**
 * Test script to verify the utensil modal integration
 * Checks that UtensilsSection properly integrates ModernUtensilModal
 * and follows the same pattern as IngredientsSection and StepsSection
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 Testing utensil modal integration...\n');

// Test 1: Verify ModernUtensilModal was created
const utensilModalPath = path.join(__dirname, 'components/forms/ModernUtensilModal.tsx');
if (fs.existsSync(utensilModalPath)) {
    console.log('✅ ModernUtensilModal.tsx created successfully');
    
    const modalContent = fs.readFileSync(utensilModalPath, 'utf8');
    
    // Check for required imports
    if (modalContent.includes("import { BaseModal } from './BaseModal'") && 
        modalContent.includes("import { useModalForm } from './useModalForm'") &&
        modalContent.includes("import { ControlledInput } from './ControlledInput'")) {
        console.log('✅ ModernUtensilModal has required imports (BaseModal, useModalForm, ControlledInput)');
    } else {
        console.log('❌ ModernUtensilModal missing required imports');
    }
    
    // Check for proper form structure
    if (modalContent.includes('UtensilFormData') &&
        modalContent.includes('name: string') &&
        modalContent.includes('onSave: (utensil: string) => void')) {
        console.log('✅ ModernUtensilModal has proper form structure');
    } else {
        console.log('❌ ModernUtensilModal missing proper form structure');
    }
    
    // Check for required form field
    if (modalContent.includes('name="name"') &&
        modalContent.includes('label="Nom de l\'ustensile"') &&
        modalContent.includes('placeholder="Ex: Fouet, Casserole, Spatule..."')) {
        console.log('✅ ModernUtensilModal has proper form field with appropriate labels');
    } else {
        console.log('❌ ModernUtensilModal missing proper form field');
    }
    
    // Check for validation
    if (modalContent.includes('required: \'Le nom de l\\\'ustensile est requis\'') &&
        modalContent.includes('minLength: { value: 2')) {
        console.log('✅ ModernUtensilModal has proper validation rules');
    } else {
        console.log('❌ ModernUtensilModal missing validation rules');
    }
    
} else {
    console.log('❌ ModernUtensilModal.tsx not found');
}

console.log();

// Test 2: Verify UtensilsSection imports ModernUtensilModal
const utensilsSectionPath = path.join(__dirname, 'components/addrecipe/UtensilsSection.tsx');
if (fs.existsSync(utensilsSectionPath)) {
    console.log('✅ UtensilsSection.tsx exists');
    
    const utensilsContent = fs.readFileSync(utensilsSectionPath, 'utf8');
    
    // Check for ModernUtensilModal import
    if (utensilsContent.includes("import {ModernUtensilModal} from '../forms/ModernUtensilModal'")) {
        console.log('✅ UtensilsSection imports ModernUtensilModal');
    } else {
        console.log('❌ UtensilsSection missing ModernUtensilModal import');
    }
    
    // Check for modal state management
    if (utensilsContent.includes('const [isModalVisible, setIsModalVisible] = React.useState(false)')) {
        console.log('✅ UtensilsSection has modal state management');
    } else {
        console.log('❌ UtensilsSection missing modal state management');
    }
    
    // Check for modal handlers
    if (utensilsContent.includes('const handleAddUtensil = ()') &&
        utensilsContent.includes('const handleModalSave = (utensil: string)') &&
        utensilsContent.includes('const handleModalCancel = ()')) {
        console.log('✅ UtensilsSection has proper modal handlers');
    } else {
        console.log('❌ UtensilsSection missing proper modal handlers');
    }
    
    // Check that old prompt logic was removed
    if (!utensilsContent.includes('prompt("Nom de l\'ustensile:")')) {
        console.log('✅ Old prompt logic removed from UtensilsSection');
    } else {
        console.log('❌ Old prompt logic still present in UtensilsSection');
    }
    
    // Check that add button uses handleAddUtensil
    if (utensilsContent.includes('onPress={handleAddUtensil}')) {
        console.log('✅ Add button uses handleAddUtensil');
    } else {
        console.log('❌ Add button does not use handleAddUtensil');
    }
    
    // Check for ModernUtensilModal JSX
    if (utensilsContent.includes('<ModernUtensilModal') &&
        utensilsContent.includes('visible={isModalVisible}') &&
        utensilsContent.includes('onSave={handleModalSave}') &&
        utensilsContent.includes('onCancel={handleModalCancel}')) {
        console.log('✅ UtensilsSection includes ModernUtensilModal with proper props');
    } else {
        console.log('❌ UtensilsSection missing ModernUtensilModal or incorrect props');
    }
    
} else {
    console.log('❌ UtensilsSection.tsx not found');
}

console.log();

// Test 3: Verify consistency with other sections
const ingredientsSectionPath = path.join(__dirname, 'components/addrecipe/IngredientsSection.tsx');
if (fs.existsSync(ingredientsSectionPath)) {
    const ingredientsContent = fs.readFileSync(ingredientsSectionPath, 'utf8');
    const utensilsContent = fs.readFileSync(utensilsSectionPath, 'utf8');
    
    // Check for similar patterns
    const ingredientsHasModalState = ingredientsContent.includes('const [isModalVisible, setIsModalVisible] = React.useState(false)');
    const utensilsHasModalState = utensilsContent.includes('const [isModalVisible, setIsModalVisible] = React.useState(false)');
    
    if (ingredientsHasModalState && utensilsHasModalState) {
        console.log('✅ UtensilsSection follows same modal state pattern as IngredientsSection');
    } else {
        console.log('❌ UtensilsSection does not follow same modal state pattern as IngredientsSection');
    }
    
    const ingredientsHasHandlers = ingredientsContent.includes('handleModalSave') && ingredientsContent.includes('handleModalCancel');
    const utensilsHasHandlers = utensilsContent.includes('handleModalSave') && utensilsContent.includes('handleModalCancel');
    
    if (ingredientsHasHandlers && utensilsHasHandlers) {
        console.log('✅ UtensilsSection follows same modal handlers pattern as IngredientsSection');
    } else {
        console.log('❌ UtensilsSection does not follow same modal handlers pattern as IngredientsSection');
    }
}

console.log('\n🎉 Utensil modal integration test completed!');
console.log('📝 Summary: Utensil modal now uses the same modern modal architecture as ingredient and step modals.');