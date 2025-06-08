import { useState, useCallback } from 'react';

export function useApi(apiFunction) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const execute = useCallback(async (...args) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiFunction(...args);
      setData(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunction]);

  return {
    data,
    error,
    loading,
    execute
  };
}

// Example usage:
// const { data, error, loading, execute: login } = useApi(auth.login);
// await login({ email, password }); 