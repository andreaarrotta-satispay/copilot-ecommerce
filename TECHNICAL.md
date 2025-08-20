# Technical Documentation

## 🏗️ Architecture Overview

This application follows a modern full-stack architecture with clear separation between frontend and backend concerns.

### Technology Stack

**Frontend:**
- React 18+ with Hooks
- CSS3 with CSS Variables
- Axios for HTTP requests
- Modern ES6+ JavaScript

**Backend:**
- Node.js with Express.js
- Cookie-based session management
- In-memory data storage
- RESTful API design

## 🔄 Data Flow

### Product Loading
1. Server starts and loads product data into memory
2. Frontend makes API request to `/products`
3. Server filters products based on query parameters
4. Frontend receives and displays products

### Cart Operations
1. User adds item to cart
2. Frontend sends POST request to `/carts/session/products`
3. Server updates cart in cookie storage
4. Server decrements product stock in memory
5. Server returns updated cart with totals
6. Frontend updates UI and refreshes product list

### Search Flow
1. User types in search field
2. Frontend updates filter state
3. API request made with search parameter
4. Server filters products by name (case-insensitive)
5. Filtered results returned and displayed

## 🗄️ Data Models

### Product
```javascript
{
  id: number,                    // Unique identifier
  name: string,                  // Product name
  category: string,              // Product category
  price: number,                 // Price in specified currency
  currency: string,              // Currency code (USD, EUR, etc.)
  description: string,           // Product description
  brand: string,                 // Manufacturer brand
  inStock: boolean,              // Availability status
  stockQuantity: number,         // Available quantity
  imageUrl: string,              // Image path (placeholder)
  rating: number,                // Average rating (1-5)
  reviews: number                // Number of reviews
}
```

### Cart Item
```javascript
{
  productId: number,             // Reference to product
  name: string,                  // Product name (denormalized)
  price: number,                 // Unit price
  currency: string,              // Currency code
  quantity: number,              // Quantity in cart
  subtotal: number               // price * quantity
}
```

### Cart Summary
```javascript
{
  cart: CartItem[],              // Array of cart items
  total: number,                 // Sum of all subtotals
  itemCount: number              // Total items in cart
}
```

## 🔧 Component Architecture

### App Component
**Purpose:** Root component managing global state and routing
**State:**
- `products`: Product catalog
- `filters`: Search and filter criteria
- `loading`: Initial loading state
- `error`: Error messages
- `isCartOpen`: Cart visibility
- `notification`: Toast notifications
- `viewMode`: Grid or list view

**Key Functions:**
- `getProductsFromAPI()`: Shared API call logic
- `refreshProducts()`: Silent product refresh
- `initialLoad()`: Initial data loading with loading state
- `handleAddToCart()`: Add product to cart

### Product Components
**ProductGrid/ProductList:** Layout containers for products
**Product:** Individual product card with add-to-cart functionality

### Cart Components
**Cart:** Modal container with cart management
**CartItem:** Individual cart item with quantity controls

### Filter Component
**ProductFilters:** Search bar and filter controls with reset functionality

## 🎨 CSS Architecture

### Structure
All CSS files are organized in `/src/styles/` directory:
- Component-specific CSS files
- Shared CSS variables in `App.css`
- Global styles in `index.css`

### CSS Variables
```css
:root {
  --primary-black: #1a1a1a;
  --secondary-black: #2a2a2a;
  --accent-orange: #ff6600;
  --light-gray: #f5f5f5;
  --medium-gray: #666666;
  --white: #ffffff;
  --gold: #d4af37;
  --text-gray: #888888;
}
```

### Design Principles
- **Mobile-first**: Responsive design starting with mobile
- **Progressive Enhancement**: Base functionality works without JavaScript
- **Accessibility**: Semantic HTML with proper ARIA labels
- **Performance**: Minimal CSS with efficient selectors

## 🔌 API Design

### RESTful Endpoints

#### Products
- `GET /products` - List products with optional filtering
- `GET /categories` - List available categories

#### Cart (Session-based)
- `GET /carts/session` - Get current cart
- `POST /carts/session/products` - Add/update cart item
- `DELETE /carts/session/products/:id` - Remove cart item

### Request/Response Format
All API responses use JSON format with consistent structure:

**Success Response:**
```json
{
  "data": {...},
  "status": "success"
}
```

**Error Response:**
```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {...}
}
```

## 🔄 State Management Strategy

### Frontend State
**Local Component State:** Used for UI-specific state (modals, forms)
**Lifted State:** Shared state lifted to App component
**No External State Management:** Kept simple without Redux/Context API

### Backend State
**In-Memory Storage:** Products loaded on server startup
**Session Storage:** Cart data stored in HTTP-only cookies
**No Database:** Simplified for development/demo purposes

## 🚀 Performance Optimizations

### Frontend
- **Silent Refresh:** Avoid loading states during filter changes
- **Debounced Search:** Prevent excessive API calls
- **Component Optimization:** Efficient re-rendering patterns
- **CSS Modules:** External CSS files for better caching

### Backend
- **In-Memory Data:** Fast product lookups
- **Efficient Filtering:** Single-pass filtering operations
- **Minimal Processing:** Lightweight request handling

## 🛡️ Error Handling Strategy

### Frontend Error Handling
```javascript
try {
  await api.post('/carts/session/products', data);
  showNotification('Success!', 'success');
  await refreshProducts(); // Update stock display
} catch (err) {
  if (err.response?.data?.error) {
    showNotification(err.response.data.error, 'error');
  } else {
    showNotification('Something went wrong', 'error');
  }
}
```

### Backend Error Handling
```javascript
if (!product.inStock || product.stockQuantity < quantity) {
  return res.status(400).json({
    error: !product.inStock ? 'Product is out of stock' : 'Insufficient stock',
    availableStock: product.stockQuantity
  });
}
```

## 🔍 Debugging Guide

### Frontend Debugging
- **React DevTools:** Component state inspection
- **Network Tab:** API request/response monitoring  
- **Console Logs:** Structured logging for development
- **Source Maps:** Original source debugging in production builds

### Backend Debugging
- **Server Logs:** Console output for stock changes
- **API Testing:** Use curl or Postman for endpoint testing
- **Error Responses:** Detailed error messages in development

### Common Issues
1. **Focus Loss in Search:** Ensure `refreshProducts()` is used instead of `fetchProducts()`
2. **Stock Discrepancies:** Check console logs for stock update messages
3. **Cart Sync Issues:** Verify cookie handling and session management

## 📊 Performance Monitoring

### Frontend Metrics
- **Bundle Size:** Monitor with build output
- **Render Performance:** Use React Profiler
- **Network Requests:** Monitor API call frequency
- **User Experience:** Measure interaction responsiveness

### Backend Metrics
- **Response Time:** Monitor API endpoint performance
- **Memory Usage:** Track in-memory data growth
- **Error Rate:** Monitor API error responses

## 🔧 Development Workflow

### Code Style
- **ESLint:** Automated code quality checking
- **Prettier:** Consistent code formatting
- **Component Structure:** One component per file
- **CSS Organization:** Separate CSS files for each component

### Testing Strategy
- **Unit Tests:** Component logic testing
- **Integration Tests:** API endpoint testing
- **E2E Tests:** Full user workflow testing
- **Manual Testing:** Cross-browser compatibility

## 🚀 Deployment Considerations

### Frontend Deployment
- **Build Optimization:** `npm run build` for production
- **Static Hosting:** Suitable for CDN deployment
- **Environment Variables:** API URL configuration
- **Browser Compatibility:** Modern browser support

### Backend Deployment
- **Process Management:** PM2 or similar for production
- **Environment Configuration:** Port and CORS settings
- **Data Persistence:** Consider database integration for production
- **Monitoring:** Application performance monitoring

## 🔄 Future Technical Improvements

### Architecture Enhancements
- **Database Integration:** Replace in-memory storage
- **Caching Layer:** Redis for session and product caching
- **API Versioning:** Structured API versioning strategy
- **Authentication:** JWT-based user authentication

### Performance Improvements
- **Code Splitting:** Lazy-load components
- **Image Optimization:** WebP format and responsive images
- **Service Workers:** Offline functionality
- **Database Indexing:** Optimized queries

### Development Experience
- **TypeScript:** Add static typing for better development experience
- **Automated Testing:** Comprehensive test coverage
- **CI/CD Pipeline:** Automated deployment pipeline
- **Docker:** Containerized development and deployment