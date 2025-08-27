import { FormData, Errors } from '../types';

/**
 * Validate form data according to the form rules
 * 
 * Checks that all required fields are filled based on the selected mode
 */
export const validateForm = (formData: FormData): { isValid: boolean; errors: Errors } => {
  const newErrors: Errors = {};

  if (!formData.mode) {
    newErrors.mode = 'Mode is required';
  }

  if (formData.mode === 'Basic' && !formData.topic.trim()) {
    newErrors.topic = 'Topic is required for Basic mode';
  }
  if (formData.mode === 'Advanced' && !formData.category) {
    newErrors.category = 'Category is required for Advanced mode';
  }

  if (formData.mode === 'Basic' && formData.topic) {
    if (formData.topic.toLowerCase().includes('date') && !formData.choose_date) {
      newErrors.choose_date = 'Date is required when topic contains "date"';
    } else if (!formData.topic.toLowerCase().includes('date') && !formData.choose_time) {
      newErrors.choose_time = 'Time is required when topic does not contain "date"';
    }
  }
  
  if (formData.mode === 'Advanced' && formData.category) {
    if (formData.category === 'Schedule' && !formData.choose_date) {
      newErrors.choose_date = 'Date is required for Schedule category';
    } else if (['Realtime', 'Analytics'].includes(formData.category) && !formData.choose_time) {
      newErrors.choose_time = 'Time is required for Realtime and Analytics categories';
    }
  }

  const isDatePath = (formData.mode === 'Basic' && formData.topic && formData.topic.toLowerCase().includes('date')) ||
                    (formData.mode === 'Advanced' && formData.category === 'Schedule');
  
  const isTimePath = (formData.mode === 'Basic' && formData.topic && !formData.topic.toLowerCase().includes('date')) ||
                    (formData.mode === 'Advanced' && ['Realtime', 'Analytics'].includes(formData.category));

  if (isDatePath && formData.budget === undefined) {
    newErrors.budget = 'Budget is required when on date path';
  }
  if (isTimePath && !formData.urgency) {
    newErrors.urgency = 'Urgency is required when on time path';
  }

  return {
    isValid: Object.keys(newErrors).length === 0,
    errors: newErrors
  };
};