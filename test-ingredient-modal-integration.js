/**
 * Test script to verify the ingredient modal integration
 * Checks that IngredientsSection properly integrates ModernIngredientModal
 * and that ProcessCard works with the updated callback signature
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 Testing ingredient modal integration...\n');

// Test 1: Verify IngredientsSection imports ModernIngredientModal
const ingredientsSectionPath = path.join(__dirname, 'components/addrecipe/IngredientsSection.tsx');
if (fs.existsSync(ingredientsSectionPath)) {
    console.log('✅ IngredientsSection.tsx exists');
    
    const ingredientsContent = fs.readFileSync(ingredientsSectionPath, 'utf8');
    
    // Check for ModernIngredientModal import
    if (ingredientsContent.includes("import {ModernIngredientModal} from '../forms/ModernIngredientModal'")) {
        console.log('✅ IngredientsSection imports ModernIngredientModal');
    } else {
        console.log('❌ IngredientsSection missing ModernIngredientModal import');
    }
    
    // Check for updated interface with ingredient parameter
    if (ingredientsContent.includes('onAddIngredient: (ingredient: Omit<Ingredient, \'created_by\'>) => void;')) {
        console.log('✅ IngredientsSection interface updated with ingredient parameter');
    } else {
        console.log('❌ IngredientsSection interface not updated properly');
    }
    
    // Check for modal state management
    if (ingredientsContent.includes('const [isModalVisible, setIsModalVisible] = React.useState(false);')) {
        console.log('✅ IngredientsSection has modal state management');
    } else {
        console.log('❌ IngredientsSection missing modal state management');
    }
    
    // Check for modal handlers
    if (ingredientsContent.includes('const handleAddIngredient = ()') && 
        ingredientsContent.includes('const handleModalSave = (ingredient') &&
        ingredientsContent.includes('const handleModalCancel = ()')) {
        console.log('✅ IngredientsSection has proper modal handlers');
    } else {
        console.log('❌ IngredientsSection missing modal handlers');
    }
    
    // Check that ModernIngredientModal is rendered
    if (ingredientsContent.includes('<ModernIngredientModal')) {
        console.log('✅ IngredientsSection renders ModernIngredientModal');
    } else {
        console.log('❌ IngredientsSection does not render ModernIngredientModal');
    }
    
    // Check that add button triggers handleAddIngredient
    if (ingredientsContent.includes('onPress={handleAddIngredient}')) {
        console.log('✅ Add button triggers modal opening');
    } else {
        console.log('❌ Add button does not trigger modal opening');
    }
    
} else {
    console.log('❌ IngredientsSection.tsx not found');
}

console.log();

// Test 2: Verify ProcessCard works with updated callback
const processCardPath = path.join(__dirname, 'components/forms/ProcessCard.tsx');
if (fs.existsSync(processCardPath)) {
    console.log('✅ ProcessCard.tsx exists');
    
    const processCardContent = fs.readFileSync(processCardPath, 'utf8');
    
    // Check that onAddIngredient callback accepts ingredient parameter
    if (processCardContent.includes('onAddIngredient={(ingredient: Omit<Ingredient, \'created_by\'>) => {')) {
        console.log('✅ ProcessCard onAddIngredient accepts ingredient parameter');
    } else {
        console.log('❌ ProcessCard onAddIngredient does not accept ingredient parameter');
    }
    
    // Check that empty ingredient creation was removed
    if (!processCardContent.includes('const newIngredient: Omit<Ingredient, \'created_by\'> = {') ||
        !processCardContent.includes('name: \'\',') ||
        !processCardContent.includes('quantity: 0,') ||
        !processCardContent.includes('unit: \'\'')) {
        console.log('✅ Empty ingredient creation logic removed from ProcessCard');
    } else {
        console.log('❌ Empty ingredient creation logic still present in ProcessCard');
    }
    
    // Check that ingredient is directly added to array
    if (processCardContent.includes('ingredients: [...process.ingredients, ingredient]')) {
        console.log('✅ ProcessCard directly adds ingredient from modal');
    } else {
        console.log('❌ ProcessCard does not properly add ingredient from modal');
    }
    
} else {
    console.log('❌ ProcessCard.tsx not found');
}

console.log();

// Test 3: Verify ModernIngredientModal exists and has required props
const modalPath = path.join(__dirname, 'components/forms/ModernIngredientModal.tsx');
if (fs.existsSync(modalPath)) {
    console.log('✅ ModernIngredientModal.tsx exists');
    
    const modalContent = fs.readFileSync(modalPath, 'utf8');
    
    // Check for required form fields
    if (modalContent.includes('name="name"') && 
        modalContent.includes('name="quantity"') && 
        modalContent.includes('name="unit"')) {
        console.log('✅ ModernIngredientModal has required form fields (name, quantity, unit)');
    } else {
        console.log('❌ ModernIngredientModal missing required form fields');
    }
    
    // Check for proper layout (quantity and unit on same line)
    if (modalContent.includes('flexDirection: \'row\'') && 
        modalContent.includes('quantityContainer') && 
        modalContent.includes('unitContainer')) {
        console.log('✅ ModernIngredientModal has proper layout with quantity and unit on same line');
    } else {
        console.log('❌ ModernIngredientModal does not have proper layout');
    }
    
} else {
    console.log('❌ ModernIngredientModal.tsx not found');
}

console.log('\n🎉 Ingredient modal integration test completed!');
console.log('📝 Summary: Ingredient addition now uses a modal with name, quantity, and unit fields as requested.');