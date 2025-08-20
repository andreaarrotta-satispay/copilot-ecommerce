import React from 'react';
import Product from './Product';
import './styles/ProductGrid.css';

function ProductGrid({ products, onAddToCart }) {
  if (!products || products.length === 0) {
    return (
      <div className="no-products-grid">
        <h3>No products found</h3>
        <p>Please check back later for new items.</p>
      </div>
    );
  }

  return (
    <div className="product-grid-container">
      <h2 className="product-grid-title">
        Our <span className="grid-title-accent">Collection</span>
      </h2>
      
      <div className="product-grid">
        {products.map(product => (
          <Product 
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </div>
  );
}

export default ProductGrid;