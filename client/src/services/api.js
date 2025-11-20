import axios from 'axios';

// Base URL for API - uses Vite proxy configuration
const API_BASE_URL = '/api';

/**
 * API Service for TradeMatrix Backend
 * Handles all HTTP requests to the Express API
 */

/**
 * Fetch trend matrix data for a stock symbol
 * @param {string} symbol - Stock ticker symbol (e.g., 'AAPL')
 * @param {Object} params - Optional query parameters
 * @returns {Promise} API response data
 */
export const getTrendMatrix = async (symbol, params = {}) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/trend-matrix/${symbol}`, {
      params: {
        timeframes: params.timeframes || '15min,1hour,4hours,1day,1week',
        emaLength: params.emaLength || 50,
        rsiLength: params.rsiLength || 14,
        macdFast: params.macdFast || 12,
        macdSlow: params.macdSlow || 26,
        macdSignal: params.macdSignal || 9,
        adxLength: params.adxLength || 14,
        adxThreshold: params.adxThreshold || 25,
        ...params
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching trend matrix:', error);
    throw {
      message: error.response?.data?.message || error.message || 'Failed to fetch trend matrix',
      status: error.response?.status || 500
    };
  }
};

/**
 * Check API health status
 * @returns {Promise} Health check response
 */
export const checkHealth = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/health`);
    return response.data;
  } catch (error) {
    console.error('Health check failed:', error);
    throw error;
  }
};

/**
 * Get list of supported symbols
 * @returns {Promise} Array of symbol objects
 */
export const getSymbols = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/symbols`);
    return response.data.symbols;
  } catch (error) {
    console.error('Error fetching symbols:', error);
    throw error;
  }
};

export default {
  getTrendMatrix,
  checkHealth,
  getSymbols
};
