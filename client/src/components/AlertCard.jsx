import React from 'react'

function AlertCard({ type, aggregateScore, confidence, timeframes }) {
  const isStrongBullish = type === 'bullish'
  
  return (
    <div className={`rounded-lg p-6 border-2 ${
      isStrongBullish 
        ? 'bg-[#10b981]/10 border-[#10b981]' 
        : 'bg-[#ef4444]/10 border-[#ef4444]'
    }`}>
      <div className="flex items-start justify-between">
        <div>
          <h3 className={`text-2xl font-bold mb-3 ${
            isStrongBullish ? 'text-[#00ff88]' : 'text-[#ff3366]'
          }`}>
            ALERT TRIGGERED - Strong {isStrongBullish ? 'Bullish' : 'Bearish'}
          </h3>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <span className="text-gray-400 text-lg">Aggregate Score:</span>
              <span className={`text-2xl font-bold ${
                isStrongBullish ? 'text-[#00ff88]' : 'text-[#ff3366]'
              }`}>
                {aggregateScore > 0 ? '+' : ''}{aggregateScore}
              </span>
            </div>
            
            <div className="flex items-center space-x-3">
              <span className="text-gray-400 text-lg">Confidence:</span>
              <span className="text-2xl font-bold text-white">{confidence}</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <span className="text-gray-400 text-lg">Timeframes in Agreement:</span>
              <span className="text-2xl font-bold text-white">{timeframes}</span>
            </div>
          </div>
        </div>
        
        <button className="w-12 h-12 rounded-full bg-[#2d3748] flex items-center justify-center hover:bg-[#374151] transition-colors">
          <span className="text-2xl">⟳</span>
        </button>
      </div>
    </div>
  )
}

export default AlertCard
