'use client';

import { levels, worlds } from '@/data/questions';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const handleLevelClick = (levelId: number) => {
    router.push(`/level/${levelId}`);
  };

  const handleKnowledgeClick = () => {
    router.push('/knowledge');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      {/* 顶部标题区域 */}
      <div className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col items-center justify-center">
            {/* 两个Logo */}
            <div className="flex items-center justify-center gap-8 mb-4">
              <img
                src="/jxnu_fz_logo.png"
                alt="江西师大附中校徽"
                className="h-20 w-auto object-contain"
              />
              <img
                src="/jxnu_logo.png"
                alt="江西师范大学Logo"
                className="h-20 w-auto object-contain"
              />
            </div>
            {/* 标题 */}
            <h1 className="text-4xl md:text-5xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              名词性从句闯关王
            </h1>
            {/* 知识速查按钮 */}
            <button
              onClick={handleKnowledgeClick}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-bold"
            >
              <span className="text-xl">📖</span>
              <span>知识速查</span>
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* 关卡选择区域 */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">选择关卡</h2>

          {/* 按World分组显示关卡 */}
          {worlds.map((world) => {
            const worldLevels = levels.filter((level) => level.worldId === world.id);
            return (
              <div key={world.id} className="mb-8">
                <div className={`bg-gradient-to-r ${world.color} text-white rounded-xl p-4 mb-4`}>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{world.emoji}</span>
                    <div>
                      <h3 className="text-2xl font-bold">World {world.id} - {world.name}</h3>
                      <p className="text-sm opacity-90">共 {worldLevels.length} 个关卡</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {worldLevels.map((level) => (
                    <button
                      key={level.id}
                      onClick={() => handleLevelClick(level.id)}
                      className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 border-2 border-transparent hover:border-blue-500 cursor-pointer"
                    >
                      <div className="text-center">
                        <div className={`inline-block w-12 h-12 rounded-full bg-gradient-to-r ${world.color} text-white text-2xl font-bold mb-3`}>
                          {level.id}
                        </div>
                        <h4 className="text-xl font-bold text-gray-800 mb-2">{level.name}</h4>
                        <p className="text-sm text-gray-600 mb-3">{level.description}</p>
                        <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                          <span>📚 {level.learningQuestions.length}题</span>
                          <span>⚔️ {level.practiceQuestions.length}题</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
