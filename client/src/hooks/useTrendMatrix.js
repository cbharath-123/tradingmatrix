import { useState, useEffect, useCallback } from 'react';
import { getTrendMatrix } from '../services/api';

/**
 * Custom hook for fetching and managing trend matrix data
 * @param {string} symbol - Stock symbol to analyze
 * @param {Object} settings - Optional indicator settings
 * @returns {Object} { data, loading, error, refetch }
 */
export const useTrendMatrix = (symbol, settings = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!symbol) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await getTrendMatrix(symbol, settings);
      setData(response);
      
    } catch (err) {
      setError(err.message || 'Failed to fetch data');
      console.error('Error in useTrendMatrix:', err);
    } finally {
      setLoading(false);
    }
  }, [symbol, JSON.stringify(settings)]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
};

export default useTrendMatrix;
