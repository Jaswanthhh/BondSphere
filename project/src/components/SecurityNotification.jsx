import React from 'react';
import { AlertTriangle, Shield, Bell } from 'lucide-react';
import PropTypes from 'prop-types';

export const SecurityNotification = ({ type, message, onClose }) => {
  const getNotificationStyle = () => {
    switch (type) {
      case 'warning':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'error':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'success':
        return 'bg-green-50 text-green-700 border-green-200';
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-5 h-5" />;
      case 'error':
        return <AlertTriangle className="w-5 h-5" />;
      case 'success':
        return <Shield className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  return (
    <div className={`fixed top-4 right-4 p-4 rounded-lg border ${getNotificationStyle()} shadow-lg max-w-md z-50`}>
      <div className="flex items-start gap-3">
        {getIcon()}
        <div className="flex-1">
          <p className="font-medium">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
          aria-label="Close notification"
        >
          ×
        </button>
      </div>
    </div>
  );
};

SecurityNotification.propTypes = {
  type: PropTypes.oneOf(['warning', 'error', 'success', 'info']).isRequired,
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired
}; 