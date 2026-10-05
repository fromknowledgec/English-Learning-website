import { ReactNode } from 'react';

interface InfoMessageProps {
  message: string;
  icon?: string;
  className?: string;
}

/**
 * 提示消息组件
 */
export default function InfoMessage({ 
  message, 
  icon = '💡',
  className = ''
}: InfoMessageProps) {
  return (
    <div className={`bg-yellow-100 border-l-4 border-yellow-400 p-4 ${className}`}>
      <p className="text-sm text-yellow-800">
        {icon} {message}
      </p>
    </div>
  );
}
