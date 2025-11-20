/**
 * Technical Indicator Calculation Engine
 * Translates Pine Script trading logic into JavaScript
 * All functions take OHLCV data arrays and return indicator values
 */

/**
 * Calculate Exponential Moving Average (EMA)
 * 
 * Formula:
 * - Multiplier = 2 / (period + 1)
 * - EMA(today) = (Close(today) * Multiplier) + (EMA(yesterday) * (1 - Multiplier))
 * 
 * The EMA gives more weight to recent prices, making it more responsive than SMA.
 * 
 * @param {Array} data - Array of OHLCV objects with 'close' property, sorted newest first
 * @param {number} period - Number of periods for EMA calculation (e.g., 50, 200)
 * @returns {Array} Array of EMA values (null for periods before calculation is possible)
 */
function calculateEMA(data, period) {
  if (!data || data.length < period) {
    return Array(data?.length || 0).fill(null);
  }

  const emaValues = [];
  const multiplier = 2 / (period + 1);
  
  // Reverse array to calculate from oldest to newest
  const reversedData = [...data].reverse();
  
  // Calculate initial SMA for the first EMA value
  let sum = 0;
  for (let i = 0; i < period; i++) {
    sum += reversedData[i].close;
    emaValues.push(null);
  }
  const initialEMA = sum / period;
  emaValues[period - 1] = initialEMA;
  
  // Calculate EMA for remaining periods
  for (let i = period; i < reversedData.length; i++) {
    const ema = (reversedData[i].close * multiplier) + (emaValues[i - 1] * (1 - multiplier));
    emaValues.push(ema);
  }
  
  // Reverse back to match input order (newest first)
  return emaValues.reverse();
}

/**
 * Calculate Relative Strength Index (RSI)
 * 
 * Formula:
 * 1. Calculate price changes (gains and losses)
 * 2. Average Gain = Sum of gains over period / period
 * 3. Average Loss = Sum of losses over period / period
 * 4. RS (Relative Strength) = Average Gain / Average Loss
 * 5. RSI = 100 - (100 / (1 + RS))
 * 
 * RSI ranges from 0 to 100:
 * - Above 70: Overbought (potential sell signal)
 * - Below 30: Oversold (potential buy signal)
 * 
 * @param {Array} data - Array of OHLCV objects, sorted newest first
 * @param {number} period - RSI period (typically 14)
 * @returns {Array} Array of RSI values (0-100)
 */
function calculateRSI(data, period = 14) {
  if (!data || data.length < period + 1) {
    return Array(data?.length || 0).fill(null);
  }

  const rsiValues = [];
  const reversedData = [...data].reverse();
  
  // Calculate price changes
  const changes = [];
  for (let i = 1; i < reversedData.length; i++) {
    changes.push(reversedData[i].close - reversedData[i - 1].close);
  }
  
  // First RSI calculation uses simple average
  let avgGain = 0;
  let avgLoss = 0;
  
  for (let i = 0; i < period; i++) {
    if (changes[i] > 0) {
      avgGain += changes[i];
    } else {
      avgLoss += Math.abs(changes[i]);
    }
    rsiValues.push(null);
  }
  
  avgGain /= period;
  avgLoss /= period;
  
  // Calculate first RSI
  const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
  const rsi = 100 - (100 / (1 + rs));
  rsiValues.push(rsi);
  
  // Calculate subsequent RSI values using smoothed averages
  for (let i = period; i < changes.length; i++) {
    const change = changes[i];
    const gain = change > 0 ? change : 0;
    const loss = change < 0 ? Math.abs(change) : 0;
    
    avgGain = ((avgGain * (period - 1)) + gain) / period;
    avgLoss = ((avgLoss * (period - 1)) + loss) / period;
    
    const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    const rsi = 100 - (100 / (1 + rs));
    rsiValues.push(rsi);
  }
  
  // Reverse back to match input order (newest first)
  return rsiValues.reverse();
}

/**
 * Calculate MACD (Moving Average Convergence Divergence)
 * 
 * Formula:
 * 1. MACD Line = 12-period EMA - 26-period EMA
 * 2. Signal Line = 9-period EMA of MACD Line
 * 3. Histogram = MACD Line - Signal Line
 * 
 * Interpretation:
 * - MACD crosses above Signal: Bullish signal
 * - MACD crosses below Signal: Bearish signal
 * - Histogram shows momentum strength
 * 
 * @param {Array} data - Array of OHLCV objects, sorted newest first
 * @param {number} fastPeriod - Fast EMA period (default 12)
 * @param {number} slowPeriod - Slow EMA period (default 26)
 * @param {number} signalPeriod - Signal line EMA period (default 9)
 * @returns {Object} { macd: Array, signal: Array, histogram: Array }
 */
function calculateMACD(data, fastPeriod = 12, slowPeriod = 26, signalPeriod = 9) {
  if (!data || data.length < slowPeriod + signalPeriod) {
    const nullArray = Array(data?.length || 0).fill(null);
    return {
      macd: nullArray,
      signal: nullArray,
      histogram: nullArray
    };
  }

  // Calculate fast and slow EMAs
  const fastEMA = calculateEMA(data, fastPeriod);
  const slowEMA = calculateEMA(data, slowPeriod);
  
  // Calculate MACD line (fast EMA - slow EMA)
  const macdLine = fastEMA.map((fast, i) => {
    if (fast === null || slowEMA[i] === null) return null;
    return fast - slowEMA[i];
  });
  
  // Calculate signal line (EMA of MACD line)
  // Need to convert MACD array to data format for EMA calculation
  const macdData = macdLine.map((value, i) => ({
    close: value !== null ? value : 0,
    date: data[i].date
  }));
  
  const signalLine = calculateEMA(macdData, signalPeriod);
  
  // Calculate histogram (MACD - Signal)
  const histogram = macdLine.map((macd, i) => {
    if (macd === null || signalLine[i] === null) return null;
    return macd - signalLine[i];
  });
  
  return {
    macd: macdLine,
    signal: signalLine,
    histogram: histogram
  };
}

/**
 * Calculate Average Directional Index (ADX)
 * 
 * Formula (simplified):
 * 1. Calculate +DM (Positive Directional Movement) and -DM (Negative Directional Movement)
 * 2. Calculate True Range (TR)
 * 3. Smooth +DM, -DM, and TR over period
 * 4. Calculate +DI = (+DM / TR) * 100 and -DI = (-DM / TR) * 100
 * 5. Calculate DX = (|+DI - -DI| / |+DI + -DI|) * 100
 * 6. ADX = EMA of DX over period
 * 
 * Interpretation:
 * - ADX < 20: Weak trend
 * - ADX 20-25: Emerging trend
 * - ADX 25-50: Strong trend
 * - ADX > 50: Very strong trend
 * 
 * @param {Array} data - Array of OHLCV objects, sorted newest first
 * @param {number} period - ADX period (typically 14)
 * @returns {Object} { adx: Array, plusDI: Array, minusDI: Array }
 */
function calculateADX(data, period = 14) {
  if (!data || data.length < period * 2) {
    const nullArray = Array(data?.length || 0).fill(null);
    return {
      adx: nullArray,
      plusDI: nullArray,
      minusDI: nullArray
    };
  }

  const reversedData = [...data].reverse();
  const length = reversedData.length;
  
  // Arrays to store intermediate values
  const tr = [];
  const plusDM = [];
  const minusDM = [];
  
  // Calculate TR, +DM, -DM
  tr.push(null);
  plusDM.push(null);
  minusDM.push(null);
  
  for (let i = 1; i < length; i++) {
    const high = reversedData[i].high;
    const low = reversedData[i].low;
    const close = reversedData[i].close;
    const prevHigh = reversedData[i - 1].high;
    const prevLow = reversedData[i - 1].low;
    const prevClose = reversedData[i - 1].close;
    
    // True Range
    const trValue = Math.max(
      high - low,
      Math.abs(high - prevClose),
      Math.abs(low - prevClose)
    );
    tr.push(trValue);
    
    // Directional Movement
    const upMove = high - prevHigh;
    const downMove = prevLow - low;
    
    plusDM.push(upMove > downMove && upMove > 0 ? upMove : 0);
    minusDM.push(downMove > upMove && downMove > 0 ? downMove : 0);
  }
  
  // Smooth TR, +DM, -DM
  const smoothedTR = smoothWilder(tr, period);
  const smoothedPlusDM = smoothWilder(plusDM, period);
  const smoothedMinusDM = smoothWilder(minusDM, period);
  
  // Calculate +DI and -DI
  const plusDI = [];
  const minusDI = [];
  const dx = [];
  
  for (let i = 0; i < length; i++) {
    if (smoothedTR[i] === null || smoothedTR[i] === 0) {
      plusDI.push(null);
      minusDI.push(null);
      dx.push(null);
    } else {
      const pDI = (smoothedPlusDM[i] / smoothedTR[i]) * 100;
      const mDI = (smoothedMinusDM[i] / smoothedTR[i]) * 100;
      plusDI.push(pDI);
      minusDI.push(mDI);
      
      // Calculate DX
      const diSum = pDI + mDI;
      const diDiff = Math.abs(pDI - mDI);
      dx.push(diSum === 0 ? 0 : (diDiff / diSum) * 100);
    }
  }
  
  // ADX is EMA of DX
  const dxData = dx.map((value, i) => ({
    close: value !== null ? value : 0,
    date: reversedData[i].date
  }));
  
  const adxValues = calculateEMA(dxData, period);
  
  // Reverse all arrays to match input order (newest first)
  return {
    adx: adxValues.reverse(),
    plusDI: plusDI.reverse(),
    minusDI: minusDI.reverse()
  };
}

/**
 * Wilder's Smoothing (used in ADX calculation)
 * Similar to EMA but with Wilder's specific smoothing method
 */
function smoothWilder(data, period) {
  const smoothed = [];
  
  // First value is simple average
  let sum = 0;
  for (let i = 0; i < period; i++) {
    if (data[i] === null) {
      smoothed.push(null);
    } else {
      sum += data[i];
      smoothed.push(null);
    }
  }
  
  if (sum === 0) {
    smoothed[period - 1] = 0;
  } else {
    smoothed[period - 1] = sum / period;
  }
  
  // Subsequent values use Wilder's smoothing
  for (let i = period; i < data.length; i++) {
    if (data[i] === null) {
      smoothed.push(null);
    } else {
      const prevSmoothed = smoothed[i - 1];
      smoothed.push(((prevSmoothed * (period - 1)) + data[i]) / period);
    }
  }
  
  return smoothed;
}

/**
 * Calculate Supertrend Indicator
 * 
 * Formula:
 * 1. Calculate ATR (Average True Range)
 * 2. Basic Upper Band = (High + Low) / 2 + (Multiplier * ATR)
 * 3. Basic Lower Band = (High + Low) / 2 - (Multiplier * ATR)
 * 4. Determine trend based on price relative to bands
 * 
 * @param {Array} data - Array of OHLCV objects, sorted newest first
 * @param {number} period - ATR period (typically 10)
 * @param {number} multiplier - ATR multiplier (typically 3)
 * @returns {Array} Array of trend values (1 for bullish, -1 for bearish)
 */
function calculateSupertrend(data, period = 10, multiplier = 3) {
  if (!data || data.length < period) {
    return Array(data?.length || 0).fill(null);
  }

  const reversedData = [...data].reverse();
  const length = reversedData.length;
  
  // Calculate ATR
  const tr = [null];
  for (let i = 1; i < length; i++) {
    const high = reversedData[i].high;
    const low = reversedData[i].low;
    const prevClose = reversedData[i - 1].close;
    
    const trValue = Math.max(
      high - low,
      Math.abs(high - prevClose),
      Math.abs(low - prevClose)
    );
    tr.push(trValue);
  }
  
  const atr = smoothWilder(tr, period);
  
  // Calculate Supertrend
  const trend = [];
  let upperBand = null;
  let lowerBand = null;
  
  for (let i = 0; i < length; i++) {
    if (atr[i] === null) {
      trend.push(null);
      continue;
    }
    
    const hl2 = (reversedData[i].high + reversedData[i].low) / 2;
    const basicUpperBand = hl2 + (multiplier * atr[i]);
    const basicLowerBand = hl2 - (multiplier * atr[i]);
    
    // Calculate final bands
    if (i === 0) {
      upperBand = basicUpperBand;
      lowerBand = basicLowerBand;
    } else {
      upperBand = basicUpperBand < upperBand || reversedData[i - 1].close > upperBand 
        ? basicUpperBand 
        : upperBand;
      lowerBand = basicLowerBand > lowerBand || reversedData[i - 1].close < lowerBand 
        ? basicLowerBand 
        : lowerBand;
    }
    
    // Determine trend
    if (i === 0) {
      trend.push(1); // Default to bullish
    } else {
      const prevTrend = trend[i - 1];
      if (prevTrend === 1) {
        trend.push(reversedData[i].close <= lowerBand ? -1 : 1);
      } else {
        trend.push(reversedData[i].close >= upperBand ? 1 : -1);
      }
    }
  }
  
  return trend.reverse();
}

module.exports = {
  calculateEMA,
  calculateRSI,
  calculateMACD,
  calculateADX,
  calculateSupertrend
};
