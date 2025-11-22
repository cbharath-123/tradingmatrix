const axios = require('axios');

/**
 * Alpha Vantage API Service
 * Handles all interactions with the Alpha Vantage financial data API
 * Documentation: https://www.alphavantage.co/documentation/
 */

const API_KEY = process.env.ALPHA_VANTAGE_API_KEY;
const BASE_URL = 'https://www.alphavantage.co/query';

/**
 * Fetch daily time series data for a stock symbol
 * @param {string} symbol - Stock ticker symbol (e.g., 'AAPL', 'MSFT')
 * @param {string} outputSize - 'compact' (100 data points) or 'full' (20+ years)
 * @returns {Promise<Array>} Array of OHLCV data objects sorted by date (newest first)
 */
async function fetchDailyData(symbol, outputSize = 'compact') {
  try {
    if (!API_KEY) {
      throw new Error('ALPHA_VANTAGE_API_KEY is not set in environment variables');
    }

    const response = await axios.get(BASE_URL, {
      params: {
        function: 'TIME_SERIES_DAILY',
        symbol: symbol.toUpperCase(),
        apikey: API_KEY,
        outputsize: outputSize
      }
    });

    // Check for API errors
    if (response.data['Error Message']) {
      throw new Error(`Alpha Vantage API Error: ${response.data['Error Message']}`);
    }

    if (response.data['Note']) {
      throw new Error('API call frequency limit reached. Please wait and try again.');
    }

    if (response.data['Information']) {
      throw new Error(`API Limit: ${response.data['Information']}`);
    }

    const timeSeries = response.data['Time Series (Daily)'];
    
    if (!timeSeries) {
      console.error('Alpha Vantage Response:', JSON.stringify(response.data, null, 2));
      throw new Error(`No data found for symbol: ${symbol}. API Response: ${JSON.stringify(response.data).substring(0, 200)}`);
    }

    // Convert the time series object into an array of OHLCV objects
    const dataArray = Object.keys(timeSeries).map(date => ({
      date: date,
      timestamp: new Date(date).getTime(),
      open: parseFloat(timeSeries[date]['1. open']),
      high: parseFloat(timeSeries[date]['2. high']),
      low: parseFloat(timeSeries[date]['3. low']),
      close: parseFloat(timeSeries[date]['4. close']),
      volume: parseInt(timeSeries[date]['5. volume'])
    }));

    // Sort by date (newest first)
    dataArray.sort((a, b) => b.timestamp - a.timestamp);

    return dataArray;

  } catch (error) {
    if (error.response) {
      // API returned an error response
      console.error('Alpha Vantage API Error:', error.response.data);
      throw new Error(`API request failed: ${error.response.status}`);
    } else if (error.request) {
      // Request was made but no response received
      console.error('Network Error:', error.message);
      throw new Error('Failed to connect to Alpha Vantage API');
    } else {
      // Something else went wrong
      console.error('Error:', error.message);
      throw error;
    }
  }
}

/**
 * Fetch intraday data (for shorter timeframes like 15min, 1hour)
 * @param {string} symbol - Stock ticker symbol
 * @param {string} interval - '1min', '5min', '15min', '30min', '60min'
 * @param {string} outputSize - 'compact' or 'full'
 * @returns {Promise<Array>} Array of OHLCV data objects
 */
async function fetchIntradayData(symbol, interval = '15min', outputSize = 'compact') {
  try {
    if (!API_KEY) {
      throw new Error('ALPHA_VANTAGE_API_KEY is not set in environment variables');
    }

    const response = await axios.get(BASE_URL, {
      params: {
        function: 'TIME_SERIES_INTRADAY',
        symbol: symbol.toUpperCase(),
        interval: interval,
        apikey: API_KEY,
        outputsize: outputSize
      }
    });

    // Check for API errors
    if (response.data['Error Message']) {
      throw new Error(`Alpha Vantage API Error: ${response.data['Error Message']}`);
    }

    if (response.data['Note']) {
      throw new Error('API call frequency limit reached. Please wait and try again.');
    }

    const timeSeries = response.data[`Time Series (${interval})`];
    
    if (!timeSeries) {
      throw new Error(`No intraday data found for symbol: ${symbol}`);
    }

    // Convert to array format
    const dataArray = Object.keys(timeSeries).map(datetime => ({
      date: datetime,
      timestamp: new Date(datetime).getTime(),
      open: parseFloat(timeSeries[datetime]['1. open']),
      high: parseFloat(timeSeries[datetime]['2. high']),
      low: parseFloat(timeSeries[datetime]['3. low']),
      close: parseFloat(timeSeries[datetime]['4. close']),
      volume: parseInt(timeSeries[datetime]['5. volume'])
    }));

    // Sort by timestamp (newest first)
    dataArray.sort((a, b) => b.timestamp - a.timestamp);

    return dataArray;

  } catch (error) {
    console.error('Intraday data fetch error:', error.message);
    throw error;
  }
}

module.exports = {
  fetchDailyData,
  fetchIntradayData
};
