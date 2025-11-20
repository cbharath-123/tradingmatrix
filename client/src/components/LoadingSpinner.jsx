import React from 'react'

function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative w-16 h-16">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-[#2d3748] rounded-full"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-t-[#00ff88] rounded-full animate-spin"></div>
      </div>
      <p className="mt-4 text-gray-400 text-lg">{message}</p>
    </div>
  )
}

export default LoadingSpinner
