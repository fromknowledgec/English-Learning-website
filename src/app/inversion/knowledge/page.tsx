'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen, Lightbulb, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

interface KnowledgeBase {
  完全倒装: {
    定义: string;
    常见结构: string[];
    注意事项: string[];
  };
  部分倒装: {
    定义: string;
    常见结构: string[];
    注意事项: string[];
  };
}

interface LevelsData {
  knowledgeBase: KnowledgeBase;
}

export default function KnowledgePage() {
  const [knowledgeData, setKnowledgeData] = useState<LevelsData | null>(null);

  useEffect(() => {
    fetch('/levels.json')
      .then(res => res.json())
      .then(data => {
        setKnowledgeData(data);
      })
      .catch(err => {
        console.error('Failed to load knowledge:', err);
      });
  }, []);

  if (!knowledgeData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-purple-50">
        <div className="text-2xl font-semibold text-gray-600">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-4 border-blue-500">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" className="flex items-center gap-2">
                <ArrowLeft className="h-5 w-5" />
                返回主菜单
              </Button>
            </Link>
            <div className="text-center flex-1">
              <h1 className="text-3xl font-bold text-blue-700">
                倒装句式知识速查
              </h1>
            </div>
            <div className="w-32" />
          </div>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* 欢迎信息 */}
        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-300">
          <CardHeader>
            <div className="flex items-center gap-3">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <CardTitle className="text-2xl font-bold text-blue-700">
                知识点速查表
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-gray-700">
              这里汇总了倒装句式的核心知识点，随时查阅，帮助你快速回顾和巩固语法知识。
            </p>
          </CardContent>
        </Card>

        {/* 完全倒装 */}
        <Card className="mb-8 bg-white shadow-xl border-2 border-green-300">
          <CardHeader>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
              <CardTitle className="text-2xl font-bold text-green-700">
                完全倒装
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 定义 */}
            <div className="bg-green-50 p-6 rounded-xl border-2 border-green-200">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="h-5 w-5 text-green-600" />
                <h3 className="text-xl font-bold text-green-700">定义</h3>
              </div>
              <p className="text-lg text-gray-800">{knowledgeData.knowledgeBase.完全倒装.定义}</p>
            </div>

            {/* 常见结构 */}
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-2xl">📋</span>
                常见结构
              </h3>
              <div className="space-y-3">
                {knowledgeData.knowledgeBase.完全倒装.常见结构.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-green-500 text-white rounded-full font-bold">
                      {index + 1}
                    </span>
                    <span className="text-gray-700 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 注意事项 */}
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-2xl">⚠️</span>
                注意事项
              </h3>
              <div className="space-y-3">
                {knowledgeData.knowledgeBase.完全倒装.注意事项.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400"
                  >
                    <span className="text-yellow-600 font-bold">•</span>
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 部分倒装 */}
        <Card className="mb-8 bg-white shadow-xl border-2 border-purple-300">
          <CardHeader>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-8 w-8 text-purple-600" />
              <CardTitle className="text-2xl font-bold text-purple-700">
                部分倒装
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 定义 */}
            <div className="bg-purple-50 p-6 rounded-xl border-2 border-purple-200">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="h-5 w-5 text-purple-600" />
                <h3 className="text-xl font-bold text-purple-700">定义</h3>
              </div>
              <p className="text-lg text-gray-800">{knowledgeData.knowledgeBase.部分倒装.定义}</p>
            </div>

            {/* 常见结构 */}
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-2xl">📋</span>
                常见结构
              </h3>
              <div className="space-y-3">
                {knowledgeData.knowledgeBase.部分倒装.常见结构.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-purple-500 text-white rounded-full font-bold">
                      {index + 1}
                    </span>
                    <span className="text-gray-700 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 注意事项 */}
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-2xl">⚠️</span>
                注意事项
              </h3>
              <div className="space-y-3">
                {knowledgeData.knowledgeBase.部分倒装.注意事项.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400"
                  >
                    <span className="text-yellow-600 font-bold">•</span>
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 提示卡片 */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-300">
          <CardContent className="p-6 text-center">
            <p className="text-lg text-gray-700">
              💡 <span className="font-semibold">学习建议：</span>
              先学习完全倒装，再掌握部分倒装，通过游戏中的练习巩固知识点！
            </p>
          </CardContent>
        </Card>
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
