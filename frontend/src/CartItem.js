import React from 'react';
import { getCurrencySymbol } from './utils/currency';

function CartItem({ item, onUpdateQuantity, onRemove, showNotification }) {
  const handleQuantityChange = (newQuantity) => {
    const currentQuantity = item.quantity;
    
    if (newQuantity < 1) {
      onRemove(item.productId);
    } else if (onUpdateQuantity) {
      onUpdateQuantity(item.productId, newQuantity);
      
      // Show notification for quantity change
      if (showNotification) {
        if (newQuantity > currentQuantity) {
          showNotification(`${item.name} quantity increased to ${newQuantity}`, 'success');
        } else if (newQuantity < currentQuantity) {
          showNotification(`${item.name} quantity decreased to ${newQuantity}`, 'success');
        }
      }
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
      padding: '16px',
      margin: '10px 0',
      boxShadow: '0 4px 8px rgba(0,0,0,0.06)',
      border: '1px solid rgba(0,0,0,0.05)',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    }}>
      {/* Product Info Row */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
      }}>
        <div style={{ flex: 1 }}>
          <h4 style={{
            margin: '0 0 4px 0',
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
          fontSize: '1.1rem',
          fontWeight: '500',
          color: 'var(--primary-black)'
        }}>
          {getCurrencySymbol(item.currency)}{item.subtotal}
        </div>
      </div>

      {/* Controls Row */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <button
            onClick={() => handleQuantityChange(item.quantity - 1)}
            style={{
              width: '28px',
              height: '28px',
              border: '1px solid var(--medium-gray)',
              borderRadius: '6px',
              background: 'var(--white)',
              color: 'var(--primary-black)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            −
          </button>

          <span style={{
            minWidth: '30px',
            textAlign: 'center',
            fontSize: '1rem',
            fontWeight: '500'
          }}>
            {item.quantity}
          </span>

          <button
            onClick={() => handleQuantityChange(item.quantity + 1)}
            style={{
              width: '28px',
              height: '28px',
              border: '1px solid var(--medium-gray)',
              borderRadius: '6px',
              background: 'var(--white)',
              color: 'var(--primary-black)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            +
          </button>
        </div>

        <button
        onClick={handleRemove}
        style={{
          background: 'transparent',
          border: '1px solid var(--medium-gray)',
          color: 'var(--medium-gray)',
          cursor: 'pointer',
          fontSize: '12px',
          padding: '6px 12px',
          borderRadius: '4px',
          transition: 'all 0.2s ease',
          fontWeight: '500'
        }}
        onMouseOver={(e) => {
          e.target.style.color = '#ef4444';
          e.target.style.borderColor = '#ef4444';
          e.target.style.background = 'rgba(239, 68, 68, 0.1)';
        }}
        onMouseOut={(e) => {
          e.target.style.color = 'var(--medium-gray)';
          e.target.style.borderColor = 'var(--medium-gray)';
          e.target.style.background = 'transparent';
        }}
        title="Remove item from cart"
      >
        Remove
      </button>
      </div>
    </div>
  );
}

export default CartItem;