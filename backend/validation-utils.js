/**
 * Validation Utilities - Common validation functions and error responses
 */

/**
 * Validate required request body fields
 * @param {Object} body - Request body
 * @param {Array} requiredFields - Array of required field names
 * @returns {Object} Validation result with isValid and error message
 */
function validateRequiredFields(body, requiredFields) {
  const missingFields = requiredFields.filter(field => !body[field]);
  
  if (missingFields.length > 0) {
    return {
      isValid: false,
      error: `Missing required fields: ${missingFields.join(', ')}`
    };
  }
  
  return { isValid: true };
}

/**
 * Validate numeric fields
 * @param {Object} data - Data object to validate
 * @param {Array} numericFields - Array of field names that should be numeric
 * @returns {Object} Validation result
 */
function validateNumericFields(data, numericFields) {
  for (const field of numericFields) {
    if (data[field] !== undefined && isNaN(Number(data[field]))) {
      return {
        isValid: false,
        error: `Field '${field}' must be a valid number`
      };
    }
  }
  
  return { isValid: true };
}

/**
 * Validate product ID parameter
 * @param {string|number} productId - Product ID to validate
 * @returns {Object} Validation result with parsed ID
 */
function validateProductId(productId) {
  const productIdNum = Number(productId);
  
  if (!productIdNum || productIdNum <= 0) {
    return {
      isValid: false,
      error: 'Product ID is required and must be a positive number'
    };
  }
  
  return {
    isValid: true,
    productId: productIdNum
  };
}

/**
 * Validate quantity for cart operations
 * @param {number} quantity - Quantity to validate
 * @param {boolean} allowZero - Whether zero quantity is allowed
 * @returns {Object} Validation result
 */
function validateQuantity(quantity, allowZero = false) {
  const quantityNum = Number(quantity);
  
  if (isNaN(quantityNum)) {
    return {
      isValid: false,
      error: 'Quantity must be a valid number'
    };
  }
  
  if (!allowZero && quantityNum === 0) {
    return {
      isValid: false,
      error: 'Quantity cannot be zero'
    };
  }
  
  return {
    isValid: true,
    quantity: quantityNum
  };
}

/**
 * Create standardized error response
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Error message
 * @param {Object} details - Additional error details
 * @returns {Object} Error response object
 */
function createErrorResponse(statusCode, message, details = {}) {
  return {
    statusCode,
    error: message,
    ...details
  };
}

/**
 * Send error response with consistent format
 * @param {Object} res - Express response object
 * @param {Object} errorResponse - Error response from createErrorResponse
 */
function sendErrorResponse(res, errorResponse) {
  const { statusCode, ...errorData } = errorResponse;
  res.status(statusCode).json(errorData);
}

module.exports = {
  validateRequiredFields,
  validateNumericFields,
  validateProductId,
  validateQuantity,
  createErrorResponse,
  sendErrorResponse
};