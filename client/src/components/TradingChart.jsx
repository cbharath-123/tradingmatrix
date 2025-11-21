import React, { useEffect, useRef } from 'react'

function TradingChart({ symbol = 'AAPL', theme = 'dark' }) {
  const containerRef = useRef(null)
  const widgetRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Clear existing widget
    if (widgetRef.current) {
      containerRef.current.innerHTML = ''
    }

    // Create TradingView widget script
    const script = document.createElement('script')
    script.src = 'https://s3.tradingview.com/tv.js'
    script.async = true
    script.onload = () => {
      if (window.TradingView) {
        widgetRef.current = new window.TradingView.widget({
          autosize: true,
          symbol: `NASDAQ:${symbol}`,
          interval: 'D',
          timezone: 'America/New_York',
          theme: theme,
          style: '1',
          locale: 'en',
          toolbar_bg: '#0a0e27',
          enable_publishing: false,
          hide_top_toolbar: false,
          hide_legend: false,
          save_image: false,
          container_id: 'tradingview_chart',
          studies: [
            'MASimple@tv-basicstudies',
            'RSI@tv-basicstudies',
            'Volume@tv-basicstudies'
          ],
          backgroundColor: '#0a0e27',
          gridColor: '#1a1f3a',
          hide_side_toolbar: false,
          allow_symbol_change: false,
          show_popup_button: false,
          popup_width: '1000',
          popup_height: '650',
          no_referral_id: true
        })
      }
    }
    document.head.appendChild(script)

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = ''
      }
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
    }
  }, [symbol, theme])

  return (
    <div className="w-full h-full bg-[#0a0e27]">
      <div 
        id="tradingview_chart" 
        ref={containerRef}
        className="w-full h-full"
      />
    </div>
  )
}

export default TradingChart
