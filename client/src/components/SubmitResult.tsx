import React from 'react';
import { SubmitResult as SubmitResultType } from '../types';
import { SubmitResultContainer } from './styled/SharedComponents';

interface SubmitResultProps {
  submitResult: SubmitResultType | null;
}

export const SubmitResult: React.FC<SubmitResultProps> = ({ submitResult }) => {
  if (!submitResult) return null;

  return (
    <SubmitResultContainer isSuccess={submitResult.success}>
      {submitResult.success ? (
        <div>
          <h3>Success!</h3>
          <p>Form submitted successfully with ID: {submitResult.data?.id}</p>
        </div>
      ) : (
        <div>
          <h3>Error</h3>
          <p>{submitResult.error}</p>
        </div>
      )}
    </SubmitResultContainer>
  );
};