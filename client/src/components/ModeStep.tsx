import React from 'react';
import { FormData, Errors } from '../types';

import { 
  FormStep,        
  StepTitle,       
  FormGroup,       
  FormLabel,       
  SwitchContainer,
  SwitchLabels,
  SwitchLabel,
  SwitchTrack,
  SwitchSlider,
  SwitchInput,
  SwitchBackground,
  ErrorMessage     
} from './styled/SharedComponents';

interface ModeStepProps {
  formData: FormData;
  errors: Errors;
  onInputChange: (fieldName: keyof FormData, value: string | number | boolean) => void;
}

/**
 * ModeStep Component - Step 1 of the Chained Form
 * 
 * This component handles the first step of the form where users choose
 * between Basic and Advanced modes. The choice determines the flow
 * for all subsequent steps.
 * 
 * Features:
 * - Sliding switch between Basic and Advanced modes
 * - Visual feedback showing current selection
 * - Error display for validation failures
 * - Automatic form state updates
 */
export const ModeStep: React.FC<ModeStepProps> = ({ formData, errors, onInputChange }) => {
  const isAdvanced = formData.mode === 'Advanced';

  return (
    <FormStep>
      <StepTitle>Step 1: Mode</StepTitle>
      
      <FormGroup>
        <FormLabel>Choose your mode</FormLabel>
        
        <SwitchContainer>
          <SwitchLabels>
            <SwitchLabel isActive={!isAdvanced}>Basic</SwitchLabel>
            <SwitchTrack htmlFor="mode">
              <SwitchInput
                type="checkbox"
                id="mode"
                checked={isAdvanced}
                onChange={(e) => onInputChange('mode', e.target.checked ? 'Advanced' : 'Basic')}
              />
              <SwitchBackground isChecked={isAdvanced} />
              <SwitchSlider isChecked={isAdvanced} />
            </SwitchTrack>
            <SwitchLabel isActive={isAdvanced}>Advanced</SwitchLabel>
          </SwitchLabels>
        </SwitchContainer>
        
        {errors.mode && <ErrorMessage>{errors.mode}</ErrorMessage>}
      </FormGroup>
    </FormStep>
  );
};