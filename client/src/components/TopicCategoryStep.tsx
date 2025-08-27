import React from 'react';
import { FormData, Errors } from '../types';
import { 
  FormStep, 
  StepTitle, 
  FormGroup, 
  FormLabel, 
  FormInput, 
  FormSelect, 
  ErrorMessage 
} from './styled/SharedComponents';

interface TopicCategoryStepProps {
  formData: FormData;
  errors: Errors;
  onInputChange: (fieldName: keyof FormData, value: string | number | boolean) => void;
}

export const TopicCategoryStep: React.FC<TopicCategoryStepProps> = ({ formData, errors, onInputChange }) => {
  return (
    <FormStep>
      <StepTitle>Step 2: {formData.mode === 'Basic' ? 'Topic' : 'Category'}</StepTitle>
      {formData.mode === 'Basic' ? (
        <FormGroup>
          <FormLabel htmlFor="topic">Topic</FormLabel>
          <FormInput
            type="text"
            id="topic"
            value={formData.topic}
            onChange={(e) => onInputChange('topic', e.target.value)}
            hasError={!!errors.topic}
            placeholder="Enter topic..."
            required
          />
          {errors.topic && <ErrorMessage>{errors.topic}</ErrorMessage>}
        </FormGroup>
      ) : (
        <FormGroup>
          <FormLabel htmlFor="category">Category</FormLabel>
          <FormSelect
            id="category"
            value={formData.category}
            onChange={(e) => onInputChange('category', e.target.value)}
            hasError={!!errors.category}
            required
          >
            <option value="">Select category...</option>
            <option value="Schedule">Schedule</option>
            <option value="Realtime">Realtime</option>
            <option value="Analytics">Analytics</option>
          </FormSelect>
          {errors.category && <ErrorMessage>{errors.category}</ErrorMessage>}
        </FormGroup>
      )}
    </FormStep>
  );
};