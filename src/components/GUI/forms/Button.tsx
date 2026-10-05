import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  className?: string;
  fullWidth?: boolean;
}

/**
 * 通用按钮组件
 */
export default function Button({ 
  children, 
  onClick, 
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  fullWidth = false
}: ButtonProps) {
  const variantClasses = {
    'primary': 'bg-blue-600 text-white hover:bg-blue-700',
    'secondary': 'bg-gray-600 text-white hover:bg-gray-700',
    'success': 'bg-green-600 text-white hover:bg-green-700',
    'danger': 'bg-red-600 text-white hover:bg-red-700',
    'warning': 'bg-yellow-600 text-white hover:bg-yellow-700',
    'ghost': 'bg-transparent text-gray-700 hover:bg-gray-100'
  };

  const sizeClasses = {
    'sm': 'px-3 py-2 text-sm',
    'md': 'px-4 py-2 text-base',
    'lg': 'px-6 py-3 text-lg',
    'xl': 'px-8 py-4 text-xl'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${fullWidth ? 'w-full' : ''}
        rounded-lg font-bold transition-colors
        disabled:bg-gray-300 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {children}
    </button>
  );
}
