import React, { useState } from 'react';
import { FormData, Errors, SubmitResult } from '../types';
import { validateForm } from '../utils/validation';
import { submitForm } from '../services/formService';

/**
 * Custom hook that manages the form state and logic
 * 
 * Handles form data, validation, submission, and conditional field visibility
 */
export const useForm = () => {
  const [formData, setFormData] = useState<FormData>({
    mode: 'Basic',        // Step 1: Basic or Advanced
    topic: '',            // Step 2: Topic for Basic mode
    category: '',         // Step 2: Category for Advanced mode
    choose_date: '',      // Step 3: Date picker
    choose_time: '',      // Step 3: Time picker
    budget: undefined,    // Step 4: Budget amount
    urgency: ''           // Step 4: Urgency level
  });

  const [errors, setErrors] = useState<Errors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitResult, setSubmitResult] = useState<SubmitResult | null>(null);

  /**
   * Clear dependent fields when a parent field changes
   * 
   * For example, when mode changes, we clear topic and category
   */
  const resetDependentFields = (fieldName: keyof FormData): void => {
    setFormData(prev => {
      const newFormData = { ...prev };
      
      if (fieldName === 'mode') {
        newFormData.topic = '';
        newFormData.category = '';
        newFormData.choose_date = '';
        newFormData.choose_time = '';
        newFormData.budget = undefined;
        newFormData.urgency = '';
      } 
      else if (fieldName === 'topic') {
        newFormData.choose_date = '';
        newFormData.choose_time = '';
        newFormData.budget = undefined;
        newFormData.urgency = '';
      } 
      else if (fieldName === 'category') {
        newFormData.choose_date = '';
        newFormData.choose_time = '';
        newFormData.budget = undefined;
        newFormData.urgency = '';
      }
      
      return newFormData;
    });
    
    setErrors({});
    setSubmitResult(null);
  };

  const handleInputChange = (fieldName: keyof FormData, value: string | number | boolean): void => {
    if (errors[fieldName]) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: ''
      }));
    }
    
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
    
    if (fieldName === 'mode' || fieldName === 'topic' || fieldName === 'category') {
      resetDependentFields(fieldName);
    }
  };

  /**
   * Check if date picker should be shown
   * 
   * Basic mode: show if topic contains "date"
   * Advanced mode: show if category is "Schedule"
   */
  const shouldShowDatePicker = (): boolean => {
    if (formData.mode === 'Basic') {
      return Boolean(formData.topic && formData.topic.toLowerCase().includes('date'));
    } else if (formData.mode === 'Advanced') {
      return formData.category === 'Schedule';
    }
    return false;
  };

  const shouldShowBudget = (): boolean => {
    return shouldShowDatePicker();
  };

  const shouldShowUrgency = (): boolean => {
    return !shouldShowDatePicker();
  };

  const isFormComplete = (): boolean => {
    if (!formData.mode) return false;
    
    if (formData.mode === 'Basic' && !formData.topic.trim()) return false;
    if (formData.mode === 'Advanced' && !formData.category) return false;
    
    const isDatePath = (formData.mode === 'Basic' && formData.topic && formData.topic.toLowerCase().includes('date')) ||
                      (formData.mode === 'Advanced' && formData.category === 'Schedule');
    
    if (isDatePath && !formData.choose_date) return false;
    if (!isDatePath && !formData.choose_time) return false;
    
    if (isDatePath && formData.budget === undefined) return false;
    if (!isDatePath && !formData.urgency) return false;
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    const validation = validateForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);
    setSubmitResult(null);

    try {
      console.log('Form data being submitted:', formData);
      const data = await submitForm(formData);
      console.log('Submission successful:', data);
      setSubmitResult({ success: true, data });
    } catch (error: any) {
      console.error('Submission error details:', error);
      console.error('Error response:', error.response);
      console.error('Error message:', error.message);
      
      if (error.response?.data?.detail) {
        setSubmitResult({ success: false, error: error.response.data.detail });
      } else if (error.message) {
        setSubmitResult({ success: false, error: error.message });
      } else {
        setSubmitResult({ success: false, error: 'An unexpected error occurred' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    errors,
    isSubmitting,
    submitResult,
    handleInputChange,
    handleSubmit,
    shouldShowDatePicker,
    shouldShowBudget,
    shouldShowUrgency,
    isFormComplete
  };
};