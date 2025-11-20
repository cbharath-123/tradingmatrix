const express = require('express');
const router = express.Router();
const { fetchDailyData } = require('../services/alphaVantage');
const { calculateTrendMatrix } = require('../logic/trendMatrix');

/**
 * GET /api/trend-matrix/:symbol
 * Calculate multi-timeframe trend analysis for a stock symbol
 * 
 * Query Parameters:
 * - timeframes: Comma-separated list of timeframes (default: 15min,1hour,4hours,1day,1week)
 * - emaLength: EMA period (default: 50)
 * - rsiLength: RSI period (default: 14)
 * - adxThreshold: ADX threshold for strong trend (default: 25)
 * 
 * Example: /api/trend-matrix/AAPL?timeframes=1hour,1day,1week&emaLength=50
 */
router.get('/trend-matrix/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    
    // Parse query parameters
    const timeframesParam = req.query.timeframes || '15min,1hour,4hours,1day,1week';
    const timeframes = timeframesParam.split(',').map(tf => tf.trim());
    
    const settings = {
      emaLength: parseInt(req.query.emaLength) || 50,
      rsiLength: parseInt(req.query.rsiLength) || 14,
      macdFast: parseInt(req.query.macdFast) || 12,
      macdSlow: parseInt(req.query.macdSlow) || 26,
      macdSignal: parseInt(req.query.macdSignal) || 9,
      adxLength: parseInt(req.query.adxLength) || 14,
      adxThreshold: parseInt(req.query.adxThreshold) || 25,
      supertrendPeriod: parseInt(req.query.supertrendPeriod) || 10,
      supertrendMultiplier: parseFloat(req.query.supertrendMultiplier) || 3
    };

    console.log(`Fetching data for ${symbol}...`);
    
    // Fetch daily data from Alpha Vantage
    const dailyData = await fetchDailyData(symbol, 'full');
    
    console.log(`Received ${dailyData.length} data points for ${symbol}`);
    
    // Calculate trend matrix
    const trendMatrix = calculateTrendMatrix(dailyData, timeframes, settings);
    
    // Add metadata
    const response = {
      symbol: symbol.toUpperCase(),
      lastUpdated: new Date().toISOString(),
      dataPoints: dailyData.length,
      settings,
      ...trendMatrix
    };
    
    res.json(response);
    
  } catch (error) {
    console.error('Error in /api/trend-matrix:', error);
    res.status(500).json({
      error: 'Failed to calculate trend matrix',
      message: error.message
    });
  }
});

/**
 * GET /api/health
 * Health check endpoint
 */
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'TradeMatrix API',
    version: '1.0.0'
  });
});

/**
 * GET /api/symbols
 * Get list of supported stock symbols (placeholder)
 */
router.get('/symbols', (req, res) => {
  res.json({
    symbols: [
      { symbol: 'AAPL', name: 'Apple Inc.' },
      { symbol: 'MSFT', name: 'Microsoft Corporation' },
      { symbol: 'GOOGL', name: 'Alphabet Inc.' },
      { symbol: 'AMZN', name: 'Amazon.com Inc.' },
      { symbol: 'TSLA', name: 'Tesla Inc.' },
      { symbol: 'NVDA', name: 'NVIDIA Corporation' },
      { symbol: 'META', name: 'Meta Platforms Inc.' },
      { symbol: 'SPY', name: 'S&P 500 ETF' }
    ]
  });
});

module.exports = router;
