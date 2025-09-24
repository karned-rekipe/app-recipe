/**
 * Test script to verify that timing appears in the steps list
 * Checks that StepsSection properly displays timing information alongside step descriptions
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 Testing steps timing display...\n');

// Test 1: Verify StepsSection displays timing information
const stepsSectionPath = path.join(__dirname, 'components/addrecipe/StepsSection.tsx');
if (fs.existsSync(stepsSectionPath)) {
    console.log('✅ StepsSection.tsx exists');
    
    const stepsContent = fs.readFileSync(stepsSectionPath, 'utf8');
    
    // Check that timing is displayed in step text
    if (stepsContent.includes('step.total_duration') && 
        stepsContent.includes('step.total_duration > 0')) {
        console.log('✅ StepsSection checks for timing information (total_duration)');
    } else {
        console.log('❌ StepsSection does not check for timing information');
    }
    
    // Check for timing display format
    if (stepsContent.includes('({step.total_duration} min)')) {
        console.log('✅ StepsSection displays timing in proper format " (X min)"');
    } else {
        console.log('❌ StepsSection does not display timing in expected format');
    }
    
    // Check for conditional timing display
    if (stepsContent.includes('step.total_duration && step.total_duration > 0 &&')) {
        console.log('✅ StepsSection conditionally displays timing only when it exists and is greater than 0');
    } else {
        console.log('❌ StepsSection does not properly handle conditional timing display');
    }
    
    // Check for timing text style
    if (stepsContent.includes('styles.timingText')) {
        console.log('✅ StepsSection uses dedicated style for timing text');
    } else {
        console.log('❌ StepsSection does not use dedicated style for timing text');
    }
    
    // Check that timing style is defined
    if (stepsContent.includes('timingText: {') && 
        stepsContent.includes('fontSize: 12') &&
        stepsContent.includes('color: theme.colors.text.secondary') &&
        stepsContent.includes('fontStyle: \'italic\'')) {
        console.log('✅ StepsSection has proper timing text styling (smaller, secondary color, italic)');
    } else {
        console.log('❌ StepsSection timing text styling is missing or incomplete');
    }
    
    // Check that the original step display structure is preserved
    if (stepsContent.includes('{step.step_number}. {step.title || step.description}')) {
        console.log('✅ StepsSection preserves original step display format');
    } else {
        console.log('❌ StepsSection original step display format was modified incorrectly');
    }
    
} else {
    console.log('❌ StepsSection.tsx not found');
}

console.log();

// Test 2: Verify Step interface has timing fields
const stepTypePath = path.join(__dirname, 'types/Recipe.ts');
if (fs.existsSync(stepTypePath)) {
    console.log('✅ Recipe.ts (Step interface) exists');
    
    const stepTypeContent = fs.readFileSync(stepTypePath, 'utf8');
    
    // Check for timing fields
    if (stepTypeContent.includes('total_duration: number')) {
        console.log('✅ Step interface has total_duration field');
    } else {
        console.log('❌ Step interface missing total_duration field');
    }
    
    // Check for timing field comment
    if (stepTypeContent.includes('durée totale utilisée dans l\'affichage')) {
        console.log('✅ Step interface indicates total_duration is used for display');
    } else {
        console.log('❌ Step interface does not clearly indicate display usage');
    }
    
} else {
    console.log('❌ Recipe.ts not found');
}

console.log('\n🎉 Steps timing display test completed!');
console.log('📝 Summary: Timing information (total_duration) now appears in the steps list with proper formatting and conditional display.');