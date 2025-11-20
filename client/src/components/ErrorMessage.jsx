import React from 'react'

function ErrorMessage({ error, onRetry }) {
  return (
    <div className="bg-[#ef4444]/10 border-2 border-[#ef4444] rounded-lg p-6">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <span className="text-4xl">⚠️</span>
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-[#ff3366] mb-2">Error Loading Data</h3>
          <p className="text-gray-300 mb-4">{error || 'An unexpected error occurred'}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="bg-[#3366ff] hover:bg-[#3366ff]/80 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ErrorMessage
