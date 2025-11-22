// Vercel serverless function for trend matrix
const { fetchDailyData } = require('../server/services/alphaVantage');
const { calculateTrendMatrix } = require('../server/logic/trendMatrix');

module.exports = async (req, res) => {
  try {
    const { symbol } = req.query;
    
    if (!symbol) {
      return res.status(400).json({
        error: 'Missing symbol parameter'
      });
    }

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
};
