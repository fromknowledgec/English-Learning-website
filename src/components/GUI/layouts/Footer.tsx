import { ReactNode } from 'react';

interface FooterProps {
  children?: ReactNode;
  className?: string;
}

/**
 * 底部组件
 */
export default function Footer({ children, className = '' }: FooterProps) {
  return (
    <footer className={`bg-gray-800 text-white py-6 mt-auto ${className}`}>
      <div className="container mx-auto px-4 text-center">
        {children || (
          <p className="text-gray-400">
            © 2026 英萃英语学习 | 结合优秀材料 · 聚焦高一英语
          </p>
        )}
      </div>
    </footer>
  );
}
