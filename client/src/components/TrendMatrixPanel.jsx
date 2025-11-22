import React from 'react'
import ToggleSwitch from './ToggleSwitch'

function TrendMatrixPanel({ data }) {
  const {
    aggregateBias = 72,
    grade = 'A-',
    confidence = 0.88,
    settings = {},
    indicatorToggles = {},
    matrixData = []
  } = data || {}

  // Specific cell background logic to match screenshot exactly
  const getCellBackground = (type, value) => {
    const val = typeof value === 'number' ? value : 0

    switch(type) {
      case 'score':
        if (val >= 60) return 'bg-[#15803d]'
        if (val >= 40) return 'bg-[#166534]'
        if (val >= 0) return 'bg-[#16a34a]'
        if (val >= -40) return 'bg-[#14532d]'
        return 'bg-[#0b1120]'
      case 'confident':
        if (val >= 0.8) return 'bg-[#a7f3d0] text-black'
        if (val >= 0.7) return 'bg-[#6ee7b7] text-black'
        if (val >= 0.6) return 'bg-[#22c55e] text-white'
        if (val >= 0.45) return 'bg-[#bef264] text-black'
        return 'bg-[#14532d] text-white'
      case 'adx':
        return 'bg-transparent'
      case 'ema':
        if (val >= 1.0) return 'bg-[#bbf7d0] text-black'
        if (val >= 0.8) return 'bg-[#facc15] text-black'
        if (val >= 0.5) return 'bg-[#86efac] text-black'
        if (val >= 0) return 'bg-[#4ade80] text-black'
        if (val >= -0.3) return 'bg-[#fde68a] text-black'
        if (val >= -0.8) return 'bg-[#15803d] text-white'
        return 'bg-[#14532d] text-white'
      case 'rsi':
        if (val >= 0.6) return 'bg-[#bbf7d0] text-black'
        if (val >= 0.5) return 'bg-[#86efac] text-black'
        if (val >= 0.2) return 'bg-[#4ade80] text-black'
        if (val >= 0) return 'bg-[#22c55e] text-white'
        if (val >= -0.5) return 'bg-[#15803d] text-white'
        if (val >= -0.9) return 'bg-[#14532d] text-white'
        return 'bg-[#0b1120] text-white'
      case 'macd':
        if (val >= 0.9) return 'bg-[#bbf7d0] text-black'
        if (val >= 0.6) return 'bg-[#86efac] text-black'
        if (val >= 0.3) return 'bg-[#4ade80] text-black'
        if (val >= 0) return 'bg-[#22c55e] text-white'
        if (val >= -0.3) return 'bg-[#15803d] text-white'
        if (val >= -0.8) return 'bg-[#166534] text-white'
        return 'bg-[#0b1120] text-white'
      case 'st_val':
        if (val > 0) return 'bg-[#86efac] text-black'
        if (val < 0) return 'bg-[#d1d5db] text-black'
        return 'bg-[#86efac] text-black'
      default:
        return ''
    }
  }

  const getConfidenceCircle = (score, value) => {
    const normalizedScore = typeof score === 'number' ? score : 0
    const normalizedConfidence = typeof value === 'number' ? value : 0

    if (normalizedScore < 0) {
      return {
        ring: 'border-[#ef4444]',
        dot: 'bg-[#ef4444]'
      }
    }

    if (normalizedConfidence >= 0.75) {
      return {
        ring: 'border-[#2563eb]',
        dot: 'bg-[#1e40af]'
      }
    }

    if (normalizedConfidence >= 0.6) {
      return {
        ring: 'border-[#94a3b8]',
        dot: 'bg-[#1f2937]'
      }
    }

    return {
      ring: 'border-[#6b7280]',
      dot: 'bg-[#374151]'
    }
  }

  const getSupertrendIcon = (value) => {
    if (value > 0) {
      return {
        cell: 'bg-[#dcfce7]',
        border: 'border-[#22c55e]',
        fill: 'bg-[#16a34a]'
      }
    }

    return {
      cell: 'bg-[#f3f4f6]',
      border: 'border-[#ef4444]',
      fill: 'bg-[#ef4444]'
    }
  }

  return (
    <div 
      className="bg-[#111318] text-white overflow-hidden relative shadow-2xl font-sans flex flex-col w-full"
      style={{
        height: '100%',
        borderRadius: '8px',
        borderWidth: '2px',
        borderColor: '#2d3748',
        borderStyle: 'solid'
      }}
    >
      {/* Header Section */}
      <div className="px-4 pt-3 pb-2 relative shrink-0">
        <div className="flex justify-between items-start">
          <div className="flex-1 pr-16">
            <h2 className="text-[10px] font-bold text-gray-100 tracking-[0.15em] mb-0.5">MULTI-TIME FRAME BIAS MATRIX</h2>
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-[#22c55e] text-sm font-bold">
                AGGREGATE BIAS: {aggregateBias > 0 ? '+' : ''}{aggregateBias}
              </span>
              <span className="text-gray-200 text-xs font-semibold">
                (GRADE: {grade})
              </span>
              <div className="flex items-center gap-1 text-[#22c55e] text-sm font-bold">
                <span>{aggregateBias >= 0 ? '↑↑' : '↓↓'}</span>
                <span>{aggregateBias >= 0 ? 'Bullish' : 'Bearish'}</span>
              </div>
            </div>
          </div>

          {/* Gauge */}
          <div className="absolute top-2 right-3 w-16 h-10 flex flex-col items-center">
            <svg className="w-full h-full" viewBox="0 0 120 70">
              <path d="M 15,55 A 45,45 0 0,1 105,55" fill="none" stroke="#1f2937" strokeWidth="5" strokeLinecap="round" />
              <path d="M 15,55 A 45,45 0 0,1 105,55" fill="none" stroke="#22c55e" strokeWidth="5" strokeLinecap="round" strokeDasharray={`${Math.max(0, Math.min(1, confidence || 0)) * 141} 141`} />
              <g transform={`rotate(${Math.max(0, Math.min(1, confidence || 0)) * 180 - 90} 60 55)`}>
                <line x1="60" y1="55" x2="60" y2="30" stroke="#22c55e" strokeWidth="3" />
                <circle cx="60" cy="55" r="4" fill="#22c55e" />
              </g>
            </svg>
            <div className="mt-[-4px] text-[7px] uppercase tracking-[0.2em] text-gray-400 font-semibold">
              conf {confidence?.toFixed(2) || '0.00'}
            </div>
          </div>
        </div>
        
        {/* Green underline bar */}
        <div className="w-[35%] h-[2px] bg-[#22c55e] mt-1 rounded-full"></div>
        <div className="w-full h-[1px] bg-gray-800 mt-[-1px] z-[-1]"></div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-[140px] px-3 py-2 space-y-2 text-[10px] shrink-0 border-r border-gray-800/60">
          <div className="space-y-1 text-gray-200 font-medium">
            <div className="flex justify-between">
              <span>RSI Period:</span>
              <span>{settings.rsiPeriod || '4.02'}%</span>
            </div>
            <div className="flex justify-between">
              <span>EMA Period:</span>
              <span>{settings.emaPeriod || '4.02'}%</span>
            </div>
            <div className="flex justify-between">
              <span>ADX Threshold:</span>
              <span>{settings.adxThreshold || 25}</span>
            </div>
            <div className="flex justify-between">
              <span>Alerts On:</span>
              <span>Bias</span>
            </div>
            <div className="flex justify-between">
              <span>Strong Trend</span>
              <span>+60</span>
            </div>
          </div>

          <div className="pt-1">
            <h3 className="text-gray-300 mb-2 uppercase text-[8px] font-bold tracking-[0.25em]">CONFIDENCE</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-200">EMA</span>
                <ToggleSwitch enabled={indicatorToggles.ema !== false} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-200">RSI</span>
                <ToggleSwitch enabled={indicatorToggles.rsi !== false} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-200">MACD</span>
                <ToggleSwitch enabled={indicatorToggles.macd !== false} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-200">ST <span className="text-[10px] text-gray-500 ml-1">1Week</span></span>
                <ToggleSwitch enabled={indicatorToggles.st !== false} />
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full border-collapse">
            <thead className="sticky top-0 bg-[#111318] z-10">
              <tr className="text-gray-200 text-[8px] font-bold uppercase tracking-wider">
                <th className="pb-1 pt-2 text-center border-b border-gray-800">Timeframe</th>
                <th className="pb-1 pt-2 text-center border-b border-gray-800">SCORE</th>
                <th className="pb-1 pt-2 text-center border-b border-gray-800" colSpan="2">CONFIDENT</th>
                <th className="pb-1 pt-2 text-center border-b border-gray-800">EMA</th>
                <th className="pb-1 pt-2 text-center border-b border-gray-800">RSI</th>
                <th className="pb-1 pt-2 text-center border-b border-gray-800">MACD</th>
                <th className="pb-1 pt-2 text-center border-b border-gray-800" colSpan="2">ST</th>
              </tr>
            </thead>
            <tbody className="text-[10px] font-bold">
              {matrixData && matrixData.length > 0 ? matrixData.map((row, idx) => {
                const circleStyles = getConfidenceCircle(row.score, row.confidence)
                const stStyles = getSupertrendIcon(row.supertrend)

                return (
                  <tr key={idx} className="border-b border-gray-800/50 h-[40px]">
                  {/* Timeframe */}
                  <td className="bg-[#1f2937] text-white text-center w-14 border border-gray-700 text-[9px]">
                    {row.timeframe}
                  </td>
                  
                  {/* Score */}
                  <td className={`${getCellBackground('score', row.score)} text-white text-center border border-gray-700 w-14`}>
                    {row.score > 0 ? '+' : ''}{row.score}
                  </td>

                  {/* Confident Value */}
                  <td className={`${getCellBackground('confident', row.confidence)} text-center border border-gray-700 w-12`}>
                    {row.confidence?.toFixed(2)}
                  </td>

                  {/* Confident Icon (ADX) */}
                  <td className="text-center w-8 border border-gray-700 bg-[#111318]">
                    <div className="flex justify-center">
                      <div className={`w-3.5 h-3.5 rounded-full border-2 ${circleStyles.ring} flex items-center justify-center bg-[#0b1120]`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${circleStyles.dot}`}></div>
                      </div>
                    </div>
                  </td>

                  {/* EMA */}
                  <td className={`${getCellBackground('ema', row.ema)} text-center border border-gray-700 w-12`}>
                    {row.ema > 0 ? '+' : ''}{row.ema?.toFixed(1)}
                  </td>

                  {/* RSI */}
                  <td className={`${getCellBackground('rsi', row.rsi)} text-center border border-gray-700 w-12`}>
                    {row.rsi > 0 ? '+' : ''}{row.rsi?.toFixed(1)}
                  </td>

                  {/* MACD */}
                  <td className={`${getCellBackground('macd', row.macd)} text-center border border-gray-700 w-12`}>
                    {row.macd > 0 ? '+' : ''}{row.macd?.toFixed(1)}
                  </td>

                  {/* Supertrend Icon */}
                  <td className={`${stStyles.cell} text-center w-8 border border-gray-700`}>
                    <div className="flex justify-center">
                      <div className={`w-3 h-3 border-2 ${stStyles.border} flex items-center justify-center bg-transparent`}>
                        <div className={`w-1.5 h-1.5 ${stStyles.fill}`}></div>
                      </div>
                    </div>
                  </td>

                  {/* Supertrend Value */}
                  <td className={`${getCellBackground('st_val', row.supertrend)} text-center border border-gray-700 w-10`}>
                    {row.supertrend > 0 ? '+' : ''}{row.supertrend}
                  </td>
                  </tr>
                )
              }) : (
                <tr><td colSpan="9" className="text-center py-10 text-gray-500">No Data</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default TrendMatrixPanel
