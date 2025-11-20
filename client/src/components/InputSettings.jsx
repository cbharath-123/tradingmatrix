import React from 'react'

function InputSettings() {
  const timeframes = ['15m', '1h', '4h', '1D', '1W']
  
  return (
    <div className="bg-[#1a1f3a] rounded-lg p-6 border border-[#2d3748]">
      <h3 className="text-xl font-bold text-[#00ff88] mb-6">INPUT SETTINGS</h3>
      
      <div className="space-y-6">
        {/* Timeframe Selection */}
        <div>
          <h4 className="text-white font-semibold mb-3">Timeframe Selection</h4>
          <div className="flex space-x-3">
            {timeframes.map((tf, index) => (
              <label key={index} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked={index < 3}
                  className="w-5 h-5 rounded border-2 border-gray-500 bg-transparent checked:bg-[#00ff88] checked:border-[#00ff88] cursor-pointer"
                />
                <span className="text-white font-medium">{tf}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Indicator Periods */}
        <div>
          <h4 className="text-white font-semibold mb-3">Indicator Periods</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">EMA Length: <span className="text-white font-bold">50</span></span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">RSI Length: <span className="text-white font-bold">14</span></span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">MACD Settings: <span className="text-white font-bold">12/26/9</span></span>
            </div>
          </div>
        </div>

        {/* ADX Settings */}
        <div>
          <h4 className="text-white font-semibold mb-3">ADX Settings</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">ADX Threshold: <span className="text-white font-bold">25</span></span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Confidence Weight: <span className="text-white font-bold">1.0</span></span>
            </div>
          </div>
        </div>

        {/* Alert Settings */}
        <div>
          <h4 className="text-white font-semibold mb-3">Alert Settings</h4>
          <div className="space-y-3">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                className="w-5 h-5 rounded border-2 border-gray-500 bg-transparent checked:bg-[#00ff88] checked:border-[#00ff88] cursor-pointer"
              />
              <span className="text-white font-medium">Bias Flip Alert</span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                className="w-5 h-5 rounded border-2 border-gray-500 bg-transparent checked:bg-[#00ff88] checked:border-[#00ff88] cursor-pointer"
              />
              <span className="text-white font-medium">Strong Trend Alert</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InputSettings
