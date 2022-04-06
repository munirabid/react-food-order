import React, { useState, useCallback } from "react";

const useHttp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmited, setIsSubmited] = useState(false);

  const sendRequest = useCallback(async (resquestConfig, applyData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(resquestConfig.url, {
        method: resquestConfig.method ? resquestConfig.method : "GET",
        headers: resquestConfig.headers ? resquestConfig.headers : {},
        body: resquestConfig.body ? JSON.stringify(resquestConfig.body) : null,
      });

      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      const data = await response.json();

      applyData(data);
    } catch (error) {
      setError(error.message || "Something went wrong!!!");
    }

    setIsLoading(false);
    setIsSubmited(true);
  }, []);

  return {
    isLoading,
    error,
    sendRequest,
    isSubmited,
  };
};

export default useHttp;
