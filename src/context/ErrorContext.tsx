"use client";
import React, { createContext, useContext, useState } from "react";

// Define the context type
interface ErrorContextType {
  error: Error | null; // Holds the error object
  setError: (error: Error | null) => void;
  reset: () => void;
  endpoint?: string; // Optional endpoint property
  setEndpoint: (endpoint: string | undefined) => void;
}

// Create the context with undefined as default
const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

// Define the ErrorProvider component
export const ErrorProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [error, setError] = useState<Error | null>(null);
  const [endpoint, setEndpoint] = useState<string | undefined>(undefined);

  const reset = () => {
    setError(null);
    setEndpoint(undefined);
  };

  return (
    <ErrorContext.Provider
      value={{ error, setError, reset, endpoint, setEndpoint }}
    >
      {children}
    </ErrorContext.Provider>
  );
};

// Custom hook to use the Error context
export const useError = () => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error("useError must be used within an ErrorProvider");
  }
  return context;
};
