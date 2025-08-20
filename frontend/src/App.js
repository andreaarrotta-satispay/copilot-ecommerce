import React, { useState, useEffect } from 'react';
import api from './api/axios';
import ProductList from './ProductList';
import ProductGrid from './ProductGrid';
import ProductFilters from './ProductFilters';
import Cart from './Cart';
import Notification from './Notification';
import './App.css';
import './styles/App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // Only for initial load
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: 'all',
    inStock: '',
    search: ''
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [notification, setNotification] = useState({
    message: '',
    type: 'success',
    isVisible: false
  });
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  useEffect(() => {
    if (loading) {
      // Initial load - show loading state
      initialLoad();
    } else {
      // All subsequent changes - silent refresh
      refreshProducts();
    }
  }, [filters]);

  const initialLoad = async () => {
    try {
      setLoading(true);
      const products = await getProductsFromAPI();
      setProducts(products);
      setError(null);
    } catch (err) {
      setError('Failed to load products. Please try again later.');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({
      message,
      type,
      isVisible: true
    });
  };

  const hideNotification = () => {
    setNotification(prev => ({
      ...prev,
      isVisible: false
    }));
  };

  const getProductsFromAPI = async () => {
    const params = new URLSearchParams();
    
    if (filters.category !== 'all') {
      params.append('category', filters.category);
    }
    
    if (filters.inStock !== '') {
      params.append('inStock', filters.inStock);
    }
    
    if (filters.search !== '') {
      params.append('search', filters.search);
    }

    const response = await api.get(`/products?${params}`);
    return response.data;
  };


  const refreshProducts = async () => {
    try {
      // Silent refresh without loading state to avoid scroll jump
      const products = await getProductsFromAPI();
      setProducts(products);
    } catch (err) {
      console.error('Error refreshing products:', err);
      // Don't show error notification for silent refresh
    }
  };

  const handleAddToCart = async (product) => {
    try {
      await api.post('/carts/session/products', {
        productId: product.id,
        quantity: 1
      });
      showNotification(`${product.name} added to cart!`, 'success');
      // Silently refresh products to update stock status
      await refreshProducts();
    } catch (err) {
      console.error('Failed to add to cart:', err);
      // Check if it's a stock-related error
      if (err.response && err.response.data && err.response.data.error) {
        showNotification(err.response.data.error, 'error');
      } else {
        showNotification('Failed to add item to cart. Please try again.', 'error');
      }
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        Loading products...
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2 className="error-title">Error</h2>
        <p>{error}</p>
        <button 
          onClick={initialLoad}
          className="error-retry-button"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="premium-header">
        <h1><span className="premium-accent">Premium</span> Music</h1>
        <p>Premium instruments for discerning musicians</p>
        
        <div className="header-controls">
          <div className="view-toggle-container">
            <button
              onClick={() => setViewMode('grid')}
              className={`view-toggle-button ${viewMode === 'grid' ? 'active' : 'inactive'}`}
              title="Grid View"
            >
              ⊞
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`view-toggle-button ${viewMode === 'list' ? 'active' : 'inactive'}`}
              title="List View"
            >
              ☰
            </button>
          </div>
          
          <button
            onClick={() => setIsCartOpen(true)}
            className="cart-button"
            title="Your Cart"
          >
            🛒
          </button>
        </div>
      </header>

      <ProductFilters 
        filters={filters}
        onFilterChange={setFilters}
      />

      {viewMode === 'grid' ? (
        <ProductGrid 
          products={products}
          onAddToCart={handleAddToCart}
        />
      ) : (
        <ProductList 
          products={products}
          onAddToCart={handleAddToCart}
        />
      )}

      <Cart
        isVisible={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        showNotification={showNotification}
        onProductUpdate={refreshProducts}
      />

      <Notification
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={hideNotification}
      />
    </div>
  );
}

export default App;
