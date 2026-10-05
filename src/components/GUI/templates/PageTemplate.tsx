import { ReactNode } from 'react';

interface PageTemplateProps {
  children: ReactNode;
  className?: string;
  gradient?: 'blue-green' | 'purple-blue' | 'warm' | 'cool';
}

/**
 * 通用页面模板
 * 提供统一的页面布局和背景渐变
 */
export default function PageTemplate({ 
  children, 
  className = '',
  gradient = 'blue-green'
}: PageTemplateProps) {
  const gradientClasses = {
    'blue-green': 'from-blue-50 to-green-50',
    'purple-blue': 'from-purple-50 to-blue-50',
    'warm': 'from-orange-50 to-red-50',
    'cool': 'from-cyan-50 to-blue-50'
  };

  return (
    <div className={`min-h-screen bg-gradient-to-b ${gradientClasses[gradient]} ${className}`}>
      {children}
    </div>
  );
}
