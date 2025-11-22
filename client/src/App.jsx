import { useState } from 'react'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import MainContent from './components/MainContent'
import TrendMatrixTable from './components/TrendMatrixTable'
import TradingChart from './components/TradingChart'
import TrendMatrixPanel from './components/TrendMatrixPanel'
import AlertCard from './components/AlertCard'
import InputSettings from './components/InputSettings'
import LoadingSpinner from './components/LoadingSpinner'
import ErrorMessage from './components/ErrorMessage'
import useTrendMatrix from './hooks/useTrendMatrix'

function App() {
  // State for current symbol and settings
  const [currentSymbol, setCurrentSymbol] = useState('AAPL')
  const [settings, setSettings] = useState({
    timeframes: '15min,1hour,4hours,1day,1week',
    emaLength: 50,
    rsiLength: 14,
    macdFast: 12,
    macdSlow: 26,
    macdSignal: 9,
    adxLength: 14,
    adxThreshold: 25
  })

  // Fetch trend matrix data using custom hook
  const { data, loading, error, refetch } = useTrendMatrix(currentSymbol, settings)

  // Handler to update settings
  const handleSettingsUpdate = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }))
  }

  return (
    <div className="min-h-screen bg-[#0a0e27] text-white flex flex-col">
      <Header onSymbolSearch={setCurrentSymbol} />
      <div className="flex flex-1 overflow-hidden">
        <MainContent>
          <div className="space-y-6">
            {/* Loading State */}
            {loading && (
              <LoadingSpinner message={`Analyzing ${currentSymbol}...`} />
            )}

            {/* Error State */}
            {error && !loading && (
              <ErrorMessage error={error} onRetry={refetch} />
            )}

            {/* Data Loaded Successfully */}
            {!loading && !error && data && (
              <>
                {/* Main Layout: 70% Graph + 30% Table */}
                <div className="flex gap-4 h-[700px]">
                  {/* Graph Section - 70% */}
                  <div className="relative w-[70%] bg-[#0a0e27] rounded-lg overflow-hidden">
                    <TradingChart symbol={currentSymbol} />
                  </div>

                  {/* Table Section - 30% */}
                  <div className="w-[30%] bg-[#0a0e27] rounded-lg overflow-hidden flex items-start">
                    <TrendMatrixPanel 
                      data={{
                        aggregateBias: data.aggregate?.score || 0,
                        grade: data.aggregate?.grade || 'C',
                        confidence: data.aggregate?.confidence || 0,
                        settings: {
                          rsiPeriod: settings.rsiLength,
                          emaPeriod: settings.emaLength,
                          adxThreshold: settings.adxThreshold,
                          alertsOn: true,
                          strongTrend: 60
                        },
                        indicatorToggles: {
                          ema: true,
                          rsi: true,
                          macd: true,
                          st: true
                        },
                        matrixData: (data.timeframes || []).map(tf => ({
                          timeframe: tf.timeframe,
                          score: tf.score,
                          confidence: tf.confidence,
                          ema: tf.ema,
                          rsi: tf.rsi,
                          macd: tf.macd,
                          supertrend: tf.supertrend
                        }))
                      }}
                    />
                  </div>
                </div>

                {/* Settings Panel */}
                <InputSettings 
                  currentSettings={settings}
                  onUpdate={handleSettingsUpdate}
                  onSymbolChange={setCurrentSymbol}
                  currentSymbol={currentSymbol}
                />

                {/* Data Info Footer */}
                <div className="bg-[#1a1f3a] rounded-lg p-4 border border-[#2d3748] text-sm text-gray-400">
                  <div className="flex items-center justify-between">
                    <span>Last Updated: {new Date(data.lastUpdated).toLocaleString()}</span>
                    <span>Data Points: {data.dataPoints}</span>
                    <button 
                      onClick={refetch}
                      className="text-[#3366ff] hover:text-[#00ff88] transition-colors font-medium"
                    >
                      🔄 Refresh Data
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </MainContent>
      </div>
    </div>
  )
}

export default App
