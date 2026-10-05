import { ReactNode } from 'react';

interface OptionCardProps {
  children: ReactNode;
  keyLabel: string;
  selected?: boolean;
  correct?: boolean;
  wrong?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

/**
 * 选项卡片组件
 * 用于学习模式和练习模式的选项展示
 */
export default function OptionCard({ 
  children, 
  keyLabel,
  selected = false,
  correct = false,
  wrong = false,
  disabled = false,
  onClick,
  className = ''
}: OptionCardProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        p-4 rounded-xl text-left transition-all duration-200 border-2
        ${selected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white hover:border-blue-300'}
        ${correct ? 'border-green-500 bg-green-50' : ''}
        ${wrong ? 'border-red-500 bg-red-50' : ''}
        ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      <div className="flex items-center gap-3">
        <span className={`
          w-8 h-8 rounded-full flex items-center justify-center font-bold
          ${selected ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}
        `}>
          {keyLabel}
        </span>
        <span className="flex-1">{children}</span>
        {selected && <span className="text-2xl">✓</span>}
      </div>
    </button>
  );
}
