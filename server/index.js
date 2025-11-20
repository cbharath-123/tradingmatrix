const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Import routes
const apiRoutes = require('./routes/api');

// Middleware
app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// API Routes
app.use('/api', apiRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    service: 'TradeMatrix API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/api/health',
      trendMatrix: '/api/trend-matrix/:symbol',
      symbols: '/api/symbols'
    },
    documentation: 'https://github.com/tradematrix/api-docs'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: `Route ${req.method} ${req.path} not found`
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 TradeMatrix API running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔑 Alpha Vantage API: ${process.env.ALPHA_VANTAGE_API_KEY ? 'Configured' : 'NOT CONFIGURED'}`);
  console.log(`\nAvailable endpoints:`);
  console.log(`  - http://localhost:${PORT}/api/health`);
  console.log(`  - http://localhost:${PORT}/api/trend-matrix/:symbol`);
  console.log(`  - http://localhost:${PORT}/api/symbols`);
});
