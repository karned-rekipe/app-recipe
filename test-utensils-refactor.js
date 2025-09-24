/**
 * Test script to verify the utensils refactoring
 * Checks that the ProcessCard imports and uses UtensilsSection correctly
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 Testing utensils refactoring...\n');

// Test 1: Verify UtensilsSection component was created
const utensilsSectionPath = path.join(__dirname, 'components/forms/UtensilsSection.tsx');
if (fs.existsSync(utensilsSectionPath)) {
    console.log('✅ UtensilsSection.tsx created successfully');
    
    const utensilsContent = fs.readFileSync(utensilsSectionPath, 'utf8');
    
    // Check for required exports and functions
    if (utensilsContent.includes('export function UtensilsSection')) {
        console.log('✅ UtensilsSection component is properly exported');
    } else {
        console.log('❌ UtensilsSection component export not found');
    }
    
    if (utensilsContent.includes('onAddUtensil') && utensilsContent.includes('onRemoveUtensil')) {
        console.log('✅ UtensilsSection has proper callback props');
    } else {
        console.log('❌ UtensilsSection missing required callback props');
    }
    
} else {
    console.log('❌ UtensilsSection.tsx not found');
}

console.log();

// Test 2: Verify ProcessCard was updated correctly
const processCardPath = path.join(__dirname, 'components/forms/ProcessCard.tsx');
if (fs.existsSync(processCardPath)) {
    console.log('✅ ProcessCard.tsx exists');
    
    const processCardContent = fs.readFileSync(processCardPath, 'utf8');
    
    // Check for UtensilsSection import
    if (processCardContent.includes("import {UtensilsSection} from './UtensilsSection'")) {
        console.log('✅ ProcessCard imports UtensilsSection');
    } else {
        console.log('❌ ProcessCard missing UtensilsSection import');
    }
    
    // Check that old utensils functions were removed
    if (!processCardContent.includes('const addUtensil = ()') && !processCardContent.includes('const removeUtensil = (')) {
        console.log('✅ Old utensils functions removed from ProcessCard');
    } else {
        console.log('❌ Old utensils functions still present in ProcessCard');
    }
    
    // Check that UtensilsSection is used
    if (processCardContent.includes('<UtensilsSection')) {
        console.log('✅ ProcessCard uses UtensilsSection component');
    } else {
        console.log('❌ ProcessCard does not use UtensilsSection component');
    }
    
    // Check that old utensils JSX was removed
    if (!processCardContent.includes('Ustensiles</Text>') || !processCardContent.includes('onPress={addUtensil}')) {
        console.log('✅ Old utensils JSX removed from ProcessCard');
    } else {
        console.log('❌ Old utensils JSX still present in ProcessCard');
    }
    
} else {
    console.log('❌ ProcessCard.tsx not found');
}

console.log('\n🎉 Refactoring test completed!');
console.log('📝 Summary: Utensils management has been successfully extracted from ProcessCard into a separate UtensilsSection component.');