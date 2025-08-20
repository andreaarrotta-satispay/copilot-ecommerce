import React from 'react';
import { getCurrencySymbol } from '../utils/currency';
import '../styles/CartItem.css';

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
    <div className="cart-item">
      <div className="cart-item-info">
        <div className="cart-item-details">
          <h4 className="cart-item-name">{item.name}</h4>
          <p className="cart-item-price">
            {getCurrencySymbol(item.currency)}{item.price} each
          </p>
        </div>
        
        <div className="cart-item-subtotal">
          {getCurrencySymbol(item.currency)}{item.subtotal}
        </div>
      </div>

      <div className="cart-item-controls">
        <div className="cart-item-quantity-controls">
          <button
            onClick={() => handleQuantityChange(item.quantity - 1)}
            className="cart-item-quantity-button"
          >
            −
          </button>

          <span className="cart-item-quantity">{item.quantity}</span>

          <button
            onClick={() => handleQuantityChange(item.quantity + 1)}
            className="cart-item-quantity-button"
          >
            +
          </button>
        </div>

        <button
          onClick={handleRemove}
          className="cart-item-remove-button"
          title="Remove item from cart"
        >
          Remove
        </button>
      </div>
    </div>
  );
}

export default CartItem;