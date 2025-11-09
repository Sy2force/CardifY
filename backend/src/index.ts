/**
 * Entry point for Cardify Backend API
 * This file imports and starts the Express server
 */

import app from './server';
import { logger } from './services/logger';

const PORT = parseInt(process.env.PORT || '10000', 10);

// Start the server only if not in test environment
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, '0.0.0.0', () => {
    logger.info(`🚀 Cardify API Server running on port ${PORT}`);
    logger.info(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    logger.info(`🔗 Health check: http://localhost:${PORT}/api/health`);
  });
}

export default app;
