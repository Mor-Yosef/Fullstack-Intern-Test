import React from 'react';
import { FormData, Errors } from '../types';
import { 
  FormStep, 
  StepTitle, 
  FormGroup, 
  FormLabel, 
  FormSelect, 
  SliderContainer, 
  FormSlider, 
  SliderValue, 
  ErrorMessage 
} from './styled/SharedComponents';

interface BudgetUrgencyStepProps {
  formData: FormData;
  errors: Errors;
  shouldShowBudget: boolean;
  onInputChange: (fieldName: keyof FormData, value: string | number | boolean) => void;
}

export const BudgetUrgencyStep: React.FC<BudgetUrgencyStepProps> = ({ 
  formData, 
  errors, 
  shouldShowBudget, 
  onInputChange 
}) => {
  const shouldShowStep = ((formData.mode === 'Basic' && formData.topic && (formData.choose_date || formData.choose_time)) ||
                          (formData.mode === 'Advanced' && formData.category && (formData.choose_date || formData.choose_time)));

  if (!shouldShowStep) return null;

  return (
    <FormStep>
      <StepTitle>Step 4: {shouldShowBudget ? 'Budget' : 'Urgency'}</StepTitle>
      {shouldShowBudget ? (
        <FormGroup>
          <FormLabel htmlFor="budget">Budget</FormLabel>
          <SliderContainer>
            <FormSlider
              type="range"
              id="budget"
              min="0"
              max="5000"
              step="100"
              value={formData.budget || 0}
              onChange={(e) => onInputChange('budget', parseInt(e.target.value))}
            />
            <SliderValue>${formData.budget || 0}</SliderValue>
          </SliderContainer>
          {errors.budget && <ErrorMessage>{errors.budget}</ErrorMessage>}
        </FormGroup>
      ) : (
        <FormGroup>
          <FormLabel htmlFor="urgency">Urgency</FormLabel>
          <FormSelect
            id="urgency"
            value={formData.urgency}
            onChange={(e) => onInputChange('urgency', e.target.value)}
            hasError={!!errors.urgency}
            required
          >
            <option value="">Select urgency...</option>
            <option value="Low">Low</option>
            <option value="Normal">Normal</option>
            <option value="High">High</option>
          </FormSelect>
          {errors.urgency && <ErrorMessage>{errors.urgency}</ErrorMessage>}
        </FormGroup>
      )}
    </FormStep>
  );
};