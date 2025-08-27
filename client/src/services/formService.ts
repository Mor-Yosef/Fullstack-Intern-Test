import axios from 'axios';
import { FormData, SubmitResponse } from '../types';

/**
 * Submit form data to the backend API
 * 
 * Transforms the form data and sends it to the server
 */
export const submitForm = async (formData: FormData): Promise<SubmitResponse> => {
  // Prepare data for the server, filtering out undefined values
  const submitData: any = {
    mode: formData.mode
  };

  // Only add fields that have values
  if (formData.mode === 'Basic' && formData.topic) {
    submitData.topic = formData.topic;
  }
  
  if (formData.mode === 'Advanced' && formData.category) {
    submitData.category = formData.category;
  }
  
  if (formData.choose_date) {
    submitData.choose_date = formData.choose_date;
  }
  
  if (formData.choose_time) {
    submitData.choose_time = formData.choose_time;
  }
  
  if (formData.budget !== undefined && formData.budget !== null) {
    submitData.budget = formData.budget;
  }
  
  if (formData.urgency) {
    submitData.urgency = formData.urgency;
  }

  console.log('Submitting data:', submitData);

  const response = await axios.post<SubmitResponse>('/api/submit', submitData);
  
  return response.data;
};