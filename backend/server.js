const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();

// Load products into memory on startup
let products = [];
try {
  products = require('./product-test-data');
  console.log(`Loaded ${products.length} products into memory`);
} catch (error) {
  console.error('Failed to load product data:', error);
  products = [];
}

const { getDetailedCart } = require('./cart-helper');

app.use(cors({
  origin: ['http://localhost:3001', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(cookieParser());
app.use(express.json());

app.get('/products', (req, res) => {
    let filteredProducts = [...products];
    
    const { category, inStock, search } = req.query;
    
    if (category && category !== 'all') {
        filteredProducts = filteredProducts.filter(product => 
            product.category.toLowerCase() === category.toLowerCase()
        );
    }
    
    if (inStock !== undefined) {
        const stockFilter = inStock === 'true';
        filteredProducts = filteredProducts.filter(product => 
            product.inStock === stockFilter
        );
    }
    
    if (search && search.trim() !== '') {
        const searchTerm = search.toLowerCase().trim();
        filteredProducts = filteredProducts.filter(product => 
            product.name.toLowerCase().includes(searchTerm)
        );
    }
    
    res.json(filteredProducts);
});

app.get('/categories', (req, res) => {
    const categories = [...new Set(products.map(product => product.category))];
    res.json(categories.sort());
});

app.post('/carts/:cartId/products', (req, res) => {
  const { cartId } = req.params;
  const { productId, quantity } = req.body;
  
  if (!productId || !quantity) {
    return res.status(400).json({ error: 'Product ID and quantity are required' });
  }

  // For session-based carts, we'll use the cookie regardless of cartId
  // In a real app, you might validate cartId against user session
  let cart = req.cookies.cart ? JSON.parse(req.cookies.cart) : [];
  const productIdNum = Number(productId);
  const quantityNum = Number(quantity);

  // Find the product to validate it exists
  const product = products.find(p => p.id === productIdNum);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  // Only check stock availability when adding items (positive quantity)
  if (quantityNum > 0) {
    if (!product.inStock || product.stockQuantity < quantityNum) {
      return res.status(400).json({ 
        error: !product.inStock ? 'Product is out of stock' : 'Insufficient stock quantity available',
        availableStock: product.stockQuantity
      });
    }
  }

  // Find product in cart
  const cartItemIndex = cart.findIndex(item => item.productId === productIdNum);
  
  if (cartItemIndex > -1) {
    const currentCartQuantity = cart[cartItemIndex].quantity;
    const newTotalQuantity = currentCartQuantity + quantityNum;
    
    // Only check stock limits when increasing quantity (positive quantityNum)
    if (quantityNum > 0) {
      // Check if adding more quantity would exceed available stock
      // We need to check against current stock + what's already in cart
      const availableStock = product.stockQuantity + currentCartQuantity;
      
      if (newTotalQuantity > availableStock) {
        return res.status(400).json({ 
          error: 'Cannot add more items. Insufficient stock quantity available',
          availableStock: availableStock - currentCartQuantity,
          currentCartQuantity: currentCartQuantity
        });
      }
    }
    
    // Check if final quantity would be valid (not negative)
    if (newTotalQuantity < 0) {
      return res.status(400).json({ 
        error: 'Cannot reduce quantity below zero',
        currentCartQuantity: currentCartQuantity
      });
    }
    
    // If final quantity is 0, remove the item from cart
    if (newTotalQuantity === 0) {
      cart.splice(cartItemIndex, 1);
    } else {
      // Update quantity in cart
      cart[cartItemIndex].quantity = newTotalQuantity;
    }
  } else {
    // Add new product to cart (only if quantity is positive)
    if (quantityNum <= 0) {
      return res.status(400).json({ 
        error: 'Cannot add negative or zero quantity for new cart item'
      });
    }
    cart.push({ productId: productIdNum, quantity: quantityNum });
  }

  // Update product stock in memory
  const productIndex = products.findIndex(p => p.id === productIdNum);
  if (productIndex > -1) {
    products[productIndex].stockQuantity -= quantityNum;
    // Update inStock status based on quantity
    if (products[productIndex].stockQuantity <= 0) {
      products[productIndex].inStock = false;
      products[productIndex].stockQuantity = 0;
    } else {
      products[productIndex].inStock = true;
    }
    console.log(`Updated stock for product ${productIdNum}: ${products[productIndex].stockQuantity} remaining`);
  }

  // Store updated cart in cookies
  res.cookie('cart', JSON.stringify(cart), { httpOnly: true });

  // Return updated cart with totals
  res.json(getDetailedCart(cart, products));
});

app.get('/carts/:cartId', (req, res) => {
  const { cartId } = req.params;
  
  // For session-based carts, we'll use the cookie regardless of cartId
  // In a real app, you might validate cartId against user session
  let cart = req.cookies.cart ? JSON.parse(req.cookies.cart) : [];
  
  // Return cart with totals
  res.json(getDetailedCart(cart, products));
});

app.delete('/carts/:cartId/products/:productId', (req, res) => {
  const { cartId, productId } = req.params;
  const productIdNum = Number(productId);
  
  if (!productIdNum) {
    return res.status(400).json({ error: 'Product ID is required' });
  }

  // For session-based carts, we'll use the cookie regardless of cartId
  // In a real app, you might validate cartId against user session
  let cart = req.cookies.cart ? JSON.parse(req.cookies.cart) : [];
  
  // Find and remove the product from cart
  const cartItemIndex = cart.findIndex(item => item.productId === productIdNum);
  if (cartItemIndex === -1) {
    return res.status(404).json({ error: 'Product not found in cart' });
  }

  // Get the quantity being removed to restore stock
  const removedQuantity = cart[cartItemIndex].quantity;
  
  // Remove the item from cart
  cart.splice(cartItemIndex, 1);
  
  // Restore product stock in memory
  const productIndex = products.findIndex(p => p.id === productIdNum);
  if (productIndex > -1) {
    products[productIndex].stockQuantity += removedQuantity;
    // Update inStock status if quantity is now available
    if (products[productIndex].stockQuantity > 0) {
      products[productIndex].inStock = true;
    }
    console.log(`Restored stock for product ${productIdNum}: ${products[productIndex].stockQuantity} available`);
  }

  // Store updated cart in cookies
  res.cookie('cart', JSON.stringify(cart), { httpOnly: true });

  // Return updated cart with totals
  res.json(getDetailedCart(cart, products));
});

app.listen(3000, () => {
    console.log(`Server running on port 3000`);
});
