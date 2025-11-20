import { useState } from 'react'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import MainContent from './components/MainContent'
import TrendMatrixTable from './components/TrendMatrixTable'
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
      <Header />
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
                {/* Alert Card */}
                {data.alert?.triggered && (
                  <AlertCard 
                    type={data.alert.type?.toLowerCase().includes('bullish') ? 'bullish' : 'bearish'}
                    aggregateScore={data.aggregate?.score || 0}
                    confidence={data.aggregate?.confidence?.toFixed(2) || '0.00'}
                    timeframes={data.aggregate?.timeframesInAgreement || 'N/A'}
                  />
                )}
                
                {/* Main Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <TrendMatrixTable 
                      data={data.timeframes || []} 
                      aggregate={data.aggregate}
                      symbol={data.symbol}
                      settings={data.settings}
                    />
                  </div>
                  <div>
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
