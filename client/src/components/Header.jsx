import React from 'react'

function Header() {
  return (
    <header className="bg-[#1a1f3a] border-b border-[#2d3748] px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <h1 className="text-2xl font-bold text-[#00ff88]">TRADEMATRIX</h1>
          <span className="text-sm text-gray-400 px-3 py-1 bg-[#252b47] rounded">BETA</span>
        </div>
        
        <div className="flex items-center space-x-6">
          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search symbol..."
              className="bg-[#252b47] text-white px-4 py-2 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-[#3366ff] placeholder-gray-500"
            />
          </div>
          
          {/* User Info */}
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm text-white">Trading Account</p>
              <p className="text-xs text-gray-400">Live Market</p>
            </div>
            <div className="w-10 h-10 bg-[#3366ff] rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">U</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
