import React from 'react'

function TrendMatrixTable({ data }) {
  // Function to determine the background color based on score
  const getScoreColor = (score) => {
    if (score >= 40) return 'bg-[#10b981] text-white'
    if (score >= 20) return 'bg-[#10b981]/70 text-white'
    if (score > 0) return 'bg-[#10b981]/40 text-white'
    if (score === 0) return 'bg-gray-600 text-white'
    if (score >= -20) return 'bg-[#ef4444]/40 text-white'
    if (score >= -40) return 'bg-[#ef4444]/70 text-white'
    return 'bg-[#ef4444] text-white'
  }

  // Function to get confidence color
  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return 'text-[#00ff88]'
    if (confidence >= 0.6) return 'text-[#ffcc00]'
    return 'text-[#ff3366]'
  }

  // Function to get indicator cell color
  const getIndicatorColor = (value) => {
    if (value === 1) return 'bg-[#10b981]' // Green for bullish
    if (value === -1) return 'bg-[#ef4444]' // Red for bearish
    return 'bg-gray-600' // Gray for neutral
  }

  // Function to get ADX circle color
  const getADXColor = (value) => {
    if (value >= 1.0) return 'border-[#00ff88] bg-[#00ff88]/20'
    if (value >= 0.8) return 'border-[#ff3366] bg-[#ff3366]/20'
    if (value >= 0.5) return 'border-gray-400 bg-gray-400/20'
    return 'border-blue-400 bg-blue-400/20'
  }

  return (
    <div className="bg-[#1a1f3a] rounded-lg p-6 border border-[#2d3748]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">MULTI-TIME FRAME BIAS MATRIX</h3>
          <div className="flex items-center space-x-4 text-sm">
            <span className="text-gray-400">RSI Period: <span className="text-white">4.02%</span></span>
            <span className="text-gray-400">EMA Period: <span className="text-white">4.02%</span></span>
            <span className="text-gray-400">ADX Threshold: <span className="text-white">25</span></span>
            <span className="text-gray-400">Alerts On: <span className="text-white">Bias</span></span>
            <span className="text-gray-400">Strong Trend: <span className="text-white">160</span></span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-400 mb-1">AGGREGATE BIAS:</div>
          <div className="text-3xl font-bold text-[#00ff88]">
            +72 <span className="text-sm">(GRADE: A-)</span>
          </div>
          <div className="flex items-center justify-end mt-2">
            <span className="text-green-400 mr-2">↑ Bullish</span>
            <div className="relative w-16 h-16">
              <svg className="transform -rotate-90 w-16 h-16">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="#2d3748"
                  strokeWidth="6"
                  fill="none"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="#00ff88"
                  strokeWidth="6"
                  fill="none"
                  strokeDasharray="175.93"
                  strokeDashoffset="44"
                  className="transition-all duration-500"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-white">0.81</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#2d3748]">
              <th className="text-left py-3 px-4 text-gray-400 font-semibold">Timeframe</th>
              <th className="text-center py-3 px-4 text-gray-400 font-semibold">SCORE</th>
              <th className="text-center py-3 px-4 text-gray-400 font-semibold">CONFIDENT</th>
              <th className="text-center py-3 px-4 text-gray-400 font-semibold">EMA</th>
              <th className="text-center py-3 px-4 text-gray-400 font-semibold">RSI</th>
              <th className="text-center py-3 px-4 text-gray-400 font-semibold">MACD</th>
              <th className="text-center py-3 px-4 text-gray-400 font-semibold">SUPERTREND</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr 
                key={index} 
                className="border-b border-[#2d3748] hover:bg-[#252b47] transition-colors"
              >
                <td className="py-4 px-4 font-semibold text-white">{row.timeframe}</td>
                <td className="py-4 px-4">
                  <div className={`inline-flex items-center justify-center px-4 py-2 rounded font-bold ${getScoreColor(row.score)}`}>
                    {row.score > 0 ? '+' : ''}{row.score}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center justify-center space-x-2">
                    <div className={`w-3 h-3 rounded-full border-2 ${getADXColor(row.adx)}`}></div>
                    <span className={`font-semibold ${getConfidenceColor(row.confidence)}`}>
                      {row.confidence.toFixed(2)}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-4 text-center">
                  <div className="flex items-center justify-center space-x-1">
                    <div className={`w-8 h-8 rounded flex items-center justify-center ${getIndicatorColor(row.ema)}`}>
                      <span className="text-white font-bold text-xs">
                        {row.ema > 0 ? '+' : ''}{row.ema.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 text-center">
                  <div className="flex items-center justify-center space-x-1">
                    <div className={`w-8 h-8 rounded flex items-center justify-center ${getIndicatorColor(row.rsi)}`}>
                      <span className="text-white font-bold text-xs">
                        {row.rsi > 0 ? '+' : ''}{row.rsi.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 text-center">
                  <div className="flex items-center justify-center space-x-1">
                    <div className={`w-8 h-8 rounded flex items-center justify-center ${getIndicatorColor(row.macd)}`}>
                      <span className="text-white font-bold text-xs">
                        {row.macd > 0 ? '+' : ''}{row.macd.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 text-center">
                  <div className="flex items-center justify-center space-x-1">
                    <div className={`w-8 h-8 rounded flex items-center justify-center ${getIndicatorColor(row.supertrend)}`}>
                      <span className="text-white font-bold text-xs">
                        {row.supertrend > 0 ? '+' : ''}{row.supertrend}
                      </span>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <span className="text-gray-400">ADX Values:</span>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded-full border-2 border-blue-400 bg-blue-400/20"></div>
                <span className="text-gray-300">→ 0.2</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded-full border-2 border-gray-400 bg-gray-400/20"></div>
                <span className="text-gray-300">→ 0.5</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded-full border-2 border-[#ff3366] bg-[#ff3366]/20"></div>
                <span className="text-gray-300">→ 0.8</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded-full border-2 border-[#00ff88] bg-[#00ff88]/20"></div>
                <span className="text-gray-300">→ 1.0</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <span className="text-gray-400">EMA/RSI/MCD:</span>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <div className="w-6 h-6 rounded bg-[#10b981]"></div>
                <span className="text-gray-300">→ +1</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-6 h-6 rounded bg-gray-600"></div>
                <span className="text-gray-300">→ 0</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-6 h-6 rounded bg-[#ef4444]"></div>
                <span className="text-gray-300">→ -1</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TrendMatrixTable
