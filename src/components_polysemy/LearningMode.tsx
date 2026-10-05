// 占位符组件 - 暂时未实现
import type { GroupData, ErrorRecord as GameErrorRecord } from '@/types/game';

interface LearningModeProps {
  groupData: GroupData;
  onComplete: (finalWeaponLevel: number, errors: GameErrorRecord[]) => void;
  onBack: () => void;
}

export default function LearningMode({ groupData, onComplete, onBack }: LearningModeProps) {
  return (
    <div className="p-8 text-center">
      <h2 className="text-2xl font-bold mb-4">学习模式</h2>
      <p className="text-gray-600">该功能正在开发中...</p>
      <p className="text-sm text-gray-400 mt-2">当前组: {groupData?.name || 'N/A'}, 词汇数: {groupData?.words?.length || 0}</p>
    </div>
  );
}
