import React, { createContext, useContext, useState } from 'react';
import Alert from './Alert';

const AlertContext = createContext();

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};

export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);

  const showAlert = (type, message, duration = 5000) => {
    const id = Date.now() + Math.random();
    const newAlert = { id, type, message, duration };
    
    setAlerts(prev => [...prev, newAlert]);
    
    return id;
  };

  const hideAlert = (id) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const success = (message, duration) => showAlert('success', message, duration);
  const error = (message, duration) => showAlert('error', message, duration);
  const warning = (message, duration) => showAlert('warning', message, duration);
  const info = (message, duration) => showAlert('info', message, duration);

  return (
    <AlertContext.Provider value={{ success, error, warning, info, hideAlert }}>
      {children}
      {alerts.map(alert => (
        <Alert
          key={alert.id}
          type={alert.type}
          message={alert.message}
          duration={alert.duration}
          onClose={() => hideAlert(alert.id)}
        />
      ))}
    </AlertContext.Provider>
  );
};

