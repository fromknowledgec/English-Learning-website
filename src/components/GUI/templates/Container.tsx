import { ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

/**
 * 通用容器组件
 * 提供统一的宽度限制和居中
 */
export default function Container({ 
  children, 
  className = '',
  size = 'xl'
}: ContainerProps) {
  const sizeClasses = {
    'sm': 'max-w-sm',
    'md': 'max-w-md',
    'lg': 'max-w-lg',
    'xl': 'max-w-xl',
    '2xl': 'max-w-2xl',
    'full': 'max-w-full'
  };

  return (
    <div className={`container mx-auto px-4 py-8 ${sizeClasses[size]} ${className}`}>
      {children}
    </div>
  );
}
