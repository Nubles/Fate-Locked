import React, { useEffect } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

export const Toast = ({ message, type = 'info', isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const bg = type === 'success' ? 'bg-green-900/90 border-green-500' : 'bg-red-900/90 border-red-500';
  const Icon = type === 'success' ? CheckCircle : XCircle;

  return (
    <div className={`fixed bottom-8 right-8 ${bg} border-l-4 text-white p-4 rounded shadow-lg flex items-center gap-3 z-50 animate-in slide-in-from-right duration-300`}>
      <Icon size={24} />
      <span className="font-medium">{message}</span>
    </div>
  );
};
