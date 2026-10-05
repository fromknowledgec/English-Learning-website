import { ReactNode } from 'react';

interface SuccessMessageProps {
  title: string;
  message?: string;
  icon?: string;
  className?: string;
}

/**
 * 成功消息组件
 */
export default function SuccessMessage({ 
  title, 
  message, 
  icon = '✨',
  className = ''
}: SuccessMessageProps) {
  return (
    <div className={`bg-green-100 border-2 border-green-500 rounded-xl p-6 text-center animate-in slide-in-from-bottom-4 ${className}`}>
      <div className="text-4xl mb-2">{icon}</div>
      <h3 className="text-2xl font-bold text-green-700 mb-2">{title}</h3>
      {message && <p className="text-green-600">{message}</p>}
    </div>
  );
}
