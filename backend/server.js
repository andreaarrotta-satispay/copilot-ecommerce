const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();

const { getDetailedCart } = require('./cart-helper');
const {
  getCartFromCookies,
  saveCartToCookies,
  findCartItem,
  addNewCartItem,
  updateCartItemQuantity,
  removeCartItem
} = require('./cart-utilities');
const {
  findProduct,
  validateStockAvailability,
  validateCartStockUpdate,
  updateProductStock
} = require('./stock-manager');
const {
  validateRequiredFields,
  validateProductId,
  validateQuantity,
  createErrorResponse,
  sendErrorResponse
} = require('./validation-utils');
const { logServerEvent, logSimple, logStockChange } = require('./logger');

// Load products into memory on startup
let products = [];
try {
  products = require('./product-test-data');
  logServerEvent(`Loaded ${products.length} products into memory`, { productCount: products.length });
} catch (error) {
  logServerEvent('Failed to load product data', { error: error.message });
  products = [];
}

app.use(cors({
  origin: ['http://localhost:3001', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(cookieParser());
app.use(express.json());


/**
 * GET /products - Retrieve filtered product catalog
 * 
 * Query Parameters:
 * - category (string): Filter by product category (case-insensitive). Use 'all' to show all categories
 * - inStock (boolean): Filter by availability status ('true' for in stock, 'false' for out of stock)
 * - search (string): Filter by partial product name match (case-insensitive)
 * 
 * Returns: Array of product objects matching the filter criteria
 * 
 * Example: GET /products?category=guitars&inStock=true&search=electric
 */
app.get('/products', (req, res) => {
    let filteredProducts = [...products];
    
    const { category, inStock, search } = req.query;
    
    // Filter by category (case-insensitive comparison)
    if (category && category !== 'all') {
        filteredProducts = filteredProducts.filter(product => 
            product.category.toLowerCase() === category.toLowerCase()
        );
    }
    
    // Filter by stock availability
    if (inStock !== undefined) {
        const stockFilter = inStock === 'true';
        filteredProducts = filteredProducts.filter(product => 
            product.inStock === stockFilter
        );
    }
    
    // Filter by product name search (partial match, case-insensitive)
    if (search && search.trim() !== '') {
        const searchTerm = search.toLowerCase().trim();
        filteredProducts = filteredProducts.filter(product => 
            product.name.toLowerCase().includes(searchTerm)
        );
    }
    
    res.json(filteredProducts);
});

/**
 * GET /categories - Retrieve available product categories
 * 
 * Returns: Array of unique category names (sorted alphabetically)
 * 
 * Example response: ["Guitars", "Keyboards", "Violins"]
 */
app.get('/categories', (req, res) => {
    const categories = [...new Set(products.map(product => product.category))];
    res.json(categories.sort());
});

/**
 * POST /carts/:cartId/products - Add or update product quantity in cart
 * 
 * Path Parameters:
 * - cartId (string): Cart identifier (currently using session for all carts)
 * 
 * Request Body:
 * - productId (number): ID of the product to add/update
 * - quantity (number): Quantity to add (positive) or remove (negative)
 * 
 * Returns: Cart object with updated items, totals, and item count
 * 
 * Behavior:
 * - Positive quantity: Adds items (validates stock availability)
 * - Negative quantity: Removes items (bypasses stock validation)
 * - If final quantity becomes 0, removes item from cart
 * - Updates product stock in memory
 * - Stores cart in HTTP-only cookies
 * 
 * Error Responses:
 * - 400: Missing required fields, invalid quantity, or insufficient stock
 * - 404: Product not found
 * 
 * Example: POST /carts/session/products { "productId": 1, "quantity": 2 }
 */
app.post('/carts/:cartId/products', (req, res) => {
  const { cartId } = req.params;
  const { productId, quantity } = req.body;
  
  // Validate required fields
  const fieldValidation = validateRequiredFields(req.body, ['productId', 'quantity']);
  if (!fieldValidation.isValid) {
    return sendErrorResponse(res, createErrorResponse(400, fieldValidation.error));
  }

  // Validate and parse product ID
  const productIdValidation = validateProductId(productId);
  if (!productIdValidation.isValid) {
    return sendErrorResponse(res, createErrorResponse(400, productIdValidation.error));
  }
  const productIdNum = productIdValidation.productId;

  // Validate and parse quantity
  const quantityValidation = validateQuantity(quantity, true); // Allow zero for removals
  if (!quantityValidation.isValid) {
    return sendErrorResponse(res, createErrorResponse(400, quantityValidation.error));
  }
  const quantityNum = quantityValidation.quantity;

  // Get cart from cookies
  let cart = getCartFromCookies(req);

  // Find the product to validate it exists
  const product = findProduct(products, productIdNum);
  if (!product) {
    return sendErrorResponse(res, createErrorResponse(404, 'Product not found'));
  }

  // Find existing cart item
  const existingItem = findCartItem(cart, productIdNum);
  
  if (existingItem) {
    // Update existing item
    const currentQuantity = existingItem.item.quantity;
    const newTotalQuantity = currentQuantity + quantityNum;
    
    // Only validate stock when adding items (positive quantity)
    if (quantityNum > 0) {
      const stockValidation = validateCartStockUpdate(product, currentQuantity, quantityNum);
      if (!stockValidation.isValid) {
        return sendErrorResponse(res, createErrorResponse(400, stockValidation.error, {
          availableStock: stockValidation.availableStock,
          currentCartQuantity: stockValidation.currentCartQuantity
        }));
      }
    }
    
    // Validate final quantity isn't negative
    if (newTotalQuantity < 0) {
      return sendErrorResponse(res, createErrorResponse(400, 'Cannot reduce quantity below zero', {
        currentCartQuantity: currentQuantity
      }));
    }
    
    // Update cart item quantity (or remove if becomes 0)
    updateCartItemQuantity(cart, existingItem.index, newTotalQuantity);
  } else {
    // Add new item to cart
    if (quantityNum <= 0) {
      return sendErrorResponse(res, createErrorResponse(400, 'Cannot add negative or zero quantity for new cart item'));
    }
    
    // Validate stock for new item
    const stockValidation = validateStockAvailability(product, quantityNum);
    if (!stockValidation.isValid) {
      return sendErrorResponse(res, createErrorResponse(400, stockValidation.error, {
        availableStock: stockValidation.availableStock
      }));
    }
    
    addNewCartItem(cart, productIdNum, quantityNum);
  }

  // Update product stock in memory
  const stockUpdate = updateProductStock(products, productIdNum, quantityNum);
  if (stockUpdate.success) {
    logStockChange(productIdNum, quantityNum, stockUpdate.newStockQuantity, 'cart_update');
  }

  // Save cart to cookies and return response
  saveCartToCookies(res, cart);
  res.json(getDetailedCart(cart, products));
});

/**
 * GET /carts/:cartId - Retrieve current cart contents
 * 
 * Path Parameters:
 * - cartId (string): Cart identifier (currently using session for all carts)
 * 
 * Returns: Cart object containing items array, total amount, and item count
 * 
 * Response Structure:
 * - cart: Array of cart items with product details
 * - total: Sum of all item subtotals (rounded to 2 decimal places)
 * - itemCount: Total number of items in cart
 * 
 * Example: GET /carts/session
 */
app.get('/carts/:cartId', (req, res) => {
  const { cartId } = req.params;
  
  // Get cart from cookies
  const cart = getCartFromCookies(req);
  
  // Return cart with totals
  res.json(getDetailedCart(cart, products));
});

/**
 * DELETE /carts/:cartId/products/:productId - Remove product completely from cart
 * 
 * Path Parameters:
 * - cartId (string): Cart identifier (currently using session for all carts)
 * - productId (number): ID of the product to remove from cart
 * 
 * Returns: Cart object with updated items, totals, and item count
 * 
 * Behavior:
 * - Removes entire product entry from cart (all quantities)
 * - Restores full quantity back to product stock in memory
 * - Updates product inStock status if quantity becomes available
 * - Stores updated cart in HTTP-only cookies
 * 
 * Error Responses:
 * - 400: Invalid or missing product ID
 * - 404: Product not found in cart
 * 
 * Example: DELETE /carts/session/products/1
 */
app.delete('/carts/:cartId/products/:productId', (req, res) => {
  const { cartId, productId } = req.params;
  
  // Validate product ID
  const productIdValidation = validateProductId(productId);
  if (!productIdValidation.isValid) {
    return sendErrorResponse(res, createErrorResponse(400, productIdValidation.error));
  }
  const productIdNum = productIdValidation.productId;

  // Get cart from cookies
  let cart = getCartFromCookies(req);
  
  // Find cart item
  const existingItem = findCartItem(cart, productIdNum);
  if (!existingItem) {
    return sendErrorResponse(res, createErrorResponse(404, 'Product not found in cart'));
  }

  // Get the quantity being removed to restore stock
  const removedQuantity = removeCartItem(cart, existingItem.index);
  
  // Restore product stock in memory (negative quantity to add back)
  const stockUpdate = updateProductStock(products, productIdNum, -removedQuantity);
  if (stockUpdate.success) {
    logStockChange(productIdNum, -removedQuantity, stockUpdate.newStockQuantity, 'cart_removal');
  }

  // Save cart to cookies and return response
  saveCartToCookies(res, cart);
  res.json(getDetailedCart(cart, products));
});

app.listen(3000, () => {
    console.log(`Server running on port 3000`);
});
