/**
 * Structured Logging Utility
 */

/**
 * Log levels for filtering and categorization
 */
const LOG_LEVELS = {
  ERROR: 'ERROR',
  WARN: 'WARN',
  INFO: 'INFO',
  DEBUG: 'DEBUG'
};

/**
 * Create structured log entry
 * @param {string} level - Log level
 * @param {string} message - Log message
 * @param {Object} context - Additional context data
 * @returns {Object} Formatted log entry
 */
function createLogEntry(level, message, context = {}) {
  return {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...context
  };
}

/**
 * Log server events
 * @param {string} message - Log message
 * @param {Object} context - Additional context
 */
function logServerEvent(message, context = {}) {
  const logEntry = createLogEntry(LOG_LEVELS.INFO, message, {
    type: 'SERVER_EVENT',
    ...context
  });
  console.log(JSON.stringify(logEntry));
}

/**
 * Log API requests
 * @param {string} method - HTTP method
 * @param {string} path - Request path
 * @param {Object} context - Additional context
 */
function logApiRequest(method, path, context = {}) {
  const logEntry = createLogEntry(LOG_LEVELS.INFO, `${method} ${path}`, {
    type: 'API_REQUEST',
    method,
    path,
    ...context
  });
  console.log(JSON.stringify(logEntry));
}

/**
 * Log stock changes with structured data
 * @param {number} productId - Product ID
 * @param {number} quantityChange - Quantity change
 * @param {number} newStock - New stock quantity
 * @param {string} operation - Operation type
 */
function logStockChange(productId, quantityChange, newStock, operation = 'update') {
  const action = quantityChange > 0 ? 'decreased' : 'increased';
  const absChange = Math.abs(quantityChange);
  
  const logEntry = createLogEntry(LOG_LEVELS.INFO, `Stock ${action} for product ${productId}`, {
    type: 'STOCK_CHANGE',
    productId,
    quantityChange,
    absChange,
    newStock,
    operation,
    action
  });
  
  console.log(JSON.stringify(logEntry));
}

/**
 * Log cart operations
 * @param {string} operation - Cart operation (add, update, remove)
 * @param {number} productId - Product ID
 * @param {Object} context - Additional context
 */
function logCartOperation(operation, productId, context = {}) {
  const logEntry = createLogEntry(LOG_LEVELS.INFO, `Cart ${operation}: product ${productId}`, {
    type: 'CART_OPERATION',
    operation,
    productId,
    ...context
  });
  
  console.log(JSON.stringify(logEntry));
}

/**
 * Log errors with structured data
 * @param {string} message - Error message
 * @param {Error} error - Error object
 * @param {Object} context - Additional context
 */
function logError(message, error = null, context = {}) {
  const logEntry = createLogEntry(LOG_LEVELS.ERROR, message, {
    type: 'ERROR',
    error: error ? {
      message: error.message,
      stack: error.stack,
      name: error.name
    } : null,
    ...context
  });
  
  console.error(JSON.stringify(logEntry));
}

/**
 * Log warnings
 * @param {string} message - Warning message
 * @param {Object} context - Additional context
 */
function logWarning(message, context = {}) {
  const logEntry = createLogEntry(LOG_LEVELS.WARN, message, {
    type: 'WARNING',
    ...context
  });
  
  console.warn(JSON.stringify(logEntry));
}

/**
 * Log performance metrics
 * @param {string} operation - Operation name
 * @param {number} duration - Duration in milliseconds
 * @param {Object} context - Additional context
 */
function logPerformance(operation, duration, context = {}) {
  const logEntry = createLogEntry(LOG_LEVELS.INFO, `Performance: ${operation}`, {
    type: 'PERFORMANCE',
    operation,
    duration,
    unit: 'ms',
    ...context
  });
  
  console.log(JSON.stringify(logEntry));
}

/**
 * Simple console logging for development (non-structured)
 * @param {string} message - Message to log
 */
function logSimple(message) {
  console.log(message);
}

module.exports = {
  LOG_LEVELS,
  logServerEvent,
  logApiRequest,
  logStockChange,
  logCartOperation,
  logError,
  logWarning,
  logPerformance,
  logSimple
};