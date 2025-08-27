import React from 'react';
import { FormData, Errors } from '../types';
import { 
  FormStep, 
  StepTitle, 
  FormGroup, 
  FormLabel, 
  FormInput, 
  ErrorMessage 
} from './styled/SharedComponents';

interface SchedulerStepProps {
  formData: FormData;
  errors: Errors;
  shouldShowDatePicker: boolean;
  onInputChange: (fieldName: keyof FormData, value: string | number | boolean) => void;
}

export const SchedulerStep: React.FC<SchedulerStepProps> = ({ 
  formData, 
  errors, 
  shouldShowDatePicker, 
  onInputChange 
}) => {
  const shouldShowStep = (formData.mode === 'Basic' && formData.topic) || 
                         (formData.mode === 'Advanced' && formData.category);

  if (!shouldShowStep) return null;

  return (
    <FormStep>
      <StepTitle>Step 3: Scheduler</StepTitle>
      {shouldShowDatePicker ? (
        <FormGroup>
          <FormLabel htmlFor="choose_date">Choose date</FormLabel>
          <FormInput
            type="date"
            id="choose_date"
            value={formData.choose_date}
            onChange={(e) => onInputChange('choose_date', e.target.value)}
            hasError={!!errors.choose_date}
            required
          />
          {errors.choose_date && <ErrorMessage>{errors.choose_date}</ErrorMessage>}
        </FormGroup>
      ) : (
        <FormGroup>
          <FormLabel htmlFor="choose_time">Choose time</FormLabel>
          <FormInput
            type="time"
            id="choose_time"
            value={formData.choose_time}
            onChange={(e) => onInputChange('choose_time', e.target.value)}
            hasError={!!errors.choose_time}
            required
          />
          {errors.choose_time && <ErrorMessage>{errors.choose_time}</ErrorMessage>}
        </FormGroup>
      )}
    </FormStep>
  );
};