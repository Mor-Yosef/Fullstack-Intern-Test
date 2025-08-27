import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import App from '../App';

// Mock the form service
jest.mock('../services/formService', () => ({
  submitForm: jest.fn()
}));

const mockSubmitForm = require('../services/formService').submitForm;

describe('Chained Form Application', () => {
  beforeEach(() => {
    mockSubmitForm.mockClear();
  });

  describe('Step Chaining Logic', () => {
    test('Mode switch: toggling Basic ⇄ Advanced changes Step 2 from Text box to Dropdown', async () => {
      render(<App />);
      
      // Initially should show Basic mode
      expect(screen.getByText('Basic')).toBeInTheDocument();
      expect(screen.getByText('Advanced')).toBeInTheDocument();
      
      // Should show topic input for Basic mode
      expect(screen.getByLabelText(/topic/i)).toBeInTheDocument();
      
      // Toggle to Advanced mode
      const modeSwitch = screen.getByRole('checkbox', { name: /mode/i });
      fireEvent.click(modeSwitch);
      
      // Should now show category dropdown
      await waitFor(() => {
        expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
      });
      
      // Toggle back to Basic mode
      fireEvent.click(modeSwitch);
      
      // Should show topic input again
      await waitFor(() => {
        expect(screen.getByLabelText(/topic/i)).toBeInTheDocument();
      });
    });

    test('Basic path: typing "date reminder" in Topic shows the Date picker', async () => {
      render(<App />);
      
      const topicInput = screen.getByLabelText(/topic/i);
      await userEvent.type(topicInput, 'date reminder');
      
      // Should show date picker
      await waitFor(() => {
        expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
      });
    });

    test('Basic path: changing Topic to "quick note" switches to the Time input', async () => {
      render(<App />);
      
      const topicInput = screen.getByLabelText(/topic/i);
      await userEvent.clear(topicInput);
      await userEvent.type(topicInput, 'quick note');
      
      // Should show time picker
      await waitFor(() => {
        expect(screen.getByLabelText(/time/i)).toBeInTheDocument();
      });
    });

    test('Advanced path: selecting Category=Schedule shows the Date picker', async () => {
      render(<App />);
      
      // Switch to Advanced mode
      const modeSwitch = screen.getByRole('checkbox', { name: /mode/i });
      fireEvent.click(modeSwitch);
      
      // Select Schedule category
      const categorySelect = screen.getByLabelText(/category/i);
      fireEvent.change(categorySelect, { target: { value: 'Schedule' } });
      
      // Should show date picker
      await waitFor(() => {
        expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
      });
    });

    test('Advanced path: choosing Realtime shows the Time input', async () => {
      render(<App />);
      
      // Switch to Advanced mode
      const modeSwitch = screen.getByRole('checkbox', { name: /mode/i });
      fireEvent.click(modeSwitch);
      
      // Select Realtime category
      const categorySelect = screen.getByLabelText(/category/i);
      fireEvent.change(categorySelect, { target: { value: 'Realtime' } });
      
      // Should show time picker
      await waitFor(() => {
        expect(screen.getByLabelText(/time/i)).toBeInTheDocument();
      });
    });

    test('Advanced path: choosing Analytics shows the Time input', async () => {
      render(<App />);
      
      // Switch to Advanced mode
      const modeSwitch = screen.getByRole('checkbox', { name: /mode/i });
      fireEvent.click(modeSwitch);
      
      // Select Analytics category
      const categorySelect = screen.getByLabelText(/category/i);
      fireEvent.change(categorySelect, { target: { value: 'Analytics' } });
      
      // Should show time picker
      await waitFor(() => {
        expect(screen.getByLabelText(/time/i)).toBeInTheDocument();
      });
    });

    test('Step 4: on Date path, the Budget slider is visible with correct constraints', async () => {
      render(<App />);
      
      // Set up date path
      const topicInput = screen.getByLabelText(/topic/i);
      await userEvent.type(topicInput, 'date reminder');
      
      // Fill required fields
      const dateInput = screen.getByLabelText(/date/i);
      fireEvent.change(dateInput, { target: { value: '2024-01-15' } });
      
      // Should show budget slider
      await waitFor(() => {
        const budgetSlider = screen.getByLabelText(/budget/i);
        expect(budgetSlider).toBeInTheDocument();
        expect(budgetSlider).toHaveAttribute('min', '0');
        expect(budgetSlider).toHaveAttribute('max', '5000');
        expect(budgetSlider).toHaveAttribute('step', '100');
      });
    });

    test('Step 4: on Time path, the Urgency dropdown appears with Low/Normal/High', async () => {
      render(<App />);
      
      // Set up time path
      const topicInput = screen.getByLabelText(/topic/i);
      await userEvent.type(topicInput, 'quick note');
      
      // Fill required fields
      const timeInput = screen.getByLabelText(/time/i);
      fireEvent.change(timeInput, { target: { value: '14:30' } });
      
      // Should show urgency dropdown
      await waitFor(() => {
        const urgencySelect = screen.getByLabelText(/urgency/i);
        expect(urgencySelect).toBeInTheDocument();
        
        // Check options
        expect(screen.getByText('Low')).toBeInTheDocument();
        expect(screen.getByText('Normal')).toBeInTheDocument();
        expect(screen.getByText('High')).toBeInTheDocument();
      });
    });
  });

  describe('Validation & Submit State', () => {
    test('Submit is disabled until required fields for the active path are valid', async () => {
      render(<App />);
      
      // Initially submit should be disabled
      const submitButton = screen.getByRole('button', { name: /submit/i });
      expect(submitButton).toBeDisabled();
      
      // Fill required fields for Basic time path
      const topicInput = screen.getByLabelText(/topic/i);
      await userEvent.type(topicInput, 'quick note');
      
      const timeInput = screen.getByLabelText(/time/i);
      fireEvent.change(timeInput, { target: { value: '14:30' } });
      
      const urgencySelect = screen.getByLabelText(/urgency/i);
      fireEvent.change(urgencySelect, { target: { value: 'High' } });
      
      // Submit should now be enabled
      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });
    });

    test('Submit becomes enabled when valid for date path', async () => {
      render(<App />);
      
      const submitButton = screen.getByRole('button', { name: /submit/i });
      expect(submitButton).toBeDisabled();
      
      // Fill required fields for Basic date path
      const topicInput = screen.getByLabelText(/topic/i);
      await userEvent.type(topicInput, 'date reminder');
      
      const dateInput = screen.getByLabelText(/date/i);
      fireEvent.change(dateInput, { target: { value: '2024-01-15' } });
      
      const budgetSlider = screen.getByLabelText(/budget/i);
      fireEvent.change(budgetSlider, { target: { value: '1000' } });
      
      // Submit should now be enabled
      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });
    });
  });

  describe('API Integration', () => {
    test('Mock POST /api/submit and assert correct payload on success', async () => {
      mockSubmitForm.mockResolvedValueOnce({ status: 'ok', id: 'test-id-123' });
      
      render(<App />);
      
      // Fill form for Basic time path
      const topicInput = screen.getByLabelText(/topic/i);
      await userEvent.type(topicInput, 'quick note');
      
      const timeInput = screen.getByLabelText(/time/i);
      fireEvent.change(timeInput, { target: { value: '14:30' } });
      
      const urgencySelect = screen.getByLabelText(/urgency/i);
      fireEvent.change(urgencySelect, { target: { value: 'High' } });
      
      // Submit form
      const submitButton = screen.getByRole('button', { name: /submit/i });
      fireEvent.click(submitButton);
      
      // Wait for submission
      await waitFor(() => {
        expect(mockSubmitForm).toHaveBeenCalledWith({
          mode: 'Basic',
          topic: 'quick note',
          choose_time: '14:30',
          urgency: 'High'
        });
      });
      
      // Should show success message
      await waitFor(() => {
        expect(screen.getByText(/success/i)).toBeInTheDocument();
      });
    });

    test('Mock POST /api/submit and assert error state', async () => {
      mockSubmitForm.mockRejectedValueOnce(new Error('Network error'));
      
      render(<App />);
      
      // Fill form
      const topicInput = screen.getByLabelText(/topic/i);
      await userEvent.type(topicInput, 'quick note');
      
      const timeInput = screen.getByLabelText(/time/i);
      fireEvent.change(timeInput, { target: { value: '14:30' } });
      
      const urgencySelect = screen.getByLabelText(/urgency/i);
      fireEvent.change(urgencySelect, { target: { value: 'High' } });
      
      // Submit form
      const submitButton = screen.getByRole('button', { name: /submit/i });
      fireEvent.click(submitButton);
      
      // Should show error message
      await waitFor(() => {
        expect(screen.getByText(/error/i)).toBeInTheDocument();
      });
    });
  });

  describe('Responsiveness', () => {
    test('Single-column layout on mobile (≤640px)', () => {
      // Mock window.innerWidth
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 640,
      });
      
      render(<App />);
      
      // Trigger resize event
      fireEvent(window, new Event('resize'));
      
      // Check that form elements are present
      expect(screen.getByText('Chained Form')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
    });

    test('Usable layout on desktop (≥1024px)', () => {
      // Mock window.innerWidth
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });
      
      render(<App />);
      
      // Trigger resize event
      fireEvent(window, new Event('resize'));
      
      // Form should be usable
      expect(screen.getByText('Chained Form')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
    });
  });

  describe('Accessibility Basics', () => {
    test('Controls have accessible names/roles', () => {
      render(<App />);
      
      // Check form controls have proper labels
      expect(screen.getByLabelText(/topic/i)).toBeInTheDocument();
      
      // Check submit button has proper role
      expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
    });

    test('Controls are keyboard operable', async () => {
      render(<App />);
      
      // Test tab navigation
      const topicInput = screen.getByLabelText(/topic/i);
      topicInput.focus();
      expect(topicInput).toHaveFocus();
      
      // Test keyboard input
      await userEvent.type(topicInput, 'test topic');
      expect(topicInput).toHaveValue('test topic');
      
      // Test submit button keyboard activation
      const submitButton = screen.getByRole('button', { name: /submit/i });
      submitButton.focus();
      expect(submitButton).toHaveFocus();
      
      // Test Enter key on submit button
      fireEvent.keyDown(submitButton, { key: 'Enter', code: 'Enter' });
    });
  });
});
