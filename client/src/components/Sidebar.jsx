import React, { useState } from 'react'

function Sidebar() {
  const [activeItem, setActiveItem] = useState('Dashboard')
  
  const menuItems = [
    { icon: '📊', label: 'Dashboard', path: '/' },
    { icon: '📈', label: 'Analysis', path: '/analysis' },
    { icon: '⚡', label: 'Alerts', path: '/alerts' },
    { icon: '📋', label: 'Watchlist', path: '/watchlist' },
    { icon: '⚙️', label: 'Settings', path: '/settings' },
  ]

  const handleItemClick = (label) => {
    setActiveItem(label)
    console.log(`Navigating to: ${label}`)
    // In Phase 5, we'll add React Router for actual navigation
  }

  return (
    <aside className="bg-[#1a1f3a] w-64 min-h-screen border-r border-[#2d3748]">
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item, index) => (
            <li key={index}>
              <button
                onClick={() => handleItemClick(item.label)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors cursor-pointer ${
                  activeItem === item.label
                    ? 'bg-[#252b47] text-[#00ff88] border-l-4 border-[#00ff88]'
                    : 'text-gray-400 hover:bg-[#252b47] hover:text-white'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
        
        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-[#2d3748]">
          <div className="px-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">Market Status</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Status:</span>
                <span className="text-[#00ff88] flex items-center">
                  <span className="w-2 h-2 bg-[#00ff88] rounded-full mr-2"></span>
                  Open
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Volume:</span>
                <span className="text-white">High</span>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </aside>
  )
}

export default Sidebar
