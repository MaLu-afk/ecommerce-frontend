// admin/components/shared/NotificationContainer.tsx
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { useNotificationContext } from '../../context/NotificationContext';
import type { NotificationType } from '../../hooks/useNotifications';

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case 'success':
      return <CheckCircle size={20} />;
    case 'error':
      return <AlertCircle size={20} />;
    case 'warning':
      return <AlertTriangle size={20} />;
    case 'info':
      return <Info size={20} />;
    default:
      return <Info size={20} />;
  }
};

const getNotificationStyles = (type: NotificationType) => {
  const baseStyle = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '16px',
    borderRadius: '8px',
    minWidth: '300px',
    maxWidth: '400px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    border: '1px solid',
    zIndex: 99999,
  };

  switch (type) {
    case 'success':
      return {
        ...baseStyle,
        background: '#f0fdf4',
        borderColor: '#bbf7d0',
        color: '#166534',
      };
    case 'error':
      return {
        ...baseStyle,
        background: '#fef2f2',
        borderColor: '#fecaca',
        color: '#dc2626',
      };
    case 'warning':
      return {
        ...baseStyle,
        background: '#fffbeb',
        borderColor: '#fed7aa',
        color: '#ea580c',
      };
    case 'info':
      return {
        ...baseStyle,
        background: '#eff6ff',
        borderColor: '#bfdbfe',
        color: '#1e40af',
      };
    default:
      return baseStyle;
  }
};

export default function NotificationContainer() {
  const { notifications, removeNotification } = useNotificationContext();

  if (notifications.length === 0) return null;

  return (
    <div
        style={{
        position: 'fixed',
        top: '100px', 
        right: '20px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        }}
    >
        {notifications.map((notification) => (
        <div
            key={notification.id}
            style={{
            ...getNotificationStyles(notification.type),
            backdropFilter: 'blur(8px)', 
            transition: 'all 0.3s ease-in-out',
            }}
        >
            <div style={{ flexShrink: 0, marginTop: '2px' }}>
            {getNotificationIcon(notification.type)}
            </div>

            <div style={{ flex: 1 }}>
            <div style={{ fontWeight: '600', fontSize: '14px', marginBottom: '4px' }}>
                {notification.title}
            </div>
            <div style={{ fontSize: '13px', lineHeight: '1.4' }}>
                {notification.message}
            </div>
            </div>

            <button
            onClick={() => removeNotification(notification.id)}
            style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '4px',
                flexShrink: 0,
                color: 'inherit',
                opacity: 0.7,
                transition: 'background 0.2s ease',
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(0,0,0,0.1)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.background = 'none';
            }}
            >
            <X size={16} />
            </button>
        </div>
        ))}
    </div>
    );

}