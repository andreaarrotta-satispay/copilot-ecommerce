import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ProductFilters({ filters, onFilterChange }) {
  const [categories, setCategories] = useState(['all']);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:3000/categories');
      setCategories(['all', ...response.data]);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories(['all', 'Guitars', 'Drums', 'Keyboards', 'Audio Equipment', 'Brass', 'Woodwinds']);
    }
  };

  const handleCategoryChange = (e) => {
    onFilterChange({
      ...filters,
      category: e.target.value
    });
  };

  const handleStockChange = (e) => {
    onFilterChange({
      ...filters,
      inStock: e.target.value
    });
  };

  const handleResetFilters = () => {
    onFilterChange({
      category: 'all',
      inStock: ''
    });
  };

  return (
    <div style={{
      backgroundColor: '#f8f9fa',
      padding: '20px',
      margin: '20px',
      borderRadius: '8px',
      border: '1px solid #dee2e6'
    }}>
      <h3 style={{ margin: '0 0 16px 0' }}>Filter Products</h3>
      
      <div style={{
        display: 'flex',
        gap: '20px',
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        <div>
          <label style={{ 
            display: 'block', 
            marginBottom: '4px',
            fontWeight: 'bold'
          }}>
            Category:
          </label>
          <select
            value={filters.category}
            onChange={handleCategoryChange}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              fontSize: '14px'
            }}
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ 
            display: 'block', 
            marginBottom: '4px',
            fontWeight: 'bold'
          }}>
            Availability:
          </label>
          <select
            value={filters.inStock}
            onChange={handleStockChange}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              fontSize: '14px'
            }}
          >
            <option value="">All Items</option>
            <option value="true">In Stock Only</option>
            <option value="false">Out of Stock Only</option>
          </select>
        </div>

        <div>
          <button
            onClick={handleResetFilters}
            style={{
              padding: '8px 16px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '14px',
              cursor: 'pointer',
              marginTop: '20px'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#5a6268';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = '#6c757d';
            }}
          >
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductFilters;