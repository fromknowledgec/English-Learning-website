// 占位符组件 - 暂时未实现
import type { GroupData, PracticeErrorRecord } from '@/types/game';

interface PracticeModeProps {
  groupData: GroupData;
  weaponLevel: number;
  onComplete: (victory: boolean, errors: PracticeErrorRecord[]) => void;
}

export default function PracticeMode({ groupData, weaponLevel, onComplete }: PracticeModeProps) {
  return (
    <div className="p-8 text-center">
      <h2 className="text-2xl font-bold mb-4">练习模式</h2>
      <p className="text-gray-600">该功能正在开发中...</p>
      <p className="text-sm text-gray-400 mt-2">当前组: {groupData?.name || 'N/A'}, 武器等级: {weaponLevel}</p>
    </div>
  );
}
