import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/ProductFilters.css';

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
    <div className="product-filters-container">
      <h3 className="product-filters-title">
        Refine Your <span className="product-filters-title-accent">Selection</span>
      </h3>
      
      <div className="product-filters-controls">
        <div className="product-filters-field">
          <label className="product-filters-label">
            Search Products:
          </label>
          <input
            type="text"
            placeholder="Search by name..."
            value={filters.search}
            onChange={handleSearchChange}
            className="product-filters-input product-filters-search-input"
          />
        </div>
        <div className="product-filters-field">
          <label className="product-filters-label">
            Category:
          </label>
          <select
            value={filters.category}
            onChange={handleCategoryChange}
            className="product-filters-select"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
        </div>

        <div className="product-filters-field">
          <label className="product-filters-label">
            Availability:
          </label>
          <select
            value={filters.inStock}
            onChange={handleStockChange}
            className="product-filters-select"
          >
            <option value="">All Items</option>
            <option value="true">In Stock Only</option>
            <option value="false">Out of Stock Only</option>
          </select>
        </div>

        <div className="product-filters-field">
          <button
            onClick={handleResetFilters}
            className="product-filters-reset-button"
          >
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductFilters;