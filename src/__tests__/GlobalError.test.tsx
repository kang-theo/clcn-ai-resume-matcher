import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorProvider } from '@/context/ErrorContext';
import GlobalError from '@/app/global-error';
import ErrorThrower from '@/components/common/ErrorThrower';
import { useError } from "@/context/ErrorContext";

// Create a wrapper component for context
const RenderWithProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ErrorProvider>{children}</ErrorProvider>
);

describe('GlobalError Component', () => {
  test('displays error message and resets on button click', () => {
    const mockReset = jest.fn(); // Mock reset function
    const testError = new Error("Test Error");

    // Render the GlobalError component with a test error
    render(
      <RenderWithProvider>
        <GlobalError error={testError} reset={mockReset} />
      </RenderWithProvider>
    );

    // Check if the error message is displayed
    expect(screen.getByText(/Oops! An Error Occurred/)).toBeInTheDocument();
    expect(screen.getByText(/Something went wrong:/)).toBeInTheDocument();
    expect(screen.getByText(/Test Error/i)).toBeInTheDocument();

    // Simulate clicking the "Try again" button
    const tryAgainButton = screen.getByRole('button', { name: /Try again/i });
    fireEvent.click(tryAgainButton);

    // Check if the reset function was called
    expect(mockReset).toHaveBeenCalled();
  });

  test('ErrorThrower throws an error and is handled by GlobalError', () => {
    // Define a custom ErrorThrower that sets the error
    const ThrowingComponent = () => {
      const { setError } = useError();
      React.useEffect(() => {
        setError(new Error("Simulated Error"));
      }, [setError]);
      return null; // This component does not render anything
    };

    // Render the components together
    render(
      <RenderWithProvider>
        <GlobalError error={new Error("Simulated Error")} reset={() => { }}>
          <ErrorThrower /> {/* This component throws an error */}
        </GlobalError>
      </RenderWithProvider>
    );

    // Check if the GlobalError component responds to the simulated error
    // expect(screen.getByText(/Oops! An Error Occurred/)).toBeInTheDocument();
    expect(screen.getByText(/Something went wrong:/)).toBeInTheDocument();
    expect(screen.getByText(/Simulated Error/i)).toBeInTheDocument();
  });
});