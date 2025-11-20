# TradeMatrix API Documentation

## Phase 3: Backend Development Complete ✅

### Overview
The TradeMatrix backend provides a RESTful API for multi-timeframe technical analysis of stock symbols. It integrates with Alpha Vantage for real-time market data and calculates various technical indicators across multiple timeframes.

---

## Technical Implementation

### 📦 Dependencies Installed
- **axios**: HTTP client for API requests to Alpha Vantage
- **express**: Web framework for API endpoints
- **cors**: Enable cross-origin requests from frontend
- **dotenv**: Environment variable management

### 🏗️ Architecture

```
server/
├── services/
│   └── alphaVantage.js        # Alpha Vantage API integration
├── logic/
│   ├── trendCalculator.js     # Technical indicator calculations
│   ├── dataResampler.js       # Timeframe conversion utilities
│   └── trendMatrix.js         # Multi-timeframe analysis engine
├── routes/
│   └── api.js                 # API endpoint definitions
├── index.js                   # Express server setup
└── .env                       # Environment variables

## API Endpoints

### 1. Health Check
**GET** `/api/health`

Check if the API is running.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-11-20T23:45:00.000Z",
  "service": "TradeMatrix API",
  "version": "1.0.0"
}
```

---

### 2. Trend Matrix Analysis
**GET** `/api/trend-matrix/:symbol`

Calculate multi-timeframe technical analysis for a stock symbol.

**Parameters:**
- `symbol` (path): Stock ticker symbol (e.g., AAPL, MSFT, TSLA)

**Query Parameters (Optional):**
- `timeframes`: Comma-separated list (default: "15min,1hour,4hours,1day,1week")
- `emaLength`: EMA period (default: 50)
- `rsiLength`: RSI period (default: 14)
- `macdFast`: MACD fast period (default: 12)
- `macdSlow`: MACD slow period (default: 26)
- `macdSignal`: MACD signal period (default: 9)
- `adxLength`: ADX period (default: 14)
- `adxThreshold`: ADX threshold for strong trend (default: 25)

**Example Request:**
```
GET http://localhost:5000/api/trend-matrix/AAPL?timeframes=1hour,1day,1week
```

**Response:**
```json
{
  "symbol": "AAPL",
  "lastUpdated": "2025-11-20T23:45:00.000Z",
  "dataPoints": 100,
  "settings": {
    "emaLength": 50,
    "rsiLength": 14,
    "macdFast": 12,
    "macdSlow": 26,
    "macdSignal": 9,
    "adxLength": 14,
    "adxThreshold": 25
  },
  "timeframes": [
    {
      "timeframe": "15min",
      "score": 72,
      "confidence": 0.82,
      "adx": 0.2,
      "ema": 1.0,
      "rsi": 0.6,
      "macd": 0.9,
      "supertrend": 1,
      "strongTrend": false
    },
    // ... more timeframes
  ],
  "aggregate": {
    "score": 72,
    "confidence": 0.81,
    "bias": "Strong Bullish",
    "grade": "A-",
    "timeframesInAgreement": "15min, 1h, 4h"
  },
  "alert": {
    "triggered": true,
    "type": "Strong Bullish"
  }
}
```

---

### 3. Supported Symbols
**GET** `/api/symbols`

Get list of commonly traded symbols.

**Response:**
```json
{
  "symbols": [
    { "symbol": "AAPL", "name": "Apple Inc." },
    { "symbol": "MSFT", "name": "Microsoft Corporation" },
    // ... more symbols
  ]
}
```

---

## Technical Indicators Explained

### 1. **EMA (Exponential Moving Average)**

**Formula:**
```
Multiplier = 2 / (period + 1)
EMA(today) = (Close(today) × Multiplier) + (EMA(yesterday) × (1 - Multiplier))
```

**Interpretation:**
- Price > EMA: Bullish signal (+1)
- Price < EMA: Bearish signal (-1)
- Price = EMA: Neutral (0)

**Implementation:** `calculateEMA(data, period)`

---

### 2. **RSI (Relative Strength Index)**

**Formula:**
```
1. Calculate price changes (gains and losses)
2. Average Gain = Sum of gains / period
3. Average Loss = Sum of losses / period
4. RS = Average Gain / Average Loss
5. RSI = 100 - (100 / (1 + RS))
```

**Interpretation:**
- RSI > 60: Bullish signal (+1)
- RSI < 40: Bearish signal (-1)
- RSI 40-60: Neutral (0)
- Above 70: Overbought
- Below 30: Oversold

**Implementation:** `calculateRSI(data, period)`

---

### 3. **MACD (Moving Average Convergence Divergence)**

**Formula:**
```
1. MACD Line = 12-period EMA - 26-period EMA
2. Signal Line = 9-period EMA of MACD Line
3. Histogram = MACD Line - Signal Line
```

**Interpretation:**
- Histogram > 0: Bullish signal (+1)
- Histogram < 0: Bearish signal (-1)
- MACD crosses above Signal: Buy signal
- MACD crosses below Signal: Sell signal

**Implementation:** `calculateMACD(data, fast, slow, signal)`

---

### 4. **ADX (Average Directional Index)**

**Formula:**
```
1. Calculate +DM and -DM (Directional Movement)
2. Calculate True Range (TR)
3. +DI = (+DM / TR) × 100
4. -DI = (-DM / TR) × 100
5. DX = (|+DI - -DI| / |+DI + -DI|) × 100
6. ADX = EMA of DX
```

**Interpretation:**
- ADX < 20: Weak trend
- ADX 20-25: Emerging trend
- ADX 25-50: Strong trend
- ADX > 50: Very strong trend

**Used for:** Confidence calculation (higher ADX = higher confidence)

**Implementation:** `calculateADX(data, period)`

---

### 5. **Supertrend**

**Formula:**
```
1. Calculate ATR (Average True Range)
2. Upper Band = (High + Low) / 2 + (Multiplier × ATR)
3. Lower Band = (High + Low) / 2 - (Multiplier × ATR)
4. Determine trend based on price relative to bands
```

**Interpretation:**
- Trend = 1: Bullish
- Trend = -1: Bearish

**Implementation:** `calculateSupertrend(data, period, multiplier)`

---

## Scoring System

### Individual Indicator Signals
Each indicator returns:
- `+1`: Bullish signal
- `0`: Neutral
- `-1`: Bearish signal

### Aggregate Score Calculation
```javascript
score = (EMA + RSI + MACD + Supertrend) × 25
```

**Score ranges:**
- `+75 to +100`: Strong Bullish
- `+25 to +74`: Bullish
- `-24 to +24`: Neutral
- `-74 to -25`: Bearish
- `-100 to -75`: Strong Bearish

### Confidence Calculation
Based on ADX (trend strength):
```javascript
confidence = min(ADX / 50, 1)
```

### Grade Calculation
Combines score magnitude and confidence:
- **A+**: High score (80+) with very high confidence (0.85+)
- **A**: High score with high confidence (0.65+)
- **A-**: High score with moderate confidence (0.45+)
- **B, C, D**: Lower scores with varying confidence
- **F**: Low confidence (<0.45) or weak signals

---

## Data Flow

1. **User Request** → `/api/trend-matrix/AAPL`
2. **Fetch Data** → Alpha Vantage API (daily time series)
3. **Resample** → Convert daily data to multiple timeframes
4. **Calculate Indicators** → EMA, RSI, MACD, ADX, Supertrend for each timeframe
5. **Analyze** → Generate signals and scores
6. **Aggregate** → Combine all timeframes into overall bias
7. **Return** → Structured JSON response

---

## Environment Configuration

### `.env` File
```env
PORT=5000
NODE_ENV=development
ALPHA_VANTAGE_API_KEY=your_api_key_here
```

### Get Alpha Vantage API Key
1. Visit: https://www.alphavantage.co/support/#api-key
2. Sign up for free (5 API calls per minute, 500 per day)
3. Replace `demo` in `.env` with your key

---

## Testing the API

### Using cURL
```bash
# Health check
curl http://localhost:5000/api/health

# Get trend matrix for AAPL
curl http://localhost:5000/api/trend-matrix/AAPL

# With custom parameters
curl "http://localhost:5000/api/trend-matrix/MSFT?timeframes=1day,1week&emaLength=20"
```

### Using Browser
Open: `http://localhost:5000/api/trend-matrix/AAPL`

---

## Next Steps (Phase 4)

1. **Connect Frontend to Backend**
   - Replace mock data with API calls
   - Add loading states
   - Error handling

2. **Real-time Updates**
   - WebSocket integration
   - Live price updates
   - Alert notifications

3. **Additional Features**
   - Chart component with TradingView
   - User watchlists
   - Historical analysis

---

## Error Handling

The API returns appropriate HTTP status codes:

- **200**: Success
- **400**: Bad request (invalid parameters)
- **404**: Not found (invalid endpoint or symbol)
- **429**: Rate limit exceeded (Alpha Vantage)
- **500**: Internal server error

**Example Error Response:**
```json
{
  "error": "Failed to calculate trend matrix",
  "message": "No data found for symbol: INVALID"
}
```

---

**Phase 3 Complete!** 🎉

All backend logic translated from Pine Script to JavaScript with full API integration.
