import React from 'react'

function MainContent({ children }) {
  return (
    <main className="flex-1 bg-[#0a0e27] overflow-y-auto">
      <div className="p-6">
        {children}
      </div>
    </main>
  )
}

export default MainContent
