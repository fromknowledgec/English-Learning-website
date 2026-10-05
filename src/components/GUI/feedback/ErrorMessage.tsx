import { ReactNode } from 'react';

interface ErrorMessageProps {
  title: string;
  message?: string;
  icon?: string;
  className?: string;
}

/**
 * 错误消息组件
 */
export default function ErrorMessage({ 
  title, 
  message, 
  icon = '❌',
  className = ''
}: ErrorMessageProps) {
  return (
    <div className={`bg-red-100 border-2 border-red-500 rounded-xl p-6 text-center animate-in slide-in-from-bottom-4 ${className}`}>
      <div className="text-4xl mb-2">{icon}</div>
      <h3 className="text-2xl font-bold text-red-700 mb-2">{title}</h3>
      {message && <p className="text-red-600">{message}</p>}
    </div>
  );
}
