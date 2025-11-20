/**
 * Data Resampling Utilities
 * Convert time series data between different timeframes
 */

/**
 * Resample daily data to weekly data
 * Combines 5 trading days into 1 weekly candle
 * 
 * @param {Array} dailyData - Array of daily OHLCV objects, sorted newest first
 * @returns {Array} Array of weekly OHLCV objects
 */
function resampleToWeekly(dailyData) {
  if (!dailyData || dailyData.length === 0) return [];
  
  // Sort oldest first for processing
  const sortedData = [...dailyData].reverse();
  const weeklyData = [];
  
  let weekCandle = null;
  
  sortedData.forEach((day, index) => {
    const date = new Date(day.date);
    const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, ..., 5 = Friday
    
    if (!weekCandle) {
      // Start a new week
      weekCandle = {
        date: day.date,
        timestamp: day.timestamp,
        open: day.open,
        high: day.high,
        low: day.low,
        close: day.close,
        volume: day.volume
      };
    } else {
      // Update the week candle
      weekCandle.high = Math.max(weekCandle.high, day.high);
      weekCandle.low = Math.min(weekCandle.low, day.low);
      weekCandle.close = day.close; // Latest close
      weekCandle.volume += day.volume;
      weekCandle.date = day.date; // Update to latest date
      weekCandle.timestamp = day.timestamp;
    }
    
    // End of week (Friday) or last data point
    if (dayOfWeek === 5 || index === sortedData.length - 1) {
      weeklyData.push(weekCandle);
      weekCandle = null;
    }
  });
  
  // Return sorted newest first
  return weeklyData.reverse();
}

/**
 * Resample daily data to 4-hour data
 * Note: This is a simplified version since we don't have true intraday data
 * In production, you'd use actual 4-hour candles from the API
 * 
 * @param {Array} dailyData - Array of daily OHLCV objects
 * @returns {Array} Array of 4-hour approximated OHLCV objects
 */
function resampleTo4Hour(dailyData) {
  if (!dailyData || dailyData.length === 0) return [];
  
  // For simplicity, split each daily candle into multiple 4-hour periods
  // This is an approximation - in production, use real 4-hour data
  const fourHourData = [];
  
  dailyData.forEach(day => {
    // Create 6 4-hour candles per day (24 hours / 4 = 6)
    // Note: This is synthetic data for demonstration
    for (let i = 0; i < 6; i++) {
      const date = new Date(day.timestamp);
      date.setHours(i * 4);
      
      fourHourData.push({
        date: date.toISOString(),
        timestamp: date.getTime(),
        open: day.open + (Math.random() - 0.5) * (day.high - day.low) * 0.1,
        high: day.high * (0.95 + Math.random() * 0.05),
        low: day.low * (1 - Math.random() * 0.05),
        close: day.close + (Math.random() - 0.5) * (day.high - day.low) * 0.1,
        volume: day.volume / 6
      });
    }
  });
  
  return fourHourData.sort((a, b) => b.timestamp - a.timestamp);
}

/**
 * Resample daily data to hourly data
 * Similar approximation as 4-hour resampling
 * 
 * @param {Array} dailyData - Array of daily OHLCV objects
 * @returns {Array} Array of hourly approximated OHLCV objects
 */
function resampleToHourly(dailyData) {
  if (!dailyData || dailyData.length === 0) return [];
  
  const hourlyData = [];
  
  dailyData.forEach(day => {
    // Create 24 hourly candles per day
    for (let i = 0; i < 24; i++) {
      const date = new Date(day.timestamp);
      date.setHours(i);
      
      hourlyData.push({
        date: date.toISOString(),
        timestamp: date.getTime(),
        open: day.open + (Math.random() - 0.5) * (day.high - day.low) * 0.05,
        high: day.high * (0.97 + Math.random() * 0.03),
        low: day.low * (1 - Math.random() * 0.03),
        close: day.close + (Math.random() - 0.5) * (day.high - day.low) * 0.05,
        volume: day.volume / 24
      });
    }
  });
  
  return hourlyData.sort((a, b) => b.timestamp - a.timestamp);
}

/**
 * Resample daily data to 15-minute data
 * Approximation for demonstration purposes
 * 
 * @param {Array} dailyData - Array of daily OHLCV objects
 * @returns {Array} Array of 15-minute approximated OHLCV objects
 */
function resampleTo15Min(dailyData) {
  if (!dailyData || dailyData.length === 0) return [];
  
  const data15min = [];
  
  dailyData.slice(0, 5).forEach(day => { // Only last 5 days to avoid too much data
    // Create 96 15-minute candles per day (24 hours * 4)
    for (let i = 0; i < 96; i++) {
      const date = new Date(day.timestamp);
      date.setHours(Math.floor(i / 4));
      date.setMinutes((i % 4) * 15);
      
      data15min.push({
        date: date.toISOString(),
        timestamp: date.getTime(),
        open: day.open + (Math.random() - 0.5) * (day.high - day.low) * 0.02,
        high: day.high * (0.99 + Math.random() * 0.01),
        low: day.low * (1 - Math.random() * 0.01),
        close: day.close + (Math.random() - 0.5) * (day.high - day.low) * 0.02,
        volume: day.volume / 96
      });
    }
  });
  
  return data15min.sort((a, b) => b.timestamp - a.timestamp);
}

/**
 * Get data for specific timeframe
 * Routes to appropriate resampling function
 * 
 * @param {Array} dailyData - Base daily data
 * @param {string} timeframe - '15min', '1hour', '4hours', '1day', '1week'
 * @returns {Array} Resampled data for requested timeframe
 */
function getTimeframeData(dailyData, timeframe) {
  switch (timeframe.toLowerCase()) {
    case '15min':
    case '15m':
      return resampleTo15Min(dailyData);
    
    case '1hour':
    case '1h':
      return resampleToHourly(dailyData);
    
    case '4hours':
    case '4h':
      return resampleTo4Hour(dailyData);
    
    case '1day':
    case '1d':
      return dailyData; // Already daily
    
    case '1week':
    case '1w':
      return resampleToWeekly(dailyData);
    
    default:
      return dailyData;
  }
}

module.exports = {
  resampleToWeekly,
  resampleTo4Hour,
  resampleToHourly,
  resampleTo15Min,
  getTimeframeData
};
