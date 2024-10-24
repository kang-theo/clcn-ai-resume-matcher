import { useEffect, useState } from "react";
import axios, { CancelTokenSource } from "axios";
import { useError } from "@/context/ErrorContext";

const useFetch = (url: string) => {
  const { setError, setEndpoint } = useError(); // Get context methods
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [cancelTokenSource, setCancelTokenSource] =
    useState<CancelTokenSource | null>(null); // CancelToken source state

  useEffect(() => {
    const source = axios.CancelToken.source(); // Create a new CancelToken source
    setCancelTokenSource(source);

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(url, {
          cancelToken: source.token, // Pass the cancel token to axios
        });
        setData(response.data);
      } catch (error) {
        if (error instanceof Error) {
          // Manually abort when user leaves a page or presses cancel button while a request is ongoing
          if (axios.isCancel(error)) {
            console.log("Fetch aborted");
          } else {
            // Set error and endpoint for retry in context
            setError(error);
            setEndpoint(url);
          }
        } else {
          console.error("Unexpected error", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      source.cancel(); // Cleanup: cancel the request on component unmount or dependencies change
    };
  }, [url, setError, setEndpoint]);

  return { data, loading, cancelTokenSource };
};

export default useFetch;
