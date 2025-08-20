import React, { useEffect } from 'react';
import '../styles/Notification.css';

function Notification({ message, type = 'success', isVisible, onClose }) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      default:
        return '✓';
    }
  };

  return (
    <div className={`notification notification-${type}`}>
      <span className="notification-icon">
        {getIcon()}
      </span>
      <span className="notification-message">{message}</span>
      
      <button
        onClick={onClose}
        className="notification-close-button"
      >
        ×
      </button>
    </div>
  );
}

export default Notification;