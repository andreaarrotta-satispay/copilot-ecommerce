/**
 * Stock Management Utilities - Handle product stock operations
 */

/**
 * Find product by ID in products array
 * @param {Array} products - Products array
 * @param {number} productId - Product ID to find
 * @returns {Object|null} Product object or null if not found
 */
function findProduct(products, productId) {
  return products.find(p => p.id === productId) || null;
}

/**
 * Validate stock availability for adding items
 * @param {Object} product - Product object
 * @param {number} requestedQuantity - Quantity requested
 * @returns {Object} Validation result with isValid and error message
 */
function validateStockAvailability(product, requestedQuantity) {
  if (!product.inStock) {
    return {
      isValid: false,
      error: 'Product is out of stock',
      availableStock: product.stockQuantity
    };
  }
  
  if (product.stockQuantity < requestedQuantity) {
    return {
      isValid: false,
      error: 'Insufficient stock quantity available',
      availableStock: product.stockQuantity
    };
  }
  
  return { isValid: true };
}

/**
 * Validate stock for cart quantity updates
 * @param {Object} product - Product object
 * @param {number} currentCartQuantity - Current quantity in cart
 * @param {number} requestedQuantity - Additional quantity requested
 * @returns {Object} Validation result
 */
function validateCartStockUpdate(product, currentCartQuantity, requestedQuantity) {
  const newTotalQuantity = currentCartQuantity + requestedQuantity;
  const availableStock = product.stockQuantity + currentCartQuantity;
  
  if (newTotalQuantity > availableStock) {
    return {
      isValid: false,
      error: 'Cannot add more items. Insufficient stock quantity available',
      availableStock: availableStock - currentCartQuantity,
      currentCartQuantity: currentCartQuantity
    };
  }
  
  if (newTotalQuantity < 0) {
    return {
      isValid: false,
      error: 'Cannot reduce quantity below zero',
      currentCartQuantity: currentCartQuantity
    };
  }
  
  return { isValid: true };
}

/**
 * Update product stock quantity in memory
 * @param {Array} products - Products array
 * @param {number} productId - Product ID
 * @param {number} quantityChange - Quantity change (negative for removal)
 * @returns {Object} Result with success status and updated product
 */
function updateProductStock(products, productId, quantityChange) {
  const productIndex = products.findIndex(p => p.id === productId);
  
  if (productIndex === -1) {
    return { success: false, error: 'Product not found' };
  }
  
  const product = products[productIndex];
  product.stockQuantity -= quantityChange;
  
  // Ensure stock doesn't go negative
  if (product.stockQuantity < 0) {
    product.stockQuantity = 0;
  }
  
  // Update inStock status
  product.inStock = product.stockQuantity > 0;
  
  return { 
    success: true, 
    product: product,
    newStockQuantity: product.stockQuantity
  };
}


module.exports = {
  findProduct,
  validateStockAvailability,
  validateCartStockUpdate,
  updateProductStock
};