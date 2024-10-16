import { useEffect, useState } from "react";
import { useError } from "@/context/ErrorContext";

const useFetch = (url: string) => {
  const { setError, setEndpoint } = useError(); // Get context methods
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const result = await response.json();
        setData(result);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error);
        } else {
          setError(new Error("An unknown error occurred")); // Fallback error
        }
        setEndpoint(url); // Set endpoint in context for retry
      } finally {
        setLoading(false); // Loading is complete
      }
    };

    fetchData();
  }, [url, setError, setEndpoint]);

  return { data, loading, error: null }; // Returning error as null because it is managed in context
};

export default useFetch;
