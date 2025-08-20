import React from 'react';
import { getCurrencySymbol } from '../utils/currency';
import '../styles/ProductList.css';

function ProductList({ products, onAddToCart }) {
  if (!products || products.length === 0) {
    return (
      <div className="no-products">
        <h3>No products found</h3>
        <p>Please check back later for new items.</p>
      </div>
    );
  }

  const handleAddToCart = (product) => {
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  return (
    <div className="product-list-container">
      <h2 className="product-list-title">
        Our <span className="title-accent">Collection</span>
      </h2>
      
      <div className="product-list">
        {products.map(product => (
          <div key={product.id} className="product-list-item">
            <div className="product-list-info">
              <div className="product-list-header">
                <h3 className="product-list-name">{product.name}</h3>
                <span className="product-list-category-badge">
                  {product.category}
                </span>
              </div>
              
              <p className="product-list-brand">{product.brand}</p>
              <p className="product-list-description">{product.description}</p>
              
              <div className="product-list-details">
                <div className="product-list-rating">
                  <span className="rating-star">★</span>
                  {product.rating} ({product.reviews})
                </div>
                
                <div className="product-list-stock">
                  {product.inStock ? (
                    <span className="stock-status in-stock">
                      <span className="stock-indicator">●</span>
                      In Stock ({product.stockQuantity} available)
                    </span>
                  ) : (
                    <span className="stock-status out-of-stock">
                      <span className="stock-indicator">●</span>
                      Out of Stock
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="product-list-actions">
              <div className="product-list-price">
                <span className="currency">
                  {getCurrencySymbol(product.currency || 'USD')}
                </span>
                {product.price}
              </div>
              
              <button
                onClick={() => handleAddToCart(product)}
                disabled={!product.inStock}
                className={`product-list-add-button ${product.inStock ? 'in-stock' : 'out-of-stock'}`}
              >
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductList;