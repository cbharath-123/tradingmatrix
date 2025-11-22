// Vercel serverless function for health check
module.exports = (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'TradeMatrix API',
    version: '1.0.0',
    env: {
      nodeEnv: process.env.NODE_ENV,
      hasApiKey: !!process.env.ALPHA_VANTAGE_API_KEY,
      apiKeyPrefix: process.env.ALPHA_VANTAGE_API_KEY ? process.env.ALPHA_VANTAGE_API_KEY.substring(0, 4) + '***' : 'NOT_SET'
    }
  });
};
