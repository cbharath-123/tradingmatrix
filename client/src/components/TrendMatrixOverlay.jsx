import React from 'react'

function TrendMatrixOverlay({ data, aggregate, symbol, settings }) {
  const getScoreColor = (score) => {
    if (score >= 8) return 'text-green-400'
    if (score >= 3) return 'text-yellow-400'
    if (score <= -8) return 'text-red-400'
    if (score <= -3) return 'text-orange-400'
    return 'text-gray-400'
  }

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return 'bg-green-500'
    if (confidence >= 0.6) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getBiasIcon = (score) => {
    if (score > 0) return '↑'
    if (score < 0) return '↓'
    return '='
  }

  const getBiasText = (score) => {
    if (score >= 5) return 'Bullish'
    if (score <= -5) return 'Bearish'
    return 'Neutral'
  }

  const getGradeColor = (grade) => {
    if (grade === 'A+' || grade === 'A') return 'text-green-400'
    if (grade === 'A-' || grade === 'B+') return 'text-yellow-400'
    return 'text-red-400'
  }

  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 w-[500px]">
      <div className="bg-[#0a0e27]/95 border-2 border-green-500 rounded-lg p-4 backdrop-blur-sm">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-semibold text-sm">MULTI-TIME FRAME BIAS MATRIX</h3>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">COVERAGE: 5TF</span>
          </div>
        </div>

        {/* Aggregate Score */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm">AGGREGATE BIAS:</span>
            <span className={`text-xl font-bold ${getScoreColor(aggregate?.score || 0)}`}>
              {aggregate?.score > 0 ? '+' : ''}{aggregate?.score || 0}
            </span>
            <span className={`text-xs px-2 py-1 rounded ${getGradeColor(aggregate?.grade || 'C')}`}>
              (GRADE: {aggregate?.grade || 'C'})
            </span>
            <span className={`text-sm font-semibold ${aggregate?.score > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {getBiasIcon(aggregate?.score || 0)} {getBiasText(aggregate?.score || 0)}
            </span>
          </div>
        </div>

        {/* Settings Summary */}
        <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
          <div className="text-gray-400">
            <span className="text-gray-500">RSI Period:</span> {settings?.rsiLength || 14}%
          </div>
          <div className="text-gray-400">
            <span className="text-gray-500">EMA Period:</span> {settings?.emaLength || 50}%
          </div>
          <div className="text-gray-400">
            <span className="text-gray-500">ADX Threshold:</span> {settings?.adxThreshold || 25}
          </div>
          <div className="text-gray-400">
            <span className="text-gray-500">Alerts: On Bias</span>
          </div>
        </div>

        {/* Indicator Legend */}
        <div className="flex gap-4 mb-3 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-gray-400">EMA</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span className="text-gray-400">RSI</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
            <span className="text-gray-400">MACD</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-purple-500 rounded"></div>
            <span className="text-gray-400">ST</span>
          </div>
        </div>

        {/* Confidence Bar */}
        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>CONFIDENCE</span>
            <span className="text-white font-semibold">{((aggregate?.confidence || 0) * 100).toFixed(0)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${getConfidenceColor(aggregate?.confidence || 0)}`}
              style={{ width: `${(aggregate?.confidence || 0) * 100}%` }}
            />
          </div>
        </div>

        {/* Timeframe Matrix Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left text-gray-400 font-medium py-2 px-2">Timeframe</th>
                <th className="text-center text-gray-400 font-medium py-2 px-1">SCORE</th>
                <th className="text-center text-gray-400 font-medium py-2 px-1">CONFIDENT</th>
                <th className="text-center text-gray-400 font-medium py-2 px-1">EMA</th>
                <th className="text-center text-gray-400 font-medium py-2 px-1">RSI</th>
                <th className="text-center text-gray-400 font-medium py-2 px-1">MACD</th>
                <th className="text-center text-gray-400 font-medium py-2 px-1">SUPERTREND</th>
              </tr>
            </thead>
            <tbody>
              {data?.slice(0, 5).map((tf, idx) => (
                <tr key={idx} className="border-b border-gray-800 hover:bg-gray-800/50">
                  <td className="py-2 px-2 text-white font-medium">{tf.timeframe}</td>
                  <td className={`py-2 px-1 text-center font-bold ${getScoreColor(tf.score)}`}>
                    {tf.score > 0 ? '+' : ''}{tf.score}
                  </td>
                  <td className="py-2 px-1 text-center">
                    <div className="flex justify-center">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${getConfidenceColor(tf.confidence)}`}>
                        <span className="text-white text-[10px]">{(tf.confidence * 100).toFixed(0)}</span>
                      </div>
                    </div>
                  </td>
                  <td className={`py-2 px-1 text-center font-semibold ${tf.indicators?.ema > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {tf.indicators?.ema > 0 ? '+' : ''}{tf.indicators?.ema?.toFixed(1)}
                  </td>
                  <td className={`py-2 px-1 text-center font-semibold ${tf.indicators?.rsi > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {tf.indicators?.rsi > 0 ? '+' : ''}{tf.indicators?.rsi?.toFixed(1)}
                  </td>
                  <td className={`py-2 px-1 text-center font-semibold ${tf.indicators?.macd > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {tf.indicators?.macd > 0 ? '+' : ''}{tf.indicators?.macd?.toFixed(1)}
                  </td>
                  <td className="py-2 px-1 text-center">
                    <div className="flex justify-center items-center gap-1">
                      <div className={`w-4 h-4 flex items-center justify-center rounded ${tf.indicators?.supertrend > 0 ? 'bg-green-500' : 'bg-red-500'}`}>
                        <span className="text-white text-[10px]">{tf.indicators?.supertrend > 0 ? '+' : '-'}1</span>
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
  )
}

export default TrendMatrixOverlay
