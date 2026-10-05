'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Swords, Trophy, ArrowRight } from 'lucide-react';
import { progressManager } from '@/lib/progress-manager';
import Image from 'next/image';

interface ModuleInfo {
  id: string;
  name: string;
  description: string;
  icon: string;
  path: string;
  color: string;
}

const modules: ModuleInfo[] = [
  {
    id: 'sSpelling',
    name: '-s的读音及拼写',
    description: '掌握-s后缀的读音规则和拼写变化',
    icon: '📖',
    path: '/s-spelling',
    color: 'from-blue-500 to-blue-600',
  },
  {
    id: 'edSpelling',
    name: '-ed读音及拼写',
    description: '学习-ed形式的读音规则和拼写变化',
    icon: '📚',
    path: '/ed-spelling',
    color: 'from-cyan-500 to-cyan-600',
  },
  {
    id: 'ingSpelling',
    name: '-ing拼写',
    description: '掌握-ing形式的拼写规则和用法',
    icon: '✍️',
    path: '/ing-spelling',
    color: 'from-teal-500 to-teal-600',
  },
  {
    id: 'britishAmericanDiff',
    name: '英式英语与美式英语的区别',
    description: '了解英美英语在拼写和用词上的差异',
    icon: '🌍',
    path: '/british-american-diff',
    color: 'from-purple-500 to-purple-600',
  },
  {
    id: 'sentenceAnalysis',
    name: '句子成分分析',
    description: '理解主谓宾定状补等句子成分',
    icon: '📝',
    path: '/sentence-analysis',
    color: 'from-pink-500 to-pink-600',
  },
  {
    id: 'irregularVerbs',
    name: '不规则动词变化考查',
    description: '掌握不规则动词的变化形式和用法',
    icon: '🔄',
    path: '/irregular-verbs',
    color: 'from-red-500 to-red-600',
  },
  {
    id: 'chunks',
    name: '词块考查',
    description: '学习固定搭配和词组，提高表达能力',
    icon: '🧩',
    path: '/chunks',
    color: 'from-orange-500 to-orange-600',
  },
  {
    id: 'tenseVoice',
    name: '时态语态考查',
    description: '掌握英语时态和被动语态的用法',
    icon: '⏰',
    path: '/tense-voice',
    color: 'from-yellow-500 to-yellow-600',
  },
  {
    id: 'attributiveClause',
    name: '定语从句过关',
    description: '理解和掌握定语从句的用法',
    icon: '🔗',
    path: '/attributive-clause',
    color: 'from-indigo-500 to-indigo-600',
  },
  {
    id: 'britishAmericanCulture',
    name: '英美文化常识',
    description: '了解英美国家的历史、文化和习俗',
    icon: '🏛️',
    path: '/british-american-culture',
    color: 'from-fuchsia-500 to-fuchsia-600',
  },
];

export default function Home() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [wrongWordsStats, setWrongWordsStats] = useState({
    total: 0,
    pending: 0,
    mastered: 0,
  });

  // 确保在客户端加载后读取数据
  useEffect(() => {
    setMounted(true);
    const stats = progressManager.getWrongWordsStats();
    setWrongWordsStats(stats);
  }, []);

  const handleModuleClick = (moduleId: string) => {
    const module = modules.find(m => m.id === moduleId);
    if (module) {
      router.push(module.path);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-purple-50 to-pink-50">

      {/* 主内容区 */}
      <main className="container mx-auto px-4 py-8">
        {/* 欢迎区 */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            🎮 选择学习模块
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            十大学习模块，覆盖词汇、语法、文化等多个方面。点击下方卡片开始你的学习之旅！
          </p>
        </div>

        {/* 统计信息 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 max-w-4xl mx-auto">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-300">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center gap-3">
                <BookOpen className="h-8 w-8 text-blue-600" />
                <div>
                  <div className="text-2xl font-bold text-blue-700">10</div>
                  <div className="text-sm text-gray-600">学习模块</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-300">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center gap-3">
                <Swords className="h-8 w-8 text-purple-600" />
                <div>
                  <div className="text-2xl font-bold text-purple-700">多关卡</div>
                  <div className="text-sm text-gray-600">挑战升级</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-300">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center gap-3">
                <Trophy className="h-8 w-8 text-green-600" />
                <div>
                  <div className="text-2xl font-bold text-green-700">智能</div>
                  <div className="text-sm text-gray-600">错词复习</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 模块列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 max-w-7xl mx-auto">
          {modules.map((module) => {
            const moduleProgress = mounted ? progressManager.getModuleProgress(module.id as any) : null;
            const completedCount = moduleProgress?.completedLevels?.length || 0;
            
            // 获取该模块的错词统计
            const wrongWords = mounted ? progressManager.getWrongWords(module.id as any) : [];
            const wrongWordsCount = wrongWords.length;
            const masteredCount = wrongWords.filter(w => w.mastered).length;
            const pendingCount = wrongWordsCount - masteredCount;

            return (
              <Card
                key={module.id}
                className="overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-blue-500"
                onClick={() => handleModuleClick(module.id)}
              >
                <div className={`h-2 bg-gradient-to-r ${module.color}`} />
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2 flex items-center gap-2">
                        <span className="text-3xl">{module.icon}</span>
                        {module.name}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {module.description}
                      </CardDescription>
                    </div>
                    {completedCount > 0 && (
                      <Badge className="bg-green-500 hover:bg-green-600">
                        {completedCount} 通关
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {/* 模块统计 */}
                  {mounted && (
                    <div className="grid grid-cols-3 gap-2 mb-4 text-center text-sm">
                      <div>
                        <div className="font-bold text-orange-600">{wrongWordsCount}</div>
                        <div className="text-gray-600">总错词</div>
                      </div>
                      <div>
                        <div className="font-bold text-red-600">{pendingCount}</div>
                        <div className="text-gray-600">待复习</div>
                      </div>
                      <div>
                        <div className="font-bold text-green-600">{masteredCount}</div>
                        <div className="text-gray-600">已掌握</div>
                      </div>
                    </div>
                  )}
                  <Button
                    variant="ghost"
                    className="w-full group"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleModuleClick(module.id);
                    }}
                  >
                    开始学习
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* 错词库统计 */}
        {mounted && (
          <div className="max-w-4xl mx-auto mt-12">
            <WrongWordsStats stats={wrongWordsStats} />
          </div>
        )}
      </main>
    </div>
  );
}

// 错词库统计组件
function WrongWordsStats({ stats }: { stats: { total: number; pending: number; mastered: number } }) {
  const router = useRouter();

  return (
    <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl">
            📚 错词库统计
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/wrong-words')}
            className="border-yellow-400 text-yellow-700 hover:bg-yellow-100"
          >
            查看详情
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-3xl font-bold text-orange-600">{stats.total}</div>
            <div className="text-sm text-gray-600">总错词</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-red-600">{stats.pending}</div>
            <div className="text-sm text-gray-600">待复习</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-600">{stats.mastered}</div>
            <div className="text-sm text-gray-600">已掌握</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
