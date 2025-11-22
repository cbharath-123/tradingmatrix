import React from 'react'
import TrendMatrixPanel from './components/TrendMatrixPanel'

// Sample data matching your structure
const sampleData = {
  aggregateBias: 72,
  grade: 'A-',
  confidence: 0.88,
  settings: {
    rsiPeriod: 14,
    emaPeriod: 50,
    adxThreshold: 25,
    alertsOn: true,
    strongTrend: 60
  },
  indicatorToggles: {
    ema: true,
    rsi: true,
    macd: true,
    st: true
  },
  matrixData: [
    { 
      timeframe: '15min', 
      score: 72, 
      confident: 0.82, 
      ema: 1.0, 
      rsi: 0.6, 
      macd: 0.9, 
      supertrend: 1 
    },
    { 
      timeframe: '1hour', 
      score: 48, 
      confident: 0.74, 
      ema: 0.8, 
      rsi: 0.5, 
      macd: 0.6, 
      supertrend: 1 
    },
    { 
      timeframe: '4hours', 
      score: 10, 
      confident: 0.45, 
      ema: -0.1, 
      rsi: 0.2, 
      macd: -0.3, 
      supertrend: -1 
    },
    { 
      timeframe: '1day', 
      score: -32, 
      confident: 0.63, 
      ema: -0.7, 
      rsi: -0.6, 
      macd: -0.8, 
      supertrend: -1 
    },
    { 
      timeframe: '1week', 
      score: -68, 
      confident: 0.81, 
      ema: -1.0, 
      rsi: -0.9, 
      macd: -1.0, 
      supertrend: -1 
    }
  ]
}

function TrendMatrixDemo() {
  return (
    <div className="min-h-screen bg-[#0a0e27] p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-white text-3xl font-bold mb-6">Trend Matrix Panel Demo</h1>
        
        <div className="mb-8">
          <TrendMatrixPanel data={sampleData} />
        </div>

        <div className="bg-gray-900 rounded-lg p-6 text-gray-300">
          <h2 className="text-xl font-bold mb-4 text-white">Usage Example:</h2>
          <pre className="bg-gray-950 p-4 rounded overflow-x-auto text-sm">
{`import TrendMatrixPanel from './components/TrendMatrixPanel'

const data = {
  aggregateBias: 72,
  grade: 'A-',
  confidence: 0.88,
  settings: {
    rsiPeriod: 14,
    emaPeriod: 50,
    adxThreshold: 25,
    alertsOn: true,
    strongTrend: 60
  },
  indicatorToggles: {
    ema: true,
    rsi: true,
    macd: false,
    st: true
  },
  matrixData: [
    { timeframe: '15min', score: 72, confident: 0.82, 
      ema: 1.0, rsi: 0.8, macd: 0.9, supertrend: 1 },
    // ... more rows
  ]
}

<TrendMatrixPanel data={data} />`}
          </pre>
        </div>
      </div>
    </div>
  )
}

export default TrendMatrixDemo
