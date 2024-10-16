"use client"; // This component needs to be a Client Component

import React from "react";
import { useError } from "../context/ErrorContext";

interface GlobalErrorProps {
  error?: Error & { digest?: string };
  reset?: () => void;
  children?: React.ReactNode;
}

const GlobalError: React.FC<GlobalErrorProps> = ({ error: propError, reset: propReset, children }) => {
  const { error: contextError, reset: contextReset, endpoint } = useError();

  // Use prop error if provided, otherwise fallback to the context error
  const error = propError || contextError;
  const reset = propReset || contextReset;

  const handleRetry = async () => {
    reset(); // Reset the error state
    if (endpoint) {
      console.log("Retrying fetch from:", endpoint);
      // Call your fetch function again with the endpoint
      // Example: await fetchData(endpoint);
    }
  };

  const renderErrorMessage = () => {
    if (!error) return null;
    console.log("1---" + error.message)

    if (error.message.includes("Network Error")) {
      return (
        <>
          <p>Network error occurred. Please check your connection.</p>
          <button onClick={handleRetry}>Retry Connection</button>
        </>
      );
    } else if (error.message.includes("Unauthorized")) {
      return (
        <>
          <p>Authentication error. Please log in to continue.</p>
          <button onClick={() => (window.location.href = "/signin")}>
            Go to Sign In
          </button>
        </>
      );
    } else if (error.message.includes("Server Error")) {
      return (
        <>
          <p>Server error occurred. Please try again later.</p>
          <button onClick={handleRetry}>Try Again</button>
        </>
      );
    } else if (error.message.includes("404")) {
      return (
        <>
          <p>Page not found.</p>
          <button onClick={() => (window.location.href = "/")}>Go Home</button>
        </>
      );
    } else {
      return (
        <>
          <p>Something went wrong: {error.message}</p>
          <button onClick={handleRetry}>Try Again</button>
        </>
      );
    }
  };

  return (
    // <html>
    //   <body>
    <>
      <h2>Oops! An Error Occurred</h2>
      {renderErrorMessage()}
    </>
    //   </body>
    // </html>
  );
};

export default GlobalError;
