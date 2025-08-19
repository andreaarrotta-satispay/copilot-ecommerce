import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductList from './ProductList';
import ProductFilters from './ProductFilters';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: 'all',
    inStock: ''
  });

  useEffect(() => {
    fetchProducts();
  }, [filters]);

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

  const handleAddToCart = (product) => {
    console.log('Adding to cart:', product);
    // TODO: Implement add to cart functionality
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
      <header className="premium-header">
        <h1><span className="premium-accent">Harmony</span> Music</h1>
        <p>Premium instruments for discerning musicians</p>
      </header>

      <ProductFilters 
        filters={filters}
        onFilterChange={setFilters}
      />

      <ProductList 
        products={products}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
}

export default App;
