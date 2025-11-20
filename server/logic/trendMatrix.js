/**
 * Trend Matrix Analyzer
 * Combines all indicators to calculate multi-timeframe bias
 */

const {
  calculateEMA,
  calculateRSI,
  calculateMACD,
  calculateADX,
  calculateSupertrend
} = require('./trendCalculator');

const { getTimeframeData } = require('./dataResampler');

/**
 * Analyze a single timeframe and calculate all indicators
 * 
 * @param {Array} data - OHLCV data for the timeframe
 * @param {Object} settings - Indicator settings
 * @returns {Object} Analysis results for this timeframe
 */
function analyzeTimeframe(data, settings = {}) {
  const {
    emaLength = 50,
    rsiLength = 14,
    macdFast = 12,
    macdSlow = 26,
    macdSignal = 9,
    adxLength = 14,
    adxThreshold = 25,
    supertrendPeriod = 10,
    supertrendMultiplier = 3
  } = settings;

  if (!data || data.length < Math.max(emaLength, macdSlow + macdSignal)) {
    return null;
  }

  // Calculate all indicators
  const ema = calculateEMA(data, emaLength);
  const rsi = calculateRSI(data, rsiLength);
  const macd = calculateMACD(data, macdFast, macdSlow, macdSignal);
  const adx = calculateADX(data, adxLength);
  const supertrend = calculateSupertrend(data, supertrendPeriod, supertrendMultiplier);

  // Get the most recent values (index 0 since data is sorted newest first)
  const currentPrice = data[0].close;
  const currentEMA = ema[0];
  const currentRSI = rsi[0];
  const currentMACD = macd.macd[0];
  const currentSignal = macd.signal[0];
  const currentHistogram = macd.histogram[0];
  const currentADX = adx.adx[0];
  const currentSupertrend = supertrend[0];

  // Calculate individual indicator signals (-1 bearish, 0 neutral, +1 bullish)
  const emaSignal = currentPrice > currentEMA ? 1 : currentPrice < currentEMA ? -1 : 0;
  
  const rsiSignal = currentRSI > 60 ? 1 : currentRSI < 40 ? -1 : 0;
  
  const macdTrendSignal = currentHistogram > 0 ? 1 : currentHistogram < 0 ? -1 : 0;
  
  const supertrendSignal = currentSupertrend;

  // Calculate weighted score
  // EMA, RSI, MACD, Supertrend each contribute to the score
  const score = (emaSignal + rsiSignal + macdTrendSignal + supertrendSignal) * 25;

  // Calculate confidence based on ADX
  // ADX shows trend strength: higher ADX = more confident in the signal
  // Normalize ADX to 0-1 scale
  const confidence = Math.min(currentADX / 50, 1);

  // Determine if trend is strong (ADX > threshold)
  const strongTrend = currentADX > adxThreshold;

  return {
    score,
    confidence: parseFloat(confidence.toFixed(2)),
    adx: parseFloat((currentADX / 100).toFixed(2)), // Normalize to 0-1 for frontend
    ema: parseFloat(emaSignal.toFixed(1)),
    rsi: parseFloat(rsiSignal.toFixed(1)),
    macd: parseFloat(macdTrendSignal.toFixed(1)),
    supertrend: supertrendSignal,
    strongTrend,
    // Raw values for reference
    rawValues: {
      price: currentPrice,
      ema: currentEMA,
      rsi: currentRSI,
      macd: currentMACD,
      macdSignal: currentSignal,
      macdHistogram: currentHistogram,
      adx: currentADX
    }
  };
}

/**
 * Calculate multi-timeframe trend matrix
 * 
 * @param {Array} dailyData - Base daily OHLCV data
 * @param {Array} timeframes - Array of timeframe strings to analyze
 * @param {Object} settings - Indicator settings
 * @returns {Object} Complete trend matrix analysis
 */
function calculateTrendMatrix(dailyData, timeframes = ['15min', '1hour', '4hours', '1day', '1week'], settings = {}) {
  const results = [];
  let totalScore = 0;
  let totalConfidence = 0;
  let validTimeframes = 0;
  const agreementTimeframes = [];

  // Analyze each timeframe
  timeframes.forEach(timeframe => {
    try {
      const timeframeData = getTimeframeData(dailyData, timeframe);
      const analysis = analyzeTimeframe(timeframeData, settings);

      if (analysis) {
        results.push({
          timeframe,
          ...analysis
        });

        totalScore += analysis.score;
        totalConfidence += analysis.confidence;
        validTimeframes++;

        // Check if this timeframe agrees with overall bias
        if (Math.abs(analysis.score) > 25) {
          agreementTimeframes.push(timeframe);
        }
      }
    } catch (error) {
      console.error(`Error analyzing ${timeframe}:`, error.message);
    }
  });

  // Calculate aggregate metrics
  const aggregateScore = validTimeframes > 0 ? Math.round(totalScore / validTimeframes) : 0;
  const aggregateConfidence = validTimeframes > 0 ? (totalConfidence / validTimeframes).toFixed(2) : 0;

  // Determine overall bias
  let bias = 'Neutral';
  if (aggregateScore > 40) bias = 'Strong Bullish';
  else if (aggregateScore > 20) bias = 'Bullish';
  else if (aggregateScore < -40) bias = 'Strong Bearish';
  else if (aggregateScore < -20) bias = 'Bearish';

  // Calculate grade based on score and confidence
  const grade = calculateGrade(aggregateScore, parseFloat(aggregateConfidence));

  return {
    timeframes: results,
    aggregate: {
      score: aggregateScore,
      confidence: parseFloat(aggregateConfidence),
      bias,
      grade,
      timeframesInAgreement: agreementTimeframes.join(', ')
    },
    alert: {
      triggered: Math.abs(aggregateScore) > 60 && parseFloat(aggregateConfidence) > 0.7,
      type: aggregateScore > 60 ? 'Strong Bullish' : aggregateScore < -60 ? 'Strong Bearish' : null
    }
  };
}

/**
 * Calculate letter grade based on score and confidence
 * 
 * @param {number} score - Aggregate bias score
 * @param {number} confidence - Aggregate confidence
 * @returns {string} Letter grade (A+, A, A-, B+, etc.)
 */
function calculateGrade(score, confidence) {
  const absScore = Math.abs(score);
  
  // Base grade on score magnitude
  let grade;
  if (absScore >= 80) grade = 'A';
  else if (absScore >= 60) grade = 'B';
  else if (absScore >= 40) grade = 'C';
  else if (absScore >= 20) grade = 'D';
  else grade = 'F';

  // Adjust based on confidence
  if (confidence >= 0.85) return grade + '+';
  if (confidence >= 0.65) return grade;
  if (confidence >= 0.45) return grade + '-';
  return 'F'; // Low confidence = failing grade
}

module.exports = {
  analyzeTimeframe,
  calculateTrendMatrix,
  calculateGrade
};
