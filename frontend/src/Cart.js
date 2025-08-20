import React, { useState, useEffect } from 'react';
import api from './api/axios';
import CartItem from './CartItem';
import { getCurrencySymbol } from './utils/currency';
import './styles/Cart.css';

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
      <div className="cart-backdrop" onClick={onClose} />
      
      <div className="cart-panel" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <h2 className="cart-title">Shopping Cart</h2>
          <button onClick={onClose} className="cart-close-button" title="Close Cart">
            ✕
          </button>
        </div>

        <div className="cart-content">
          {loading && <div className="cart-loading">Loading cart...</div>}

          {error && <div className="cart-error">{error}</div>}

          {!loading && !error && cart.length === 0 && (
            <div className="cart-empty">
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
          <div className="cart-footer">
            <div className="cart-total-section">
              <span>Total ({itemCount} items):</span>
              <span className="cart-total-amount">
                {cart.length > 0 && getCurrencySymbol(cart[0].currency)}{total}
              </span>
            </div>

            <button className="cart-checkout-button">
              Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default Cart;