import React, { useEffect } from 'react';

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

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return '#10b981';
      case 'error':
        return '#ef4444';
      case 'warning':
        return '#f59e0b';
      default:
        return '#10b981';
    }
  };

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
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: getBackgroundColor(),
      color: 'white',
      padding: '16px 24px',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      zIndex: 1001,
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      maxWidth: '400px',
      animation: 'slideInFromRight 0.3s ease-out',
      fontSize: '14px',
      fontWeight: '500'
    }}>
      <span style={{
        fontSize: '16px',
        fontWeight: 'bold'
      }}>
        {getIcon()}
      </span>
      <span>{message}</span>
      
      <button
        onClick={onClose}
        style={{
          background: 'transparent',
          border: 'none',
          color: 'white',
          cursor: 'pointer',
          fontSize: '16px',
          marginLeft: 'auto',
          padding: '0',
          opacity: 0.7,
          transition: 'opacity 0.2s ease'
        }}
        onMouseOver={(e) => e.target.style.opacity = '1'}
        onMouseOut={(e) => e.target.style.opacity = '0.7'}
      >
        ×
      </button>

      <style>
        {`
          @keyframes slideInFromRight {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
        `}
      </style>
    </div>
  );
}

export default Notification;