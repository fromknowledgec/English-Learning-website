'use client';

import { worlds, knowledgePoints } from '@/data/questions';
import { useRouter } from 'next/navigation';

export default function KnowledgePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      {/* 顶部标题区域 */}
      <div className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            {/* 标题 */}
            <div className="flex items-center gap-3">
              <span className="text-3xl">📖</span>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                知识速查区
              </h1>
            </div>
            {/* 返回按钮 */}
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              <span>←</span>
              <span>返回</span>
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* 四大从句类型 */}
          <div className="space-y-8">
            {knowledgePoints.map((point, index) => {
              const world = worlds[index];
              return (
                <div key={point.worldId} className="bg-white rounded-2xl shadow-xl overflow-hidden">
                  {/* 顶部标题 */}
                  <div className={`bg-gradient-to-r ${world.color} text-white p-6`}>
                    <div className="flex items-center gap-4">
                      <div className="text-5xl">{world.emoji}</div>
                      <div>
                        <h2 className="text-3xl font-bold mb-1">World {point.worldId} - {point.worldName}</h2>
                        <p className="text-lg opacity-90">{point.description}</p>
                      </div>
                    </div>
                  </div>

                  {/* 内容区域 */}
                  <div className="p-6 space-y-6">
                    {/* 核心规则 */}
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                        <span>📚</span>
                        <span>核心规则</span>
                      </h3>
                      <ul className="space-y-2">
                        {point.keyRules.map((rule, ruleIndex) => (
                          <li
                            key={ruleIndex}
                            className="bg-blue-50 rounded-lg p-4 text-gray-700 leading-relaxed"
                          >
                            <span className="inline-block w-6 h-6 rounded-full bg-blue-500 text-white text-sm font-bold text-center mr-2">
                              {ruleIndex + 1}
                            </span>
                            {rule}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* 例句 */}
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                        <span>💡</span>
                        <span>例句</span>
                      </h3>
                      <div className="bg-green-50 rounded-lg p-4">
                        <ul className="space-y-2">
                          {point.examples.map((example, exampleIndex) => (
                            <li
                              key={exampleIndex}
                              className="text-gray-700 italic leading-relaxed pl-4 border-l-4 border-green-500"
                            >
                              {example}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 底部提示 */}
          <div className="mt-12 bg-white rounded-xl shadow-lg p-6">
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                💡 熟练掌握以上知识点，帮助你更好地完成各关卡的挑战！
              </p>
              <button
                onClick={() => router.push('/')}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-bold hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                开始挑战 🚀
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
