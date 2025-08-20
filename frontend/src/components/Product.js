import React from 'react';
import { getCurrencySymbol } from '../utils/currency';
import '../styles/Product.css';

function Product({ product, onAddToCart }) {
  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  return (
    <div className="product-card">
      <div className="product-category-badge">
        {product.category}
      </div>

      <h3 className="product-title">
        {product.name}
      </h3>
      
      <p className="product-brand">
        {product.brand}
      </p>
      
      <p className="product-description">
        {product.description}
      </p>
      
      <div className="product-info-section">
        <span className="product-price">
          <span className="product-currency">
            {getCurrencySymbol(product.currency || 'USD')}
          </span>
          {product.price}
        </span>
        
        <div className="product-rating">
          <span className="product-rating-star">★</span>
          {product.rating} ({product.reviews})
        </div>
      </div>
      
      <div className="product-stock-section">
        {product.inStock ? (
          <span className="product-stock-status in-stock">
            <span className="product-stock-indicator">●</span>
            In Stock ({product.stockQuantity} available)
          </span>
        ) : (
          <span className="product-stock-status out-of-stock">
            <span className="product-stock-indicator">●</span>
            Out of Stock
          </span>
        )}
      </div>
      
      <button
        onClick={handleAddToCart}
        disabled={!product.inStock}
        className={`product-add-button ${product.inStock ? 'in-stock' : 'out-of-stock'}`}
      >
        {product.inStock ? 'Add to Cart' : 'Out of Stock'}
      </button>
    </div>
  );
}

export default Product;