import { useState } from 'react'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import MainContent from './components/MainContent'
import TrendMatrixTable from './components/TrendMatrixTable'
import TradingChart from './components/TradingChart'
import TrendMatrixOverlay from './components/TrendMatrixOverlay'
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
        <Sidebar />
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
                {/* Chart with Overlay */}
                <div className="relative w-full h-[600px] bg-[#0a0e27] rounded-lg overflow-hidden">
                  <TradingChart symbol={currentSymbol} />
                  <TrendMatrixOverlay 
                    data={data.timeframes || []} 
                    aggregate={data.aggregate}
                    symbol={data.symbol}
                    settings={data.settings}
                  />
                </div>

                {/* RSI Indicator */}
                <div className="bg-[#131722] rounded-lg p-4 flex items-center gap-4">
                  <div className="flex items-center justify-center w-16 h-16 bg-blue-500/20 rounded-full">
                    <span className="text-blue-400 font-bold text-xl">R</span>
                  </div>
                  <div>
                    <div className="text-gray-400 text-sm">RSI: 64.2</div>
                    <div className="text-white text-lg font-semibold">Value: +0.32</div>
                  </div>
                </div>

                {/* Market Status */}
                <div className="bg-[#131722] rounded-lg p-4">
                  <h3 className="text-white font-semibold mb-3">MARKET STATUS</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Status:</span>
                      <span className="text-green-400 font-semibold">Open</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Volume:</span>
                      <span className="text-white font-semibold">High</span>
                    </div>
                  </div>
                </div>

                {/* Settings Panel */}
                <InputSettings 
                  currentSettings={settings}
                  onUpdate={handleSettingsUpdate}
                  onSymbolChange={setCurrentSymbol}
                  currentSymbol={currentSymbol}
                />
                  </div>
                </div>

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
