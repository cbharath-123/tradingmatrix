import React from 'react'
import ToggleSwitch from './ToggleSwitch'

function TrendMatrixTable({ data, aggregate, symbol, settings }) {
  // Helper for background colors based on value intensity
  const getIntensityColor = (val, type = 'standard') => {
    // Custom logic to match screenshot colors
    if (type === 'score') {
      if (val >= 60) return 'bg-[#15803d]' // Strong Green
      if (val >= 40) return 'bg-[#16a34a]' // Green
      if (val >= 0) return 'bg-[#22c55e]' // Light Green
      if (val >= -40) return 'bg-[#b91c1c]' // Red
      return 'bg-[#991b1b]' // Dark Red
    }
    return 'bg-gray-700'
  }

  // Specific cell background logic to match screenshot
  const getCellBackground = (type, value) => {
    switch(type) {
      case 'score':
        if (value >= 60) return 'bg-[#16a34a]'
        if (value >= 40) return 'bg-[#22c55e]'
        if (value >= 0) return 'bg-[#16a34a]'
        if (value < 0) return 'bg-[#16a34a]' 
        return 'bg-gray-800'
      case 'confident':
        if (value >= 0.8) return 'bg-[#86efac] text-black'
        if (value >= 0.7) return 'bg-[#86efac] text-black'
        if (value >= 0.4) return 'bg-[#bef264] text-black'
        return 'bg-[#86efac] text-black'
      case 'adx': // The circle column
        if (value >= 0.8) return 'bg-[#16a34a]' 
        if (value >= 0.5) return 'bg-[#22c55e]' 
        return 'bg-[#16a34a]'
      case 'ema':
        if (value >= 1.0) return 'bg-[#86efac] text-black'
        if (value >= 0.8) return 'bg-[#fef08a] text-black' 
        if (value < 0) return 'bg-[#4ade80] text-black'
        return 'bg-[#86efac] text-black'
      case 'rsi':
        if (value >= 0.6) return 'bg-[#4ade80] text-black'
        if (value >= 0.5) return 'bg-[#4ade80] text-black'
        if (value >= 0.2) return 'bg-[#4ade80] text-black'
        if (value < 0) return 'bg-[#4ade80] text-black'
        return 'bg-[#4ade80] text-black'
      case 'macd':
        if (value >= 0.9) return 'bg-[#4ade80] text-black'
        if (value >= 0.6) return 'bg-[#4ade80] text-black'
        if (value < 0) return 'bg-[#4ade80] text-black'
        return 'bg-[#4ade80] text-black'
      case 'st_icon':
        if (value > 0) return 'bg-[#4ade80]'
        return 'bg-[#ef4444]'
      case 'st_val':
        if (value > 0) return 'bg-[#86efac] text-black'
        if (value < 0) return 'bg-[#e5e7eb] text-black' 
        return 'bg-[#86efac] text-black'
      default:
        return ''
    }
  }

  return (
    <div 
      className="bg-[#111318] text-white overflow-hidden relative shadow-2xl font-sans"
      style={{
        width: '980px',
        height: '580px',
        borderRadius: '10px',
        borderWidth: '3px',
        borderColor: '#2d3748',
        borderStyle: 'solid'
      }}
    >
      {/* Header Section */}
      <div className="px-8 pt-6 pb-3 relative">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-base font-bold text-gray-100 tracking-wide mb-2">MULTI-TIME FRAME BIAS MATRIX</h2>
            <div className="flex items-baseline gap-3">
              <span className="text-[#22c55e] text-2xl font-bold">
                AGGREGATE BIAS: {aggregate?.score > 0 ? '+' : ''}{aggregate?.score || 72}
              </span>
              <span className="text-gray-200 text-xl font-semibold">
                (GRADE: {aggregate?.grade || 'A-'})
              </span>
              <div className="flex items-center gap-2 text-[#22c55e] text-2xl font-bold ml-2">
                <span>↑↑</span>
                <span>Bullish</span>
              </div>
            </div>
          </div>

          {/* Gauge */}
          <div className="absolute top-4 right-8 w-32 h-20">
             <svg className="w-full h-full" viewBox="0 0 100 55">
              <path d="M 10,50 A 40,40 0 0,1 90,50" fill="none" stroke="#374151" strokeWidth="4" strokeLinecap="round" />
              <path d="M 10,50 A 40,40 0 0,1 90,50" fill="none" stroke="#22c55e" strokeWidth="4" strokeLinecap="round" strokeDasharray={`${(aggregate?.confidence || 0.88) * 126} 126`} />
              <g transform={`rotate(${(aggregate?.confidence || 0.88) * 180 - 90} 50 50)`}>
                <line x1="50" y1="50" x2="50" y2="20" stroke="#22c55e" strokeWidth="2" />
                <circle cx="50" cy="50" r="3" fill="#22c55e" />
              </g>
            </svg>
            <div className="absolute bottom-0 w-full text-center">
               <div className="text-[9px] text-gray-400 font-bold">CONFIDENCE {aggregate?.confidence || 0.88}</div>
            </div>
            <div className="absolute top-0 right-0 text-[9px] text-gray-500">300.00</div>
          </div>
        </div>
        
        {/* Green underline bar */}
        <div className="w-[35%] h-[3px] bg-[#22c55e] mt-2 rounded-full"></div>
        <div className="w-full h-[1px] bg-gray-800 mt-[-1px] z-[-1]"></div>
      </div>

      <div className="flex h-full">
        {/* Left Sidebar */}
        <div className="w-[260px] px-8 py-5 space-y-6 text-sm">
          <div className="space-y-3 text-gray-300 font-medium">
            <div className="flex justify-between">
              <span>RSI Period:</span>
              <span>{settings?.rsiLength || '4.02'}%</span>
            </div>
            <div className="flex justify-between">
              <span>EMA Period:</span>
              <span>{settings?.emaLength || '4.02'}%</span>
            </div>
            <div className="flex justify-between">
              <span>ADX Threshold:</span>
              <span>{settings?.adxThreshold || 25}</span>
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

          <div className="pt-3">
            <h3 className="text-gray-400 mb-4 uppercase text-xs font-bold tracking-wider">CONFIDENCE</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">EMA</span>
                <ToggleSwitch enabled={true} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">RSI</span>
                <ToggleSwitch enabled={true} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">MACD</span>
                <ToggleSwitch enabled={true} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">ST <span className="text-[10px] text-gray-500 ml-1">1Week</span></span>
                <ToggleSwitch enabled={true} />
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 pr-6 pt-3">
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-gray-200 text-xs font-bold uppercase tracking-wider">
                <th className="pb-3 text-left pl-3">Timeframe</th>
                <th className="pb-3 text-center">SCORE</th>
                <th className="pb-3 text-center" colSpan="2">CONFIDENT</th>
                <th className="pb-3 text-center">EMA</th>
                <th className="pb-3 text-center">RSI</th>
                <th className="pb-3 text-center">MACD</th>
                <th className="pb-3 text-center" colSpan="2">SUPERTREND</th>
              </tr>
            </thead>
            <tbody className="text-base font-bold">
              {data && data.length > 0 ? data.map((row, idx) => (
                <tr key={idx} className="border-b border-gray-800/50 h-[68px]">
                  {/* Timeframe */}
                  <td className="bg-[#1f2937] text-white text-center w-24 border border-gray-700 text-sm">
                    {row.timeframe}
                  </td>
                  
                  {/* Score */}
                  <td className={`${getCellBackground('score', row.score)} text-white text-center border border-gray-700 w-24`}>
                    {row.score > 0 ? '+' : ''}{row.score}
                  </td>

                  {/* Confident Value */}
                  <td className={`${getCellBackground('confident', row.confidence)} text-center border border-gray-700 w-20`}>
                    {row.confidence?.toFixed(2)}
                  </td>

                  {/* Confident Icon (ADX) */}
                  <td className={`${getCellBackground('adx', row.confidence)} text-center w-16 border border-gray-700`}>
                    <div className="flex justify-center">
                      <div className={`w-5 h-5 rounded-full border-2 ${row.confidence > 0.8 ? 'border-blue-600' : 'border-gray-400'}`}></div>
                    </div>
                  </td>

                  {/* EMA */}
                  <td className={`${getCellBackground('ema', row.ema)} text-center border border-gray-700 w-20`}>
                    {row.ema > 0 ? '+' : ''}{row.ema?.toFixed(1)}
                  </td>

                  {/* RSI */}
                  <td className={`${getCellBackground('rsi', row.rsi)} text-center border border-gray-700 w-20`}>
                    {row.rsi > 0 ? '+' : ''}{row.rsi?.toFixed(1)}
                  </td>

                  {/* MACD */}
                  <td className={`${getCellBackground('macd', row.macd)} text-center border border-gray-700 w-20`}>
                    {row.macd > 0 ? '+' : ''}{row.macd?.toFixed(1)}
                  </td>

                  {/* Supertrend Icon */}
                  <td className={`${getCellBackground('st_icon', row.supertrend)} text-center w-14 border border-gray-700`}>
                    <div className="flex justify-center">
                      <div className="w-5 h-5 border-2 border-black flex items-center justify-center">
                        <div className="w-2.5 h-2.5 bg-black/20"></div>
                      </div>
                    </div>
                  </td>

                  {/* Supertrend Value */}
                  <td className={`${getCellBackground('st_val', row.supertrend)} text-center border border-gray-700 w-16`}>
                    {row.supertrend > 0 ? '+' : ''}{row.supertrend}
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="9" className="text-center py-10 text-gray-500">No Data</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default TrendMatrixTable
