import { ReactNode } from 'react';

interface WarningMessageProps {
  title: string;
  message?: string;
  icon?: string;
  className?: string;
}

/**
 * 警告消息组件
 */
export default function WarningMessage({ 
  title, 
  message, 
  icon = '⚠️',
  className = ''
}: WarningMessageProps) {
  return (
    <div className={`bg-yellow-100 border-2 border-yellow-500 rounded-xl p-6 text-center animate-in slide-in-from-bottom-4 ${className}`}>
      <div className="text-4xl mb-2">{icon}</div>
      <h3 className="text-2xl font-bold text-yellow-700 mb-2">{title}</h3>
      {message && <p className="text-yellow-600">{message}</p>}
    </div>
  );
}
