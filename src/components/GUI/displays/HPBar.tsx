interface HPBarProps {
  current: number;
  max: number;
  label: string;
  color?: 'green' | 'red';
  className?: string;
}

/**
 * 生命值条组件
 * 用于战斗系统显示HP
 */
export default function HPBar({ 
  current, 
  max, 
  label, 
  color = 'green',
  className = ''
}: HPBarProps) {
  const percentage = (current / max) * 100;
  
  const colorClasses = {
    'green': 'bg-green-500',
    'red': 'bg-red-500'
  };

  return (
    <div className={className}>
      <div className="text-lg font-bold text-gray-800 mb-2">{label}</div>
      <div className="w-full bg-gray-200 rounded-full h-4 mb-2 relative overflow-hidden">
        <div
          className={`${colorClasses[color]} h-4 rounded-full transition-all duration-500`}
          style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
        />
      </div>
      <div className="text-sm text-gray-600">
        HP: {current}/{max}
      </div>
    </div>
  );
}
