const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();
const products = require('./product-test-data');

app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.get('/products', (req, res) => {
    res.json(products);
});

app.post('/cart', (req, res) => {
  res.json({ message: 'Cart endpoint - add product to cart' });
});

app.get('/cart', (req, res) => {
  res.json({ message: 'Cart endpoint - get user cart products' });
});

app.listen(3000, () => {
    console.log(`Server running on port 3000`);
});
