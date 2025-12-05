import React, { useEffect } from 'react';

interface NotificationProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
  const bgColor = type === 'success' ? '#10b981' : '#ef4444';

  return (
    <div className="success-message" style={{ background: bgColor }}>
      <i className={`fas ${icon}`}></i>
      <span>{message}</span>
    </div>
  );
};

export default Notification;
