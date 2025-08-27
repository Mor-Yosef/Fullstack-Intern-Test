// Import the form hook that manages all form state
import { useForm } from './hooks/useForm';

// Import all the form step components
import { 
  ModeStep,           // Step 1: Choose Basic or Advanced
  TopicCategoryStep,  // Step 2: Topic or Category
  SchedulerStep,      // Step 3: Date or Time
  BudgetUrgencyStep,  // Step 4: Budget or Urgency
  SubmitResult        // Shows submission results
} from './components';

import { 
  GlobalStyle,           
  AppContainer,          
  Container,             
  Title,                 
  Form,                  
  SubmitButtonContainer, 
  SubmitButton,          
  HelpText               
} from './components/styled/AppComponents';

/**
 * Main App Component
 * 
 * This is a multi-step form where each step depends on the previous one.
 * The form uses a custom hook to manage all the state and logic.
 */
function App(): JSX.Element {
  const {
    formData,              
    errors,                
    isSubmitting,          
    submitResult,          
    handleInputChange,     
    handleSubmit,          
    shouldShowDatePicker,  
    shouldShowBudget,      
    isFormComplete         
  } = useForm();

  return (
    <>
      <GlobalStyle />
      
      <AppContainer>
        <Container>
          <Title>Chained Form</Title>
          
          <Form onSubmit={handleSubmit}>
            
            {/* Step 1: Choose mode (Basic or Advanced) */}
            <ModeStep 
              formData={formData} 
              errors={errors} 
              onInputChange={handleInputChange} 
            />

            {/* Step 2: Topic (Basic) or Category (Advanced) */}
            <TopicCategoryStep 
              formData={formData} 
              errors={errors} 
              onInputChange={handleInputChange} 
            />

            {/* Step 3: Date picker or Time picker */}
            <SchedulerStep
              formData={formData}
              errors={errors}
              shouldShowDatePicker={shouldShowDatePicker()}
              onInputChange={handleInputChange}
            />

            {/* Step 4: Budget (for dates) or Urgency (for times) */}
            <BudgetUrgencyStep
              formData={formData}
              errors={errors}
              shouldShowBudget={shouldShowBudget()}
              onInputChange={handleInputChange}
            />

            <SubmitButtonContainer>
              <SubmitButton
                type="submit"
                disabled={isSubmitting || !isFormComplete()}
                aria-describedby={!isFormComplete() ? "submit-help" : undefined}
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </SubmitButton>
              
              {!isFormComplete() && (
                <HelpText id="submit-help">
                  Please complete all required fields to submit the form
                </HelpText>
              )}
            </SubmitButtonContainer>

            <SubmitResult submitResult={submitResult} />
          </Form>
        </Container>
      </AppContainer>
    </>
  );
}

export default App;
