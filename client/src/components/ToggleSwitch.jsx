import React from 'react'

function ToggleSwitch({ enabled, onToggle, label }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-white text-xs font-medium">{label}</span>
      <button
        onClick={onToggle}
        className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors focus:outline-none ${
          enabled ? 'bg-green-500' : 'bg-gray-600'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            enabled ? 'translate-x-5' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  )
}

export default ToggleSwitch
