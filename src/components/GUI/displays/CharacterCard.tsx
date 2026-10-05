import { ReactNode } from 'react';

interface CharacterCardProps {
  name: string;
  image: string;
  hp: number;
  maxHp: number;
  badge?: ReactNode;
  children?: ReactNode;
  className?: string;
  animate?: boolean;
}

/**
 * 角色卡片组件
 * 用于显示玩家或怪物
 */
export default function CharacterCard({ 
  name, 
  image, 
  hp, 
  maxHp, 
  badge,
  children,
  className = '',
  animate = true
}: CharacterCardProps) {
  return (
    <div className={`text-center ${className}`}>
      <div className="relative">
        <img 
          src={image} 
          alt={name}
          className={`w-24 h-24 mx-auto mb-2 ${animate ? 'animate-float' : ''}`}
          onError={(e) => {
            e.currentTarget.src = '/placeholder.png';
          }}
        />
        {badge && (
          <div className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-xl">
            {badge}
          </div>
        )}
      </div>
      <div className="mt-4">
        <div className="text-lg font-bold text-gray-800 mb-2">{name}</div>
        <div className="w-full bg-gray-200 rounded-full h-4 mb-2 relative overflow-hidden">
          <div
            className="bg-green-500 h-4 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, Math.max(0, (hp / maxHp) * 100))}%` }}
          />
        </div>
        <div className="text-sm text-gray-600">HP: {hp}/{maxHp}</div>
      </div>
      {children}
    </div>
  );
}
