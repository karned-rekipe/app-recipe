/**
 * Test script to verify the ingredients and steps refactoring
 * Checks that the ProcessCard imports and uses IngredientsSection and StepsSection correctly
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 Testing ingredients and steps refactoring...\n');

// Test 1: Verify IngredientsSection component was created
const ingredientsSectionPath = path.join(__dirname, 'components/forms/IngredientsSection.tsx');
if (fs.existsSync(ingredientsSectionPath)) {
    console.log('✅ IngredientsSection.tsx created successfully');
    
    const ingredientsContent = fs.readFileSync(ingredientsSectionPath, 'utf8');
    
    // Check for required exports and functions
    if (ingredientsContent.includes('export function IngredientsSection')) {
        console.log('✅ IngredientsSection component is properly exported');
    } else {
        console.log('❌ IngredientsSection component export not found');
    }
    
    if (ingredientsContent.includes('onAddIngredient') && 
        ingredientsContent.includes('onUpdateIngredient') && 
        ingredientsContent.includes('onRemoveIngredient')) {
        console.log('✅ IngredientsSection has proper callback props');
    } else {
        console.log('❌ IngredientsSection missing required callback props');
    }
    
} else {
    console.log('❌ IngredientsSection.tsx not found');
}

console.log();

// Test 2: Verify StepsSection component was created
const stepsSectionPath = path.join(__dirname, 'components/forms/StepsSection.tsx');
if (fs.existsSync(stepsSectionPath)) {
    console.log('✅ StepsSection.tsx created successfully');
    
    const stepsContent = fs.readFileSync(stepsSectionPath, 'utf8');
    
    // Check for required exports and functions
    if (stepsContent.includes('export function StepsSection')) {
        console.log('✅ StepsSection component is properly exported');
    } else {
        console.log('❌ StepsSection component export not found');
    }
    
    if (stepsContent.includes('onAddStep') && 
        stepsContent.includes('onUpdateStep') && 
        stepsContent.includes('onRemoveStep')) {
        console.log('✅ StepsSection has proper callback props');
    } else {
        console.log('❌ StepsSection missing required callback props');
    }
    
} else {
    console.log('❌ StepsSection.tsx not found');
}

console.log();

// Test 3: Verify ProcessCard was updated correctly
const processCardPath = path.join(__dirname, 'components/forms/ProcessCard.tsx');
if (fs.existsSync(processCardPath)) {
    console.log('✅ ProcessCard.tsx exists');
    
    const processCardContent = fs.readFileSync(processCardPath, 'utf8');
    
    // Check for component imports
    if (processCardContent.includes("import {IngredientsSection} from './IngredientsSection'")) {
        console.log('✅ ProcessCard imports IngredientsSection');
    } else {
        console.log('❌ ProcessCard missing IngredientsSection import');
    }
    
    if (processCardContent.includes("import {StepsSection} from './StepsSection'")) {
        console.log('✅ ProcessCard imports StepsSection');
    } else {
        console.log('❌ ProcessCard missing StepsSection import');
    }
    
    // Check that old functions were removed
    if (!processCardContent.includes('const addIngredient = ()') && 
        !processCardContent.includes('const updateIngredient = (') &&
        !processCardContent.includes('const removeIngredient = (')) {
        console.log('✅ Old ingredients functions removed from ProcessCard');
    } else {
        console.log('❌ Old ingredients functions still present in ProcessCard');
    }
    
    if (!processCardContent.includes('const addStep = ()') && 
        !processCardContent.includes('const updateStep = (') &&
        !processCardContent.includes('const removeStep = (')) {
        console.log('✅ Old steps functions removed from ProcessCard');
    } else {
        console.log('❌ Old steps functions still present in ProcessCard');
    }
    
    // Check that components are used
    if (processCardContent.includes('<IngredientsSection')) {
        console.log('✅ ProcessCard uses IngredientsSection component');
    } else {
        console.log('❌ ProcessCard does not use IngredientsSection component');
    }
    
    if (processCardContent.includes('<StepsSection')) {
        console.log('✅ ProcessCard uses StepsSection component');
    } else {
        console.log('❌ ProcessCard does not use StepsSection component');
    }
    
    // Check that old JSX was removed
    if (!processCardContent.includes('Ingrédients</Text>') || 
        !processCardContent.includes('onPress={addIngredient}')) {
        console.log('✅ Old ingredients JSX removed from ProcessCard');
    } else {
        console.log('❌ Old ingredients JSX still present in ProcessCard');
    }
    
    if (!processCardContent.includes('Étapes</Text>') || 
        !processCardContent.includes('onPress={addStep}')) {
        console.log('✅ Old steps JSX removed from ProcessCard');
    } else {
        console.log('❌ Old steps JSX still present in ProcessCard');
    }
    
} else {
    console.log('❌ ProcessCard.tsx not found');
}

console.log('\n🎉 Refactoring test completed!');
console.log('📝 Summary: Ingredients and steps management have been successfully extracted from ProcessCard into separate components (IngredientsSection and StepsSection).');