import { useEffect, useState } from "react";
import { useError } from "@/context/ErrorContext";

const useFetch = (url: string) => {
  const { setError, setEndpoint } = useError(); // Get context methods
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [abortController, setAbortController] =
    useState<AbortController | null>(null); // AbortController state

  useEffect(() => {
    const controller = new AbortController();
    setAbortController(controller); // Store the controller in state

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(url, { signal: controller.signal }); // Pass the signal to fetch
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        if (error instanceof Error) {
          // Manually abort when user leaves a page or presses cancel button while a request is ongoing
          if (error.name === "AbortError") {
            console.log("Fetch aborted");
          } else {
            setError(error); // Set error in context
            setEndpoint(url); // Set endpoint in context for retry
          }
        } else {
          console.error("Unexpected error", error);
        }
      } finally {
        setLoading(false); // Set loading to false
      }
    };

    fetchData();

    return () => {
      controller.abort(); // Cleanup: abort fetch on component unmount, or dependencies changed
    };
  }, [url, setError, setEndpoint]);

  return { data, loading, abortController }; // Return abortController if needed
};

export default useFetch;
