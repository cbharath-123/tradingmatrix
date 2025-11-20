# TradeMatrix - Stock Analysis Dashboard

A full-stack stock analysis dashboard featuring multi-time frame technical analysis with real-time indicators.

## 🚀 Technology Stack

### Frontend
- **React 19** with **Vite** for fast development
- **Tailwind CSS** for styling
- Responsive design matching Figma mockups

### Backend
- **Node.js** with **Express.js**
- RESTful API architecture
- CORS enabled for cross-origin requests

## 📁 Project Structure

```
trading-website/
├── client/              # React frontend
│   ├── src/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── public/
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
├── server/              # Express backend
│   ├── index.js
│   ├── .env
│   └── package.json
├── package.json         # Root package for running both
└── .gitignore
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Install all dependencies:**
   ```bash
   npm run install-all
   ```

2. **Run the development servers:**
   ```bash
   npm run dev
   ```

   This will start:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

### Individual Commands

- **Run only frontend:** `npm run client`
- **Run only backend:** `npm run server`
- **Build frontend:** `cd client && npm run build`

## 🔄 Git Workflow

### Branching Strategy

- **main**: Production-ready code
- **develop**: Active development branch (current)

**Why use a develop branch?**
- Keeps main stable and production-ready
- Allows testing features before merging to production
- Enables team collaboration without breaking the main branch
- Easy rollback if issues arise

### Git Commands

```bash
# Switch to develop branch
git checkout develop

# Switch to main branch
git checkout main

# Create a new feature branch
git checkout -b feature/your-feature-name

# Commit changes
git add .
git commit -m "Your message"

# Merge develop into main when ready
git checkout main
git merge develop
```

## 📋 Features (From Figma Design)

1. **Trading Chart View**
   - Candlestick chart with volume
   - Moving averages overlay
   - Interactive timeframes

2. **Multi-Time Frame Bias Matrix**
   - Technical indicators: EMA, RSI, MACD, ADX
   - Multiple timeframes: 15m, 1h, 4h, 1d, 1w
   - Color-coded signal strength
   - Aggregate score with confidence level

3. **Alert System**
   - Strong trend alerts (Bullish/Bearish)
   - Bias flip notifications
   - Timeframe agreement tracking

4. **Input Settings Panel**
   - Configurable indicator periods
   - ADX threshold settings
   - Alert toggles

## 🧪 API Endpoints

- `GET /api/health` - Check server status
- `GET /api/stocks/:symbol` - Get stock data (placeholder)

## 📝 Next Steps (Phase 2)

- Integrate real stock data API
- Build chart component with charting library
- Implement technical indicator calculations
- Create bias matrix component
- Add WebSocket for real-time updates

---

**Built with ❤️ for traders**
