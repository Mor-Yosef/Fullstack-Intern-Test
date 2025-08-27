import styled from 'styled-components';

export const FormStep = styled.div`
  background: #f7fafc;
  border-radius: 12px;
  padding: 25px;
  border: 2px solid #e2e8f0;
  transition: all 0.3s ease;

  &:hover {
    border-color: #cbd5e0;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }
`;

export const StepTitle = styled.h2`
  color: #2d3748;
  margin-bottom: 20px;
  font-size: 1.5rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;

  &::before {
    content: '';
    width: 8px;
    height: 8px;
    background: #667eea;
    border-radius: 50%;
    display: inline-block;
  }
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const FormLabel = styled.label`
  font-weight: 600;
  color: #4a5568;
  font-size: 1rem;
  margin-bottom: 5px;
`;

export const FormInput = styled.input<{ hasError?: boolean }>`
  padding: 12px 16px;
  border: 2px solid ${props => props.hasError ? '#e53e3e' : '#e2e8f0'};
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
  color: #2d3748;

  &:focus {
    outline: none;
    border-color: ${props => props.hasError ? '#e53e3e' : '#667eea'};
    box-shadow: 0 0 0 3px ${props => props.hasError ? 'rgba(229, 62, 62, 0.1)' : 'rgba(102, 126, 234, 0.1)'};
  }

  &:hover {
    border-color: #cbd5e0;
  }
`;

export const FormSelect = styled.select<{ hasError?: boolean }>`
  padding: 12px 16px;
  border: 2px solid ${props => props.hasError ? '#e53e3e' : '#e2e8f0'};
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
  color: #2d3748;

  &:focus {
    outline: none;
    border-color: ${props => props.hasError ? '#e53e3e' : '#667eea'};
    box-shadow: 0 0 0 3px ${props => props.hasError ? 'rgba(229, 62, 62, 0.1)' : 'rgba(102, 126, 234, 0.1)'};
  }

  &:hover {
    border-color: #cbd5e0;
  }
`;

export const ErrorMessage = styled.span`
  color: #e53e3e;
  font-size: 0.875rem;
  margin-top: 5px;
  display: block;
`;

// New sliding switch components
export const SwitchContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 20px 0;
`;

export const SwitchLabels = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  font-size: 1rem;
  font-weight: 500;
  color: #4a5568;
`;

export const SwitchLabel = styled.span<{ isActive?: boolean }>`
  color: ${props => props.isActive ? '#667eea' : '#a0aec0'};
  font-weight: ${props => props.isActive ? '700' : '500'};
  transition: all 0.3s ease;
  font-size: 1.1rem;
  text-align: center;
  min-width: 80px;
`;

export const SwitchTrack = styled.label`
  position: relative;
  display: inline-block;
  width: 160px;
  height: 48px;
  background: #f7fafc;
  border-radius: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid #e2e8f0;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    border-color: #cbd5e0;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(102, 126, 234, 0.2);
  }

  &:active {
    transform: scale(0.98);
  }
`;

export const SwitchSlider = styled.div<{ isChecked: boolean }>`
  position: absolute;
  top: 2px;
  left: ${props => props.isChecked ? '114px' : '2px'};
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #ffffff 0%, #f7fafc 100%);
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 2;
  border: 1px solid #e2e8f0;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2), 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

export const SwitchInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
  position: absolute;
`;

export const SwitchBackground = styled.div<{ isChecked: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 24px;
  background: ${props => props.isChecked 
    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
    : 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e0 100%)'
  };
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
`;

export const SliderContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 10px 0;
`;

export const FormSlider = styled.input`
  flex: 1;
  height: 6px;
  border-radius: 3px;
  background: #e2e8f0;
  outline: none;
  -webkit-appearance: none;
  appearance: none;
  cursor: pointer;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #667eea;
    cursor: pointer;
    border: 2px solid white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #667eea;
    cursor: pointer;
    border: 2px solid white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  &:focus {
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.3);
  }
`;

export const SliderValue = styled.span`
  font-weight: 600;
  color: #667eea;
  font-size: 1.1rem;
  min-width: 80px;
  text-align: right;
`;

export const SubmitResultContainer = styled.div<{ isSuccess?: boolean }>`
  padding: 20px;
  border-radius: 8px;
  margin-top: 20px;
  text-align: center;
  background: ${props => props.isSuccess ? '#f0fff4' : '#fed7d7'};
  border: 2px solid ${props => props.isSuccess ? '#68d391' : '#fc8181'};
  color: ${props => props.isSuccess ? '#22543d' : '#742a2a'};

  h3 {
    margin-bottom: 10px;
    font-size: 1.2rem;
  }
`;