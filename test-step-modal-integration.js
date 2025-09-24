/**
 * Test script to verify the step modal integration
 * Checks that StepsSection properly integrates ModernStepModal and ProcessCard works with the new callback
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 Testing step modal integration...\n');

// Test 1: Verify StepsSection imports ModernStepModal
const stepsSectionPath = path.join(__dirname, 'components/addrecipe/StepsSection.tsx');
if (fs.existsSync(stepsSectionPath)) {
    console.log('✅ StepsSection.tsx exists');
    
    const stepsSectionContent = fs.readFileSync(stepsSectionPath, 'utf8');
    
    // Check for ModernStepModal import
    if (stepsSectionContent.includes("import {ModernStepModal} from '../forms/ModernStepModal'")) {
        console.log('✅ StepsSection imports ModernStepModal');
    } else {
        console.log('❌ StepsSection missing ModernStepModal import');
    }
    
    // Check that onAddStep prop accepts a step parameter
    if (stepsSectionContent.includes('onAddStep: (step: Omit<Step, \'created_by\'>) => void;')) {
        console.log('✅ StepsSection onAddStep prop accepts step parameter');
    } else {
        console.log('❌ StepsSection onAddStep prop signature incorrect');
    }
    
    // Check for modal state management
    if (stepsSectionContent.includes('const [isModalVisible, setIsModalVisible] = React.useState(false)')) {
        console.log('✅ StepsSection has modal state management');
    } else {
        console.log('❌ StepsSection missing modal state management');
    }
    
    // Check for modal handlers
    if (stepsSectionContent.includes('const handleAddStep = ()') &&
        stepsSectionContent.includes('const handleModalSave = (step: Omit<Step, \'created_by\'>)') &&
        stepsSectionContent.includes('const handleModalCancel = ()')) {
        console.log('✅ StepsSection has proper modal handlers');
    } else {
        console.log('❌ StepsSection missing proper modal handlers');
    }
    
    // Check that add button uses handleAddStep
    if (stepsSectionContent.includes('onPress={handleAddStep}')) {
        console.log('✅ Add button uses handleAddStep');
    } else {
        console.log('❌ Add button does not use handleAddStep');
    }
    
    // Check for ModernStepModal JSX
    if (stepsSectionContent.includes('<ModernStepModal') &&
        stepsSectionContent.includes('visible={isModalVisible}') &&
        stepsSectionContent.includes('onSave={handleModalSave}') &&
        stepsSectionContent.includes('onCancel={handleModalCancel}')) {
        console.log('✅ StepsSection includes ModernStepModal with proper props');
    } else {
        console.log('❌ StepsSection missing ModernStepModal or incorrect props');
    }
    
} else {
    console.log('❌ StepsSection.tsx not found');
}

console.log();

// Test 2: Verify ProcessCard updated callback
const processCardPath = path.join(__dirname, 'components/forms/ProcessCard.tsx');
if (fs.existsSync(processCardPath)) {
    console.log('✅ ProcessCard.tsx exists');
    
    const processCardContent = fs.readFileSync(processCardPath, 'utf8');
    
    // Check that onAddStep callback accepts step parameter
    if (processCardContent.includes('onAddStep={(step: Omit<Step, \'created_by\'>) => {')) {
        console.log('✅ ProcessCard onAddStep callback accepts step parameter');
    } else {
        console.log('❌ ProcessCard onAddStep callback signature incorrect');
    }
    
    // Check that it adds the step directly instead of creating empty step
    if (processCardContent.includes('steps: [...process.steps, step]') &&
        !processCardContent.includes('const newStep: Omit<Step, \'created_by\'> = {')) {
        console.log('✅ ProcessCard adds step from modal instead of creating empty step');
    } else {
        console.log('❌ ProcessCard still creates empty step instead of using modal step');
    }
    
} else {
    console.log('❌ ProcessCard.tsx not found');
}

console.log();

// Test 3: Verify ModernStepModal exists and has description field
const modernStepModalPath = path.join(__dirname, 'components/forms/ModernStepModal.tsx');
if (fs.existsSync(modernStepModalPath)) {
    console.log('✅ ModernStepModal.tsx exists');
    
    const modalContent = fs.readFileSync(modernStepModalPath, 'utf8');
    
    // Check for description field
    if (modalContent.includes('name="description"') &&
        modalContent.includes('label="Description de l\'étape"') &&
        modalContent.includes('required: \'La description est requise\'')) {
        console.log('✅ ModernStepModal has required description field');
    } else {
        console.log('❌ ModernStepModal missing description field or validation');
    }
    
} else {
    console.log('❌ ModernStepModal.tsx not found');
}

console.log('\n🎉 Step modal integration test completed!');
console.log('📝 Summary: Step addition now uses a modal where users can enter a description, and once added, it gets added to the list.');