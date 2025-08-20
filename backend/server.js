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
    
    const { category, inStock } = req.query;
    
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

  // Check if product is in stock
  if (!product.inStock) {
    return res.status(400).json({ error: 'Product is out of stock' });
  }

  // Find product in cart
  const cartItemIndex = cart.findIndex(item => item.productId === productIdNum);
  if (cartItemIndex > -1) {
    // Update quantity
    cart[cartItemIndex].quantity += quantityNum;
  } else {
    // Add new product to cart
    cart.push({ productId: productIdNum, quantity: quantityNum });
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

  // Remove the item from cart
  cart.splice(cartItemIndex, 1);

  // Store updated cart in cookies
  res.cookie('cart', JSON.stringify(cart), { httpOnly: true });

  // Return updated cart with totals
  res.json(getDetailedCart(cart, products));
});

app.listen(3000, () => {
    console.log(`Server running on port 3000`);
});
