import React, { useState, useEffect } from 'react';

const Alert = ({ type = 'info', message, onClose, duration = 5000, show = true }) => {
  const [isVisible, setIsVisible] = useState(show);

  useEffect(() => {
    setIsVisible(show);
    
    if (show && duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [show, duration]);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  if (!isVisible) return null;

  const alertStyles = {
    success: {
      bg: 'linear-gradient(135deg, #22c55e, #16a34a)',
      border: '1px solid rgba(34, 197, 94, 0.3)',
      icon: '✓',
      iconBg: 'rgba(34, 197, 94, 0.2)'
    },
    error: {
      bg: 'linear-gradient(135deg, #ef4444, #dc2626)',
      border: '1px solid rgba(239, 68, 68, 0.3)',
      icon: '✕',
      iconBg: 'rgba(239, 68, 68, 0.2)'
    },
    warning: {
      bg: 'linear-gradient(135deg, #f59e0b, #d97706)',
      border: '1px solid rgba(245, 158, 11, 0.3)',
      icon: '⚠',
      iconBg: 'rgba(245, 158, 11, 0.2)'
    },
    info: {
      bg: 'linear-gradient(135deg, #3b82f6, #2563eb)',
      border: '1px solid rgba(59, 130, 246, 0.3)',
      icon: 'ℹ',
      iconBg: 'rgba(59, 130, 246, 0.2)'
    }
  };

  const style = alertStyles[type] || alertStyles.info;

  return (
    <div 
      className="custom-alert"
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 9999,
        minWidth: '320px',
        maxWidth: '500px',
        background: style.bg,
        border: style.border,
        borderRadius: '12px',
        padding: '16px 20px',
        color: 'white',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3), 0 4px 12px rgba(0, 0, 0, 0.15)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        animation: 'slideInRight 0.3s ease-out',
        fontFamily: 'ui-sans-serif, system-ui, -apple-system, sans-serif'
      }}
    >
      <div 
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          background: style.iconBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '16px',
          fontWeight: 'bold',
          flexShrink: 0
        }}
      >
        {style.icon}
      </div>
      
      <div style={{ flex: 1, fontSize: '14px', lineHeight: '1.4' }}>
        {message}
      </div>
      
      <button
        onClick={handleClose}
        style={{
          background: 'none',
          border: 'none',
          color: 'white',
          fontSize: '18px',
          cursor: 'pointer',
          padding: '4px',
          borderRadius: '4px',
          opacity: 0.8,
          transition: 'opacity 0.2s ease',
          flexShrink: 0
        }}
        onMouseEnter={(e) => e.target.style.opacity = '1'}
        onMouseLeave={(e) => e.target.style.opacity = '0.8'}
      >
        ×
      </button>
    </div>
  );
};

export default Alert;

