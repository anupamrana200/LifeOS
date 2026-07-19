import { useCallback, useState } from 'react';

export const useAsyncAction = (action) => {
  const [error, setError] = useState(null);
  const [isLoading, setLoading] = useState(false);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      return await action(...args);
    } catch (actionError) {
      setError(actionError);
      throw actionError;
    } finally {
      setLoading(false);
    }
  }, [action]);

  return { error, execute, isLoading, reset: () => setError(null) };
};
