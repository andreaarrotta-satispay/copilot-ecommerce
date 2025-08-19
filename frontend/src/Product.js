import React from 'react';

function Product({ product, onAddToCart }) {
  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '16px',
      margin: '16px',
      maxWidth: '300px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      
      <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>
        {product.name}
      </h3>
      
      <p style={{ 
        color: '#666', 
        fontSize: '14px', 
        margin: '0 0 8px 0' 
      }}>
        {product.brand} • {product.category}
      </p>
      
      <p style={{ 
        fontSize: '14px', 
        color: '#555', 
        margin: '0 0 12px 0',
        lineHeight: '1.4'
      }}>
        {product.description}
      </p>
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '12px'
      }}>
        <span style={{ 
          fontSize: '20px', 
          fontWeight: 'bold', 
          color: '#2c5530' 
        }}>
          ${product.price}
        </span>
        
        <div style={{ fontSize: '14px', color: '#666' }}>
          ⭐ {product.rating} ({product.reviews})
        </div>
      </div>
      
      <div style={{ marginBottom: '12px' }}>
        {product.inStock ? (
          <span style={{ color: '#28a745', fontSize: '14px' }}>
            ✅ In Stock ({product.stockQuantity} available)
          </span>
        ) : (
          <span style={{ color: '#dc3545', fontSize: '14px' }}>
            ❌ Out of Stock
          </span>
        )}
      </div>
      
      <button
        onClick={handleAddToCart}
        disabled={!product.inStock}
        style={{
          width: '100%',
          padding: '12px',
          backgroundColor: product.inStock ? '#007bff' : '#6c757d',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          fontSize: '16px',
          cursor: product.inStock ? 'pointer' : 'not-allowed',
          transition: 'background-color 0.2s'
        }}
        onMouseOver={(e) => {
          if (product.inStock) {
            e.target.style.backgroundColor = '#0056b3';
          }
        }}
        onMouseOut={(e) => {
          if (product.inStock) {
            e.target.style.backgroundColor = '#007bff';
          }
        }}
      >
        {product.inStock ? 'Add to Cart' : 'Out of Stock'}
      </button>
    </div>
  );
}

export default Product;