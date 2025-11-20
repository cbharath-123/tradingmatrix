const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Placeholder API endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'success',
    message: 'TradeMatrix API is running',
    timestamp: new Date().toISOString()
  });
});

// Test endpoint for stock data
app.get('/api/stocks/:symbol', (req, res) => {
  const { symbol } = req.params;
  res.json({
    symbol: symbol.toUpperCase(),
    message: 'Stock endpoint ready - will integrate real data in Phase 2'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
