import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'battle';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
}

/**
 * 通用卡片组件
 * 提供统一的卡片样式
 */
export default function Card({ 
  children, 
  className = '',
  variant = 'default',
  shadow = 'lg',
  padding = 'lg',
  rounded = '2xl'
}: CardProps) {
  const variantClasses = {
    'default': 'bg-white',
    'primary': 'bg-gradient-to-br from-blue-500 to-blue-600 text-white',
    'success': 'bg-green-50 border-2 border-green-500',
    'warning': 'bg-yellow-50 border-2 border-yellow-500',
    'danger': 'bg-red-50 border-2 border-red-500',
    'battle': 'bg-gradient-to-b from-purple-100 to-blue-100 rounded-3xl'
  };

  const shadowClasses = {
    'none': '',
    'sm': 'shadow-sm',
    'md': 'shadow-md',
    'lg': 'shadow-lg',
    'xl': 'shadow-xl'
  };

  const paddingClasses = {
    'sm': 'p-4',
    'md': 'p-6',
    'lg': 'p-8',
    'xl': 'p-12'
  };

  const roundedClasses = {
    'none': 'rounded-none',
    'sm': 'rounded-sm',
    'md': 'rounded-md',
    'lg': 'rounded-lg',
    'xl': 'rounded-xl',
    '2xl': 'rounded-2xl',
    '3xl': 'rounded-3xl'
  };

  return (
    <div className={`
      ${variantClasses[variant]}
      ${shadowClasses[shadow]}
      ${paddingClasses[padding]}
      ${variant === 'battle' ? '' : roundedClasses[rounded]}
      ${className}
    `}>
      {children}
    </div>
  );
}
