import React from 'react'

function TrendMatrixOverlay({ data, aggregate, symbol, settings }) {
  const getScoreBgColor = (score) => {
    if (score >= 40) return 'bg-green-600'
    if (score >= 0) return 'bg-green-500'
    if (score >= -40) return 'bg-red-500'
    return 'bg-red-600'
  }

  const getConfidenceBgColor = (confidence) => {
    if (confidence >= 0.8) return 'bg-green-500'
    if (confidence >= 0.6) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getIndicatorBgColor = (value) => {
    if (value > 0.5) return 'bg-green-400'
    if (value > 0) return 'bg-lime-400'
    if (value > -0.5) return 'bg-yellow-400'
    return 'bg-red-400'
  }

  return (
    <div className="absolute bottom-6 right-6 z-10 w-[820px]">
      <div className="bg-[#0d1117]/98 border border-gray-700 rounded-lg overflow-hidden shadow-2xl">
        <div className="flex">
          {/* Left Panel - Settings */}
          <div className="w-48 bg-[#0d1117] p-3 border-r border-gray-700 text-xs">
            <h3 className="text-white font-bold mb-3">MULTI-TIME FRAME BIAS MATRIX</h3>
            
            <div className="mb-4">
              <div className="text-green-400 font-bold text-2xl mb-1">
                AGGREGATE BIAS: {aggregate?.score > 0 ? '+' : ''}{aggregate?.score || 0}
              </div>
              <div className="text-white font-semibold mb-2">(GRADE: {aggregate?.grade || 'C'}) ↑↑Bullish</div>
            </div>

            <div className="space-y-1 mb-3 text-[10px]">
              <div className="text-white">RSI Period: <span className="text-gray-400">{settings?.rsiLength || 14}%</span></div>
              <div className="text-white">EMA Period: <span className="text-gray-400">{settings?.emaLength || 50}%</span></div>
              <div className="text-white">ADX Threshold: <span className="text-gray-400">{settings?.adxThreshold || 25}</span></div>
              <div className="text-white">Alerts On: <span className="text-gray-400">Bias</span></div>
              <div className="text-white">Strong Trend: <span className="text-gray-400">+60</span></div>
            </div>

            <div className="border-t border-gray-700 pt-2 mb-3">
              <div className="text-white font-semibold mb-1 text-[10px]">CONFIDENCE</div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1.5 bg-green-500 rounded-full"></div>
                  <span className="text-[9px] text-gray-400">EMA</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1.5 bg-green-500 rounded-full"></div>
                  <span className="text-[9px] text-gray-400">RSI</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1.5 bg-green-500 rounded-full"></div>
                  <span className="text-[9px] text-gray-400">MACD</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1.5 bg-green-500 rounded-full"></div>
                  <span className="text-[9px] text-gray-400">ST</span>
                </div>
              </div>
            </div>

            <div className="absolute top-3 right-3">
              <div className="relative w-16 h-16">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="32" cy="32" r="28" stroke="#1f2937" strokeWidth="4" fill="none"/>
                  <circle cx="32" cy="32" r="28" stroke="#22c55e" strokeWidth="4" fill="none"
                    strokeDasharray={`${(aggregate?.confidence || 0.88) * 176} 176`}/>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-[8px] text-gray-400">CONFIDENCE</div>
                  <div className="text-xs text-white font-bold">{((aggregate?.confidence || 0.88) * 100).toFixed(0)}%</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Matrix Table */}
          <div className="flex-1 bg-[#161b22] p-3">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left text-white font-bold py-2 px-3 bg-[#0d1117]">Timeframe</th>
                  <th className="text-center text-white font-bold py-2 px-2 bg-[#0d1117]">SCORE</th>
                  <th className="text-center text-white font-bold py-2 px-2 bg-[#0d1117]">CONFIDENT</th>
                  <th className="text-center text-white font-bold py-2 px-2 bg-[#0d1117]">EMA</th>
                  <th className="text-center text-white font-bold py-2 px-2 bg-[#0d1117]">RSI</th>
                  <th className="text-center text-white font-bold py-2 px-2 bg-[#0d1117]">MACD</th>
                  <th className="text-center text-white font-bold py-2 px-2 bg-[#0d1117]">SUPERTREND</th>
                </tr>
              </thead>
              <tbody>
                {data?.slice(0, 5).map((tf, idx) => (
                  <tr key={idx} className="border-b border-gray-800">
                    <td className="py-3 px-3 text-white font-semibold bg-[#0d1117]">{tf.timeframe}</td>
                    <td className={`py-3 px-2 text-center font-bold text-black ${getScoreBgColor(tf.score)}`}>
                      {tf.score > 0 ? '+' : ''}{tf.score}
                    </td>
                    <td className="py-3 px-2 text-center bg-[#0d1117]">
                      <div className="flex justify-center">
                        <div className={`w-7 h-7 rounded-full border-4 flex items-center justify-center ${getConfidenceBgColor(tf.confidence)}`}>
                          <span className="text-black text-[10px] font-bold">{(tf.confidence * 100).toFixed(2)}</span>
                        </div>
                      </div>
                    </td>
                    <td className={`py-3 px-2 text-center font-bold text-black ${getIndicatorBgColor(tf.indicators?.ema)}`}>
                      {tf.indicators?.ema > 0 ? '+' : ''}{tf.indicators?.ema?.toFixed(1)}
                    </td>
                    <td className={`py-3 px-2 text-center font-bold text-black ${getIndicatorBgColor(tf.indicators?.rsi)}`}>
                      {tf.indicators?.rsi > 0 ? '+' : ''}{tf.indicators?.rsi?.toFixed(1)}
                    </td>
                    <td className={`py-3 px-2 text-center font-bold text-black ${getIndicatorBgColor(tf.indicators?.macd)}`}>
                      {tf.indicators?.macd > 0 ? '+' : ''}{tf.indicators?.macd?.toFixed(1)}
                    </td>
                    <td className="py-3 px-2 text-center bg-[#0d1117]">
                      <div className="flex justify-center items-center">
                        <div className={`w-7 h-6 flex items-center justify-center rounded text-xs font-bold ${tf.indicators?.supertrend > 0 ? 'bg-green-500' : 'bg-red-500'}`}>
                          <span className="text-black">{tf.indicators?.supertrend > 0 ? '+' : '-'}1</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TrendMatrixOverlay
