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

  const handleSearchChange = (e) => {
    onFilterChange({
      ...filters,
      search: e.target.value
    });
  };

  const handleResetFilters = () => {
    onFilterChange({
      category: 'all',
      inStock: '',
      search: ''
    });
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, var(--white) 0%, var(--light-gray) 100%)',
      padding: '40px 30px',
      margin: '30px auto',
      maxWidth: '1200px',
      borderRadius: '15px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
      border: '1px solid rgba(255,255,255,0.2)'
    }}>
      <h3 style={{ 
        margin: '0 0 30px 0',
        fontSize: '1.8rem',
        fontWeight: '300',
        color: 'var(--primary-black)',
        textTransform: 'uppercase',
        letterSpacing: '1px'
      }}>
        Refine Your <span style={{ color: 'var(--accent-orange)' }}>Selection</span>
      </h3>
      
      <div style={{
        display: 'flex',
        gap: '30px',
        flexWrap: 'wrap',
        alignItems: 'flex-end'
      }}>
        <div>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px',
            fontWeight: '500',
            color: 'var(--medium-gray)',
            fontSize: '0.9rem',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Search Products:
          </label>
          <input
            type="text"
            placeholder="Search by name..."
            value={filters.search}
            onChange={handleSearchChange}
            style={{
              padding: '12px 16px',
              borderRadius: '8px',
              border: '2px solid var(--light-gray)',
              fontSize: '16px',
              background: 'var(--white)',
              color: 'var(--primary-black)',
              minWidth: '250px',
              transition: 'all 0.3s ease',
              outline: 'none'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--accent-orange)';
              e.target.style.boxShadow = '0 0 0 3px rgba(255,102,0,0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--light-gray)';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>
        <div>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px',
            fontWeight: '500',
            color: 'var(--medium-gray)',
            fontSize: '0.9rem',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Category:
          </label>
          <select
            value={filters.category}
            onChange={handleCategoryChange}
            style={{
              padding: '12px 16px',
              borderRadius: '8px',
              border: '2px solid var(--light-gray)',
              fontSize: '16px',
              background: 'var(--white)',
              color: 'var(--primary-black)',
              minWidth: '180px',
              transition: 'all 0.3s ease',
              outline: 'none'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--accent-orange)';
              e.target.style.boxShadow = '0 0 0 3px rgba(255,102,0,0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--light-gray)';
              e.target.style.boxShadow = 'none';
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
            marginBottom: '8px',
            fontWeight: '500',
            color: 'var(--medium-gray)',
            fontSize: '0.9rem',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Availability:
          </label>
          <select
            value={filters.inStock}
            onChange={handleStockChange}
            style={{
              padding: '12px 16px',
              borderRadius: '8px',
              border: '2px solid var(--light-gray)',
              fontSize: '16px',
              background: 'var(--white)',
              color: 'var(--primary-black)',
              minWidth: '180px',
              transition: 'all 0.3s ease',
              outline: 'none'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--accent-orange)';
              e.target.style.boxShadow = '0 0 0 3px rgba(255,102,0,0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--light-gray)';
              e.target.style.boxShadow = 'none';
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
              padding: '12px 24px',
              background: 'linear-gradient(135deg, var(--medium-gray) 0%, var(--secondary-black) 100%)',
              color: 'var(--white)',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
            }}
            onMouseOver={(e) => {
              e.target.style.background = 'linear-gradient(135deg, var(--accent-orange) 0%, #e55a00 100%)';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(255,102,0,0.3)';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'linear-gradient(135deg, var(--medium-gray) 0%, var(--secondary-black) 100%)';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
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