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
      padding: '40px 20px',
      maxWidth: '1400px',
      margin: '0 auto'
    }}>
      <h2 style={{
        textAlign: 'center',
        marginBottom: '50px',
        fontSize: '2.5rem',
        fontWeight: '300',
        color: 'var(--primary-black)',
        textTransform: 'uppercase',
        letterSpacing: '2px'
      }}>
        Our <span style={{ color: 'var(--accent-orange)' }}>Collection</span>
      </h2>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '30px',
        justifyItems: 'center'
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