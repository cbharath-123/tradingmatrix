import { useState } from 'react'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import MainContent from './components/MainContent'
import TrendMatrixTable from './components/TrendMatrixTable'
import AlertCard from './components/AlertCard'
import InputSettings from './components/InputSettings'

function App() {
  // Placeholder data matching your Figma design
  const mockData = [
    {
      timeframe: '15min',
      score: 72,
      confidence: 0.82,
      adx: 0.2,
      ema: 1.0,
      rsi: 0.6,
      macd: 0.9,
      supertrend: 1
    },
    {
      timeframe: '1hour',
      score: 48,
      confidence: 0.74,
      adx: 0.82,
      ema: 0.8,
      rsi: 0.5,
      macd: 0.6,
      supertrend: 1
    },
    {
      timeframe: '4hours',
      score: 10,
      confidence: 0.45,
      adx: 0.45,
      ema: -0.1,
      rsi: 0.2,
      macd: -0.3,
      supertrend: -1
    },
    {
      timeframe: '1day',
      score: -32,
      confidence: 0.63,
      adx: 0.63,
      ema: -0.7,
      rsi: -0.6,
      macd: -0.8,
      supertrend: -1
    },
    {
      timeframe: '1week',
      score: -68,
      confidence: 0.81,
      adx: 0.81,
      ema: -1.0,
      rsi: -0.9,
      macd: -1.0,
      supertrend: -1
    }
  ]

  return (
    <div className="min-h-screen bg-[#0a0e27] text-white flex flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <MainContent>
          <div className="space-y-6">
            {/* Alert Card */}
            <AlertCard 
              type="bullish"
              aggregateScore={72}
              confidence="0.81"
              timeframes="15m, 1h, 4h"
            />
            
            {/* Main Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <TrendMatrixTable data={mockData} />
              </div>
              <div>
                <InputSettings />
              </div>
            </div>
          </div>
        </MainContent>
      </div>
    </div>
  )
}

export default App
