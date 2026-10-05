'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Swords, ShieldCheck, Trophy, ArrowLeft, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { progressManager } from '@/lib/progress-manager';

interface Level {
  id: number;
  name: string;
  description: string;
}

interface World {
  id: number;
  name: string;
  description: string;
  color: string;
  levels: Level[];
}

interface LevelsData {
  worlds: World[];
}

export default function Home() {
  const router = useRouter();
  const [levelsData, setLevelsData] = useState<LevelsData | null>(null);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  const [savedSession, setSavedSession] = useState<any>(null);

  const handleBackToModules = () => {
    router.push('/');
  };

  useEffect(() => {
    // 加载关卡数据
    fetch('/levels.json')
      .then(res => res.json())
      .then(data => {
        setLevelsData(data);
      })
      .catch(err => {
        console.error('Failed to load levels:', err);
      });

    // 从 progressManager 加载已完成的关卡
    const savedProgress = progressManager.getModuleProgress('inversion');
    if (savedProgress) {
      setCompletedLevels(savedProgress.completedLevels || []);
    }

    // 检查是否有保存的会话
    const session = progressManager.getSession();
    if (session && session.moduleType === 'inversion') {
      setSavedSession(session);
    }
  }, []);

  const handleLevelClick = (worldId: number, levelId: number) => {
    router.push(`/game?worldId=${worldId}&levelId=${levelId}`);
  };

  const handleResumeSession = () => {
    if (savedSession) {
      router.push(`/game?worldId=${savedSession.worldId}&levelId=${savedSession.levelId}&phase=${savedSession.phase}`);
    }
  };

  const handleClearSession = () => {
    progressManager.clearSession();
    setSavedSession(null);
  };

  if (!levelsData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-purple-50">
        <div className="text-2xl font-semibold text-gray-600">加载中...</div>
      </div>
    );
  }

  const colorClasses = {
    blue: 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
    purple: 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
    green: 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
  };

  const borderColorClasses = {
    blue: 'border-blue-300',
    purple: 'border-purple-300',
    green: 'border-green-300',
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-4 border-blue-500">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8">
            {/* 左侧：返回按钮 */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={handleBackToModules}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>返回首页</span>
              </Button>
            </div>

            {/* 标题 */}
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-blue-700">
                倒装句式闯关王
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                掌握英语倒装句式 · 提升语法能力
              </p>
            </div>

            {/* 平台标识 */}
            <div className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-blue-600" />
              <span className="font-bold text-blue-700">英萃英语学习</span>
            </div>
          </div>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="container mx-auto px-4 py-8">
        {/* 欢迎/提示区 */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            🎮 自由探索，任意挑战！
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            所有关卡已开放，点击任意卡片开始你的倒装句式学习之旅。
            每关包含学习和练习两个阶段，击败怪物即可通关！
          </p>
        </div>

        {/* 继续学习提示 */}
        {savedSession && (
          <div className="mb-12 max-w-4xl mx-auto">
            <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <RefreshCw className="h-6 w-6 text-orange-600" />
                    <div>
                      <p className="font-semibold text-gray-800">发现未完成的学习会话</p>
                      <p className="text-sm text-gray-600">您可以继续上次的学习进度</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={handleClearSession}
                      className="border-gray-300"
                    >
                      忽略
                    </Button>
                    <Button
                      onClick={handleResumeSession}
                      className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                    >
                      继续学习
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* 统计信息 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 max-w-4xl mx-auto">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-300">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center gap-3">
                <BookOpen className="h-8 w-8 text-blue-600" />
                <div>
                  <div className="text-2xl font-bold text-blue-700">3</div>
                  <div className="text-sm text-gray-600">知识域</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-300">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center gap-3">
                <Swords className="h-8 w-8 text-purple-600" />
                <div>
                  <div className="text-2xl font-bold text-purple-700">9</div>
                  <div className="text-sm text-gray-600">关卡</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-300">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center gap-3">
                <Trophy className="h-8 w-8 text-green-600" />
                <div>
                  <div className="text-2xl font-bold text-green-700">{completedLevels.length}</div>
                  <div className="text-sm text-gray-600">已通关</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 知识速查按钮 */}
        <div className="text-center mb-12">
          <Link href="/knowledge">
            <Button
              variant="outline"
              size="lg"
              className="h-12 px-8 border-2 border-gray-300 hover:bg-gray-50"
            >
              <BookOpen className="mr-2 h-5 w-5" />
              知识速查
            </Button>
          </Link>
        </div>

        {/* 关卡列表 */}
        <div className="space-y-8 max-w-6xl mx-auto">
          {levelsData.worlds.map((world) => (
            <div key={world.id} className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className={`h-1 flex-1 bg-gradient-to-r ${colorClasses[world.color as keyof typeof colorClasses]}`} />
                <h3 className="text-2xl font-bold text-gray-800 px-4">{world.name}</h3>
                <div className={`h-1 flex-1 bg-gradient-to-r ${colorClasses[world.color as keyof typeof colorClasses]}`} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {world.levels.map((level) => {
                  const isCompleted = completedLevels.includes(level.id);
                  return (
                    <div
                      key={level.id}
                      onClick={() => handleLevelClick(world.id, level.id)}
                    >
                      <Card
                        className={`
                          cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl
                          border-2 ${borderColorClasses[world.color as keyof typeof borderColorClasses]}
                          ${isCompleted ? 'bg-gradient-to-br from-green-50 to-green-100' : 'bg-white'}
                        `}
                      >
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-lg font-semibold text-gray-800 mb-2">
                                {level.name}
                              </CardTitle>
                              <CardDescription className="text-sm text-gray-600">
                                {level.description}
                              </CardDescription>
                            </div>
                            {isCompleted && (
                              <div className="flex-shrink-0">
                                <ShieldCheck className="h-8 w-8 text-green-600" />
                              </div>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <Button
                            className={`w-full bg-gradient-to-r ${colorClasses[world.color as keyof typeof colorClasses]}`}
                          >
                            {isCompleted ? '再次挑战' : '开始挑战'}
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 py-8 bg-white border-t border-gray-200">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p className="text-sm">
            倒装句式闯关王 · 英萃英语学习
          </p>
        </div>
      </footer>
    </div>
  );
}
