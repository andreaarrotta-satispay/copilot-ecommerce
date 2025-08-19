import React from 'react';

function Product({ product, onAddToCart }) {
  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, var(--white) 0%, #fafafa 100%)',
      borderRadius: '20px',
      padding: '30px',
      margin: '20px',
      maxWidth: '350px',
      boxShadow: '0 20px 40px rgba(0,0,0,0.08), 0 8px 16px rgba(0,0,0,0.04)',
      border: '1px solid rgba(255,255,255,0.8)',
      transition: 'all 0.3s ease',
      position: 'relative',
      overflow: 'hidden'
    }}
    onMouseOver={(e) => {
      e.currentTarget.style.transform = 'translateY(-8px)';
      e.currentTarget.style.boxShadow = '0 30px 60px rgba(0,0,0,0.12), 0 12px 24px rgba(0,0,0,0.08)';
    }}
    onMouseOut={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.08), 0 8px 16px rgba(0,0,0,0.04)';
    }}>
      
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        background: 'linear-gradient(135deg, var(--accent-orange) 0%, #e55a00 100%)',
        color: 'var(--white)',
        padding: '6px 12px',
        borderRadius: '20px',
        fontSize: '11px',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
      }}>
        {product.category}
      </div>

      <h3 style={{ 
        margin: '0 0 12px 0', 
        fontSize: '1.4rem',
        fontWeight: '400',
        color: 'var(--primary-black)',
        lineHeight: '1.3'
      }}>
        {product.name}
      </h3>
      
      <p style={{ 
        color: 'var(--medium-gray)', 
        fontSize: '0.9rem', 
        margin: '0 0 16px 0',
        fontWeight: '500',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
      }}>
        {product.brand}
      </p>
      
      <p style={{ 
        fontSize: '0.95rem', 
        color: 'var(--medium-gray)', 
        margin: '0 0 20px 0',
        lineHeight: '1.6',
        height: '80px',
        overflow: 'hidden'
      }}>
        {product.description}
      </p>
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px',
        paddingTop: '16px',
        borderTop: '1px solid rgba(0,0,0,0.08)'
      }}>
        <span style={{ 
          fontSize: '2rem', 
          fontWeight: '300', 
          color: 'var(--primary-black)',
          letterSpacing: '-1px'
        }}>
          <span style={{ fontSize: '1.2rem', color: 'var(--medium-gray)' }}>$</span>{product.price}
        </span>
        
        <div style={{ 
          fontSize: '0.9rem', 
          color: 'var(--gold)',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <span style={{ fontSize: '1.1rem' }}>★</span>
          {product.rating} ({product.reviews})
        </div>
      </div>
      
      <div style={{ marginBottom: '24px' }}>
        {product.inStock ? (
          <span style={{ 
            color: '#10b981', 
            fontSize: '0.9rem',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span style={{ fontSize: '1rem' }}>●</span>
            In Stock ({product.stockQuantity} available)
          </span>
        ) : (
          <span style={{ 
            color: '#ef4444', 
            fontSize: '0.9rem',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span style={{ fontSize: '1rem' }}>●</span>
            Out of Stock
          </span>
        )}
      </div>
      
      <button
        onClick={handleAddToCart}
        disabled={!product.inStock}
        style={{
          width: '100%',
          padding: '16px',
          background: product.inStock 
            ? 'linear-gradient(135deg, var(--primary-black) 0%, var(--secondary-black) 100%)' 
            : 'linear-gradient(135deg, var(--medium-gray) 0%, #999 100%)',
          color: 'var(--white)',
          border: 'none',
          borderRadius: '12px',
          fontSize: '1rem',
          fontWeight: '500',
          cursor: product.inStock ? 'pointer' : 'not-allowed',
          transition: 'all 0.3s ease',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          boxShadow: product.inStock ? '0 8px 20px rgba(0,0,0,0.15)' : '0 4px 10px rgba(0,0,0,0.1)'
        }}
        onMouseOver={(e) => {
          if (product.inStock) {
            e.target.style.background = 'linear-gradient(135deg, var(--accent-orange) 0%, #e55a00 100%)';
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 12px 30px rgba(255,102,0,0.3)';
          }
        }}
        onMouseOut={(e) => {
          if (product.inStock) {
            e.target.style.background = 'linear-gradient(135deg, var(--primary-black) 0%, var(--secondary-black) 100%)';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
          }
        }}
      >
        {product.inStock ? 'Add to Cart' : 'Out of Stock'}
      </button>
    </div>
  );
}

export default Product;