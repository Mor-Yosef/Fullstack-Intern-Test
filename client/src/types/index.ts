/**
 * TypeScript Type Definitions for the Chained Form Application
 * 
 * This file defines all the interfaces and types used throughout the application
 * to ensure type safety and provide clear contracts between components.
 */

/**
 * FormData Interface - Represents the complete form state
 * 
 * This interface defines the structure of the form data that flows through
 * the application. Each field corresponds to a step in the chained form:
 * 
 * - mode: Step 1 - User's choice between Basic and Advanced modes
 * - topic: Step 2 - Free text input for Basic mode
 * - category: Step 2 - Dropdown selection for Advanced mode
 * - choose_date: Step 3 - Date picker value (for scheduling tasks)
 * - choose_time: Step 3 - Time picker value (for real-time tasks)
 * - budget: Step 4 - Numeric input for date path (scheduling)
 * - urgency: Step 4 - Dropdown selection for time path (real-time)
 */
export interface FormData {
  mode: 'Basic' | 'Advanced';
  topic: string;
  category: string;
  choose_date: string;
  choose_time: string;
  budget: number | undefined;
  urgency: string;
}

export interface Errors {
  [key: string]: string;
}

export interface SubmitResult {
  success: boolean;
  data?: {
    id: string;
  };
  error?: string;
}

export interface SubmitResponse {
  status: string;
  id: string;
}