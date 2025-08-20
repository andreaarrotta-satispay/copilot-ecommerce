import React, { useState, useEffect } from 'react';
import api from './api/axios';
import CartItem from './CartItem';
import { getCurrencySymbol } from './utils/currency';

function Cart({ isVisible, onClose, showNotification }) {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [itemCount, setItemCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isVisible) {
      fetchCart();
    }
  }, [isVisible]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/carts/session');
      setCart(response.data.cart);
      setTotal(response.data.total);
      setItemCount(response.data.itemCount);
    } catch (err) {
      setError('Failed to load cart. Please try again.');
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    try {
      const response = await api.post('/carts/session/products', {
        productId,
        quantity: newQuantity - cart.find(item => item.productId === productId)?.quantity || 0
      });
      setCart(response.data.cart);
      setTotal(response.data.total);
      setItemCount(response.data.itemCount);
    } catch (err) {
      setError('Failed to update cart. Please try again.');
      console.error('Error updating cart:', err);
      if (showNotification) {
        showNotification('Failed to update quantity. Please try again.', 'error');
      }
    }
  };

  const removeItem = async (productId) => {
    try {
      // Get the item name before removing it
      const itemToRemove = cart.find(item => item.productId === productId);
      const itemName = itemToRemove ? itemToRemove.name : 'Item';
      
      const response = await api.delete(`/carts/session/products/${productId}`);
      setCart(response.data.cart);
      setTotal(response.data.total);
      setItemCount(response.data.itemCount);
      
      if (showNotification) {
        showNotification(`${itemName} removed from cart`, 'success');
      }
    } catch (err) {
      setError('Failed to remove item. Please try again.');
      console.error('Error removing item:', err);
      if (showNotification) {
        showNotification('Failed to remove item. Please try again.', 'error');
      }
    }
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop overlay */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          zIndex: 999,
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.3s ease'
        }}
        onClick={onClose}
      />
      
      {/* Cart panel */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '400px',
          height: '100vh',
          background: 'var(--white)',
          boxShadow: '-4px 0 20px rgba(0,0,0,0.1)',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          transform: isVisible ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s ease'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{
        padding: '20px',
        borderBottom: '1px solid rgba(0,0,0,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h2 style={{
          margin: 0,
          fontSize: '1.5rem',
          fontWeight: '400',
          color: 'var(--primary-black)'
        }}>
          Shopping Cart
        </h2>
        <button
          onClick={onClose}
          style={{
            background: 'transparent',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer',
            color: 'var(--medium-gray)',
            padding: '8px',
            borderRadius: '4px',
            transition: 'all 0.2s ease',
            fontWeight: 'bold'
          }}
          onMouseOver={(e) => {
            e.target.style.color = '#ef4444';
            e.target.style.background = 'rgba(239, 68, 68, 0.1)';
          }}
          onMouseOut={(e) => {
            e.target.style.color = 'var(--medium-gray)';
            e.target.style.background = 'transparent';
          }}
          title="Close Cart"
        >
          ✕
        </button>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '20px' }}>
        {loading && (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            color: 'var(--medium-gray)'
          }}>
            Loading cart...
          </div>
        )}

        {error && (
          <div style={{
            textAlign: 'center',
            padding: '20px',
            color: '#ef4444',
            background: 'rgba(239, 68, 68, 0.1)',
            borderRadius: '8px',
            margin: '20px 0'
          }}>
            {error}
          </div>
        )}

        {!loading && !error && cart.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            color: 'var(--medium-gray)'
          }}>
            <h3>Your cart is empty</h3>
            <p>Add some items to get started!</p>
          </div>
        )}

        {!loading && cart.length > 0 && (
          <div>
            {cart.map(item => (
              <CartItem
                key={item.productId}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeItem}
                showNotification={showNotification}
              />
            ))}
          </div>
        )}
      </div>

      {!loading && cart.length > 0 && (
        <div style={{
          padding: '20px',
          borderTop: '1px solid rgba(0,0,0,0.1)',
          background: 'var(--white)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            fontSize: '1.2rem',
            fontWeight: '500'
          }}>
            <span>Total ({itemCount} items):</span>
            <span style={{ color: 'var(--primary-black)' }}>
              {cart.length > 0 && getCurrencySymbol(cart[0].currency)}{total}
            </span>
          </div>

          <button
            style={{
              width: '100%',
              padding: '16px',
              background: 'linear-gradient(135deg, var(--primary-black) 0%, var(--secondary-black) 100%)',
              color: 'var(--white)',
              border: 'none',
              borderRadius: '12px',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.background = 'linear-gradient(135deg, var(--accent-orange) 0%, #e55a00 100%)';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'linear-gradient(135deg, var(--primary-black) 0%, var(--secondary-black) 100%)';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            Checkout
          </button>
        </div>
      )}
      </div>
    </>
  );
}

export default Cart;