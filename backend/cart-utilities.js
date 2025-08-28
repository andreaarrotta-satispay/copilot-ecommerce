/**
 * Cart Utilities - Common cart operations and validation logic
 */

/**
 * Extract cart from request cookies
 * @param {Object} req - Express request object
 * @returns {Array} Cart items array
 */
function getCartFromCookies(req) {
  return req.cookies.cart ? JSON.parse(req.cookies.cart) : [];
}

/**
 * Save cart to response cookies
 * @param {Object} res - Express response object
 * @param {Array} cart - Cart items array
 */
function saveCartToCookies(res, cart) {
  res.cookie('cart', JSON.stringify(cart), { httpOnly: true });
}

/**
 * Find product in cart by product ID
 * @param {Array} cart - Cart items array
 * @param {number} productId - Product ID to find
 * @returns {Object} Object with item and index, or null if not found
 */
function findCartItem(cart, productId) {
  const index = cart.findIndex(item => item.productId === productId);
  return index > -1 ? { item: cart[index], index } : null;
}

/**
 * Add new product to cart
 * @param {Array} cart - Cart items array
 * @param {number} productId - Product ID
 * @param {number} quantity - Quantity to add
 */
function addNewCartItem(cart, productId, quantity) {
  cart.push({ productId, quantity });
}

/**
 * Update existing cart item quantity
 * @param {Array} cart - Cart items array
 * @param {number} index - Index of cart item
 * @param {number} newQuantity - New quantity
 * @returns {boolean} True if item was removed (quantity became 0)
 */
function updateCartItemQuantity(cart, index, newQuantity) {
  if (newQuantity === 0) {
    cart.splice(index, 1);
    return true; // Item was removed
  } else {
    cart[index].quantity = newQuantity;
    return false; // Item was updated
  }
}

/**
 * Remove cart item completely
 * @param {Array} cart - Cart items array
 * @param {number} index - Index of cart item to remove
 * @returns {number} Quantity that was removed
 */
function removeCartItem(cart, index) {
  const removedQuantity = cart[index].quantity;
  cart.splice(index, 1);
  return removedQuantity;
}

module.exports = {
  getCartFromCookies,
  saveCartToCookies,
  findCartItem,
  addNewCartItem,
  updateCartItemQuantity,
  removeCartItem
};