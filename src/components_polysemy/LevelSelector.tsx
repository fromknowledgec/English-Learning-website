// 占位符组件 - 暂时未实现
interface LevelSelectorProps {
  levels: number;
  unlockedLevels: number[];
  onSelectLevel: (level: number) => void;
}

export default function LevelSelector({ levels, unlockedLevels, onSelectLevel }: LevelSelectorProps) {
  return (
    <div className="p-8 text-center">
      <h2 className="text-2xl font-bold mb-4">选择关卡</h2>
      <p className="text-gray-600">该功能正在开发中...</p>
      <p className="text-sm text-gray-400 mt-2">总关卡: {levels}, 已解锁: {unlockedLevels.length}</p>
    </div>
  );
}
