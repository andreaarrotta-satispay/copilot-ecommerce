import React from 'react';
import { getCurrencySymbol } from './utils/currency';

function CartItem({ item, onUpdateQuantity, onRemove }) {
  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) {
      onRemove(item.productId);
    } else if (onUpdateQuantity) {
      onUpdateQuantity(item.productId, newQuantity);
    }
  };

  const handleRemove = () => {
    if (onRemove) {
      onRemove(item.productId);
    }
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, var(--white) 0%, #fafafa 100%)',
      borderRadius: '12px',
      padding: '20px',
      margin: '10px 0',
      boxShadow: '0 4px 8px rgba(0,0,0,0.06)',
      border: '1px solid rgba(0,0,0,0.05)',
      display: 'flex',
      alignItems: 'center',
      gap: '20px'
    }}>
      <div style={{ flex: 1 }}>
        <h4 style={{
          margin: '0 0 5px 0',
          fontSize: '1.1rem',
          fontWeight: '500',
          color: 'var(--primary-black)'
        }}>
          {item.name}
        </h4>
        <p style={{
          margin: '0',
          color: 'var(--medium-gray)',
          fontSize: '0.9rem'
        }}>
          {getCurrencySymbol(item.currency)}{item.price} each
        </p>
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        <button
          onClick={() => handleQuantityChange(item.quantity - 1)}
          style={{
            width: '32px',
            height: '32px',
            border: '1px solid var(--medium-gray)',
            borderRadius: '6px',
            background: 'var(--white)',
            color: 'var(--primary-black)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            fontWeight: '500'
          }}
        >
          
        </button>

        <span style={{
          minWidth: '40px',
          textAlign: 'center',
          fontSize: '1rem',
          fontWeight: '500'
        }}>
          {item.quantity}
        </span>

        <button
          onClick={() => handleQuantityChange(item.quantity + 1)}
          style={{
            width: '32px',
            height: '32px',
            border: '1px solid var(--medium-gray)',
            borderRadius: '6px',
            background: 'var(--white)',
            color: 'var(--primary-black)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            fontWeight: '500'
          }}
        >
          +
        </button>
      </div>

      <div style={{
        textAlign: 'right',
        minWidth: '80px'
      }}>
        <div style={{
          fontSize: '1.1rem',
          fontWeight: '500',
          color: 'var(--primary-black)'
        }}>
          {getCurrencySymbol(item.currency)}{item.subtotal}
        </div>
      </div>

      <button
        onClick={handleRemove}
        style={{
          background: 'transparent',
          border: 'none',
          color: 'var(--medium-gray)',
          cursor: 'pointer',
          fontSize: '18px',
          padding: '8px',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s ease'
        }}
        onMouseOver={(e) => {
          e.target.style.color = '#ef4444';
          e.target.style.background = 'rgba(239, 68, 68, 0.1)';
        }}
        onMouseOut={(e) => {
          e.target.style.color = 'var(--medium-gray)';
          e.target.style.background = 'transparent';
        }}
        title="Remove item"
      >
        ×
      </button>
    </div>
  );
}

export default CartItem;