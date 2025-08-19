import React from 'react';
import Product from './Product';

function ProductList({ products, onAddToCart }) {
  if (!products || products.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '40px',
        color: '#666'
      }}>
        <h3>No products found</h3>
        <p>Please check back later for new items.</p>
      </div>
    );
  }

  return (
    <div style={{
      padding: '20px'
    }}>
      <h2 style={{
        textAlign: 'center',
        marginBottom: '20px',
        color: '#333'
      }}>
        Our Products
      </h2>
      
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '16px'
      }}>
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

export default ProductList;