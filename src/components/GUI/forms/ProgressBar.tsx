interface ProgressBarProps {
  progress: number; // 0-100
  color?: 'green' | 'red' | 'blue' | 'purple' | 'yellow';
  showPercentage?: boolean;
  className?: string;
  label?: string;
}

/**
 * 进度条组件
 */
export default function ProgressBar({ 
  progress, 
  color = 'blue',
  showPercentage = false,
  className = '',
  label
}: ProgressBarProps) {
  const colorClasses = {
    'green': 'bg-green-500',
    'red': 'bg-red-500',
    'blue': 'bg-blue-600',
    'purple': 'bg-purple-500',
    'yellow': 'bg-yellow-500'
  };

  return (
    <div className={className}>
      {label && (
        <div className="flex justify-between mb-2">
          <span className="text-sm text-gray-600">{label}</span>
          {showPercentage && (
            <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
          )}
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-4 relative overflow-hidden">
        <div
          className={`${colorClasses[color]} h-4 rounded-full transition-all duration-500`}
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
    </div>
  );
}
