import { useState, useEffect, createContext, useContext } from 'react';
import { X, CheckCircle, AlertTriangle, Info, AlertCircle } from 'lucide-react';
import { cn } from "../../lib/utils";
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';

// Context for notification system
const NotificationContext = createContext(null);

// Types of notifications
const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};

// Icons for each notification type
const ICONS = {
  [NOTIFICATION_TYPES.SUCCESS]: CheckCircle,
  [NOTIFICATION_TYPES.ERROR]: AlertCircle,
  [NOTIFICATION_TYPES.WARNING]: AlertTriangle,
  [NOTIFICATION_TYPES.INFO]: Info,
};

// Colors for each notification type
const COLORS = {
  [NOTIFICATION_TYPES.SUCCESS]: 'bg-green-900/20 border-green-500 text-green-400',
  [NOTIFICATION_TYPES.ERROR]: 'bg-red-900/20 border-red-500 text-red-400',
  [NOTIFICATION_TYPES.WARNING]: 'bg-amber-900/20 border-amber-500 text-amber-400',
  [NOTIFICATION_TYPES.INFO]: 'bg-purple-900/20 border-purple-500 text-purple-400',
};

// Individual notification component
export const Notification = ({
  id,
  type = NOTIFICATION_TYPES.INFO,
  title,
  message,
  duration = 5000,
  onClose,
  position = 'top-right',
  customIcon,
  customClass = '',
  showClose = true,
  action,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const Icon = customIcon || ICONS[type];

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose(id), 300); // Allow exit animation
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, id, onClose]);

  return (
    <div 
      className={cn(
        'flex items-start p-4 mb-3 rounded-md border shadow-md transform transition-all duration-300 ease-in-out',
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0',
        COLORS[type],
        customClass
      )}
      role="alert"
    >
      <div className="flex-shrink-0 mr-3">
        <Icon className="h-5 w-5" />
      </div>

      <div className="flex-1 mr-2">
        {title && <div className="font-medium">{title}</div>}
        {message && <div className="text-sm opacity-90">{message}</div>}
        
        {action && (
          <div className="mt-2">
            {action}
          </div>
        )}
      </div>

      {showClose && (
        <button 
          type="button" 
          className="flex-shrink-0 rounded-md hover:bg-black/10 p-1" 
          onClick={() => {
            setIsVisible(false);
            setTimeout(() => onClose(id), 300);
          }}
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

Notification.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  type: PropTypes.oneOf(Object.values(NOTIFICATION_TYPES)),
  title: PropTypes.node,
  message: PropTypes.node,
  duration: PropTypes.number,
  onClose: PropTypes.func.isRequired,
  position: PropTypes.string,
  customIcon: PropTypes.elementType,
  customClass: PropTypes.string,
  showClose: PropTypes.bool,
  action: PropTypes.node,
};

// Notification container positions
const POSITIONS = {
  'top-right': 'top-5 right-5',
  'top-left': 'top-5 left-5',
  'bottom-right': 'bottom-5 right-5',
  'bottom-left': 'bottom-5 left-5',
  'top-center': 'top-5 left-1/2 transform -translate-x-1/2',
  'bottom-center': 'bottom-5 left-1/2 transform -translate-x-1/2',
};

// Container for notifications
export const NotificationsContainer = ({ position = 'top-right', maxNotifications = 5 }) => {
  const { notifications } = useNotifications();
  const positionClass = POSITIONS[position] || POSITIONS['top-right'];
  
  // Only show the most recent notifications if there are too many
  const visibleNotifications = notifications.length > maxNotifications 
    ? notifications.slice(0, maxNotifications) 
    : notifications;

  return createPortal(
    <div className={`fixed z-50 flex flex-col ${positionClass}`}>
      {visibleNotifications.map(notification => (
        <Notification
          key={notification.id}
          {...notification}
        />
      ))}
    </div>,
    document.body
  );
};

NotificationsContainer.propTypes = {
  position: PropTypes.oneOf(Object.keys(POSITIONS)),
  maxNotifications: PropTypes.number,
};

// Provider component
export const NotificationsProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const showNotification = (props) => {
    const id = Date.now();
    const notification = { id, ...props };
    setNotifications(prev => [...prev, notification]);
    return id;
  };

  const updateNotification = (id, props) => {
    setNotifications(prev => prev.map(notification => 
      notification.id === id ? { ...notification, ...props } : notification
    ));
  };

  const hideNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const hideAllNotifications = () => {
    setNotifications([]);
  };

  const contextValue = {
    notifications,
    showNotification,
    updateNotification,
    hideNotification,
    hideAllNotifications,
    // Shorthand methods
    success: (props) => showNotification({ type: NOTIFICATION_TYPES.SUCCESS, ...props }),
    error: (props) => showNotification({ type: NOTIFICATION_TYPES.ERROR, ...props }),
    warning: (props) => showNotification({ type: NOTIFICATION_TYPES.WARNING, ...props }),
    info: (props) => showNotification({ type: NOTIFICATION_TYPES.INFO, ...props }),
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

NotificationsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Hook to use notifications
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
};

// Export constants
export { NOTIFICATION_TYPES };