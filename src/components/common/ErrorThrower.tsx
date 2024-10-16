import React, { useState } from 'react';
import { useError } from '@/context/ErrorContext';

interface ErrorThrowerProps {
  defaultMessage?: string; // Optional default message
}

const ErrorThrower: React.FC<ErrorThrowerProps> = ({ defaultMessage = "Default Error Message" }) => {
  const { setError } = useError();
  const [errorMessage, setErrorMessage] = useState(defaultMessage);

  const handleThrowError = () => {
    // Trigger an error when the button is clicked
    setError(new Error(errorMessage));
  };

  return (
    <div>
      <h2>Error Thrower</h2>
      <input
        type="text"
        value={errorMessage}
        onChange={(e) => setErrorMessage(e.target.value)}
        placeholder="Enter error message"
      />
      <button onClick={handleThrowError}>Throw Error</button>
    </div>
  );
};

export default ErrorThrower;
