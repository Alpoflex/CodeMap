import { useEffect, useState } from 'react';

export default function Toast({ message, type = 'error', onClose, duration = 5000 }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColor = {
    error: 'from-red-500/20 to-red-500/10 border-red-500/30',
    success: 'from-green-500/20 to-green-500/10 border-green-500/30',
    info: 'from-accent-blue/20 to-accent-blue/10 border-accent-blue/30',
    warning: 'from-yellow-500/20 to-yellow-500/10 border-yellow-500/30',
  }[type];

  const iconColor = {
    error: 'text-red-400',
    success: 'text-green-400',
    info: 'text-accent-blue',
    warning: 'text-yellow-400',
  }[type];

  const icons = {
    error: '✕',
    success: '✓',
    info: 'ℹ',
    warning: '⚠',
  };

  return (
    <div
      className={`fixed top-20 right-4 z-[999] max-w-md transition-all duration-300 ${
        visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div className={`glass bg-gradient-to-r ${bgColor} rounded-xl px-4 py-3 flex items-start gap-3 shadow-xl`}>
        <span className={`${iconColor} text-lg font-bold mt-0.5`}>
          {icons[type]}
        </span>
        <p className="text-sm text-gray-200 flex-1">{message}</p>
        <button
          onClick={() => {
            setVisible(false);
            setTimeout(onClose, 300);
          }}
          className="text-gray-400 hover:text-white transition-colors text-lg leading-none"
        >
          ×
        </button>
      </div>
    </div>
  );
}
