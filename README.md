# Premium Music E-Commerce Application

A full-stack e-commerce application for musical instruments built with React frontend and Express.js backend, featuring real-time inventory management, advanced product filtering, and a responsive shopping cart system.

## 🎵 Features

### Core Functionality
- **Product Catalog** - Browse musical instruments with detailed information
- **Real-time Search** - Search products by name with instant results
- **Advanced Filtering** - Filter by category, availability, and search terms
- **Dual Layout Views** - Switch between grid and list views
- **Shopping Cart** - Add, remove, and manage cart items with quantity controls
- **Real-time Stock Management** - Automatic inventory updates and stock validation
- **Responsive Design** - Optimized for desktop and mobile devices

### Advanced Features
- **Instant Notifications** - Success/error messages with auto-dismiss
- **Currency Support** - Multi-currency display with proper symbols
- **Session Persistence** - Cart contents persist across browser sessions
- **Focus Management** - Smooth search experience without cursor jumps
- **Loading States** - Intelligent loading indicators that don't interrupt UX
- **Error Handling** - Comprehensive error handling with user-friendly messages

## 🏗️ Architecture

### Frontend (React)
```
src/
├── components/
│   ├── App.js              # Main application component
│   ├── Product.js          # Individual product card
│   ├── ProductGrid.js      # Grid layout for products
│   ├── ProductList.js      # List layout for products
│   ├── ProductFilters.js   # Search and filter controls
│   ├── Cart.js            # Shopping cart modal
│   ├── CartItem.js        # Individual cart item
│   └── Notification.js    # Toast notification system
├── styles/                # CSS modules for components
│   ├── index.css         # Global styles
│   ├── App.css           # App-specific styles + CSS variables
│   ├── Product.css       # Product card styles
│   ├── ProductGrid.css   # Grid layout styles
│   ├── ProductList.css   # List layout styles
│   ├── ProductFilters.css # Filter component styles
│   ├── Cart.css          # Cart modal styles
│   ├── CartItem.css      # Cart item styles
│   └── Notification.css  # Notification popup styles
├── api/
│   └── axios.js          # Centralized API configuration
└── utils/
    └── currency.js       # Currency symbol utilities
```

### Backend (Express.js)
```
backend/
├── server.js             # Main server with REST API endpoints
├── cart-helper.js        # Cart calculation utilities
└── product-test-data.js  # Product catalog data
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd copilot-ecommerce
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   node server.js
   ```
   Server runs on `http://localhost:3000`

2. **Start the frontend development server**
   ```bash
   cd frontend
   npm start
   ```
   Frontend runs on `http://localhost:3001`

3. **Build for production**
   ```bash
   cd frontend
   npm run build
   ```

## 🔧 API Documentation

### Products API

#### Get All Products
```http
GET /products?category=<category>&inStock=<boolean>&search=<query>
```

**Query Parameters:**
- `category` (optional) - Filter by product category
- `inStock` (optional) - Filter by stock availability (`true`/`false`)
- `search` (optional) - Search products by name (partial matching)

**Response:**
```json
[
  {
    "id": 1,
    "name": "Yamaha FG830 Acoustic Guitar",
    "category": "Guitars",
    "price": 199.99,
    "currency": "USD",
    "description": "Solid spruce top acoustic guitar...",
    "brand": "Yamaha",
    "inStock": true,
    "stockQuantity": 15,
    "rating": 4.5,
    "reviews": 127
  }
]
```

#### Get Categories
```http
GET /categories
```

**Response:**
```json
["Guitars", "Drums", "Keyboards", "Audio Equipment", "Brass", "Woodwinds"]
```

### Cart API

#### Get Cart
```http
GET /carts/{cartId}
```

**Response:**
```json
{
  "cart": [
    {
      "productId": 1,
      "name": "Yamaha FG830 Acoustic Guitar",
      "price": 199.99,
      "currency": "USD",
      "quantity": 2,
      "subtotal": 399.98
    }
  ],
  "total": 399.98,
  "itemCount": 2
}
```

#### Add to Cart
```http
POST /carts/{cartId}/products
Content-Type: application/json

{
  "productId": 1,
  "quantity": 1
}
```

#### Remove from Cart
```http
DELETE /carts/{cartId}/products/{productId}
```

## 🛡️ Error Handling

### Frontend
- **API Errors**: Graceful error messages with retry options
- **Network Issues**: Fallback UI states and user notifications
- **Validation**: Client-side input validation
- **Loading States**: Smart loading indicators that preserve UX

### Backend
- **Input Validation**: Request parameter validation
- **Stock Validation**: Prevents overselling with detailed error messages
- **Error Responses**: Structured JSON error responses
- **Graceful Degradation**: Fallback behavior for missing data

## 🔧 Development Features

### Code Organization
- **Component Separation**: Each component in its own file with dedicated CSS
- **CSS Modules**: All styles organized in `/styles` directory
- **API Abstraction**: Centralized API configuration with axios
- **Utility Functions**: Reusable utilities for common operations

### Performance Optimizations
- **Silent Refresh**: Background data updates without loading states
- **Debounced Search**: Efficient search with minimal API calls
- **Component Optimization**: Efficient re-rendering patterns
- **CSS Optimization**: External CSS files for better caching

### Developer Experience
- **ESLint**: Code quality and consistency
- **Hot Reload**: Instant development feedback
- **Build Optimization**: Production-ready builds with minification
- **Source Maps**: Easy debugging in development

## 🚦 Testing

### Running Tests
```bash
# Frontend tests
cd frontend
npm test

# Backend tests (if implemented)
cd backend
npm test
```

## 🔒 Security Features

- **Input Sanitization**: All user inputs are validated and sanitized
- **CORS Configuration**: Proper cross-origin resource sharing setup
- **Session Security**: HTTP-only cookies for cart persistence
- **API Validation**: Server-side validation for all endpoints

## 📊 Browser Compatibility

- **Chrome**: Latest 2 versions
- **Firefox**: Latest 2 versions  
- **Safari**: Latest 2 versions
- **Edge**: Latest 2 versions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🎯 Future Enhancements

- **User Authentication**: User accounts and order history
- **Payment Integration**: Stripe/PayPal checkout process
- **Product Images**: Image gallery for each product
- **Reviews System**: User reviews and ratings
- **Wishlist**: Save products for later
- **Advanced Search**: Search filters and sorting options
- **Analytics**: User behavior tracking and insights

---

Built with ❤️ for music enthusiasts