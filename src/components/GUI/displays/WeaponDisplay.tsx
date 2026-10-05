interface WeaponDisplayProps {
  name: string;
  emoji: string;
  damage: number;
  className?: string;
}

/**
 * 武器显示组件
 */
export default function WeaponDisplay({ 
  name, 
  emoji, 
  damage,
  className = ''
}: WeaponDisplayProps) {
  return (
    <div className={`bg-blue-50 rounded-xl p-4 text-center ${className}`}>
      <div className="flex items-center justify-center gap-2">
        <span className="text-3xl">{emoji}</span>
        <div>
          <div className="font-bold text-gray-800">{name}</div>
          <div className="text-sm text-gray-600">攻击力: {damage}</div>
        </div>
      </div>
    </div>
  );
}
