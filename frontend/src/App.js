import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductList from './ProductList';
import ProductFilters from './ProductFilters';
import Cart from './Cart';
import Notification from './Notification';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: 'all',
    inStock: ''
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [notification, setNotification] = useState({
    message: '',
    type: 'success',
    isVisible: false
  });

  useEffect(() => {
    fetchProducts();
  }, [filters]);

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

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (filters.category !== 'all') {
        params.append('category', filters.category);
      }
      
      if (filters.inStock !== '') {
        params.append('inStock', filters.inStock);
      }

      const response = await axios.get(`http://localhost:3000/products?${params}`);
      setProducts(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load products. Please try again later.');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product) => {
    try {
      await axios.post('http://localhost:3000/carts/session/products', {
        productId: product.id,
        quantity: 1
      }, {
        withCredentials: true
      });
      showNotification(`${product.name} added to cart!`, 'success');
    } catch (err) {
      console.error('Failed to add to cart:', err);
      showNotification('Failed to add item to cart. Please try again.', 'error');
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px'
      }}>
        Loading products...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        textAlign: 'center'
      }}>
        <h2 style={{ color: '#dc3545' }}>Error</h2>
        <p>{error}</p>
        <button 
          onClick={fetchProducts}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="premium-header" style={{ position: 'relative' }}>
        <h1><span className="premium-accent">Premium</span> Music</h1>
        <p>Premium instruments for discerning musicians</p>
        
        <button
          onClick={() => setIsCartOpen(true)}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'linear-gradient(135deg, var(--accent-orange) 0%, #e55a00 100%)',
            color: 'var(--white)',
            border: 'none',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            cursor: 'pointer',
            fontSize: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(255, 102, 0, 0.3)',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.target.style.transform = 'scale(1.1)';
            e.target.style.boxShadow = '0 6px 20px rgba(255, 102, 0, 0.4)';
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 4px 12px rgba(255, 102, 0, 0.3)';
          }}
          title="Your Cart"
        >
          🛒
        </button>
      </header>

      <ProductFilters 
        filters={filters}
        onFilterChange={setFilters}
      />

      <ProductList 
        products={products}
        onAddToCart={handleAddToCart}
      />

      <Cart
        isVisible={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        showNotification={showNotification}
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
