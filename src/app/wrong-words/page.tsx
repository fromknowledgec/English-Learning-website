'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, BookOpen, Trash2, TrendingDown, CheckCircle2, AlertCircle, Filter, Play } from 'lucide-react';
import { progressManager } from '@/lib/progress-manager';
import type { WrongWord } from '@/types/progress';

const MODULE_NAMES: Record<string, string> = {
  sSpelling: '-s的读音及拼写',
  edSpelling: '-ed读音及拼写',
  ingSpelling: '-ing拼写',
  britishAmericanDiff: '英式英语与美式英语的区别',
  sentenceAnalysis: '句子成分分析',
  irregularVerbs: '不规则动词变化考查',
  chunks: '词块考查',
  tenseVoice: '时态语态考查',
  attributiveClause: '定语从句过关',
  britishAmericanCulture: '英美文化常识',
};

const MODULE_COLORS: Record<string, string> = {
  sSpelling: 'from-blue-500 to-blue-600',
  edSpelling: 'from-cyan-500 to-cyan-600',
  ingSpelling: 'from-teal-500 to-teal-600',
  britishAmericanDiff: 'from-purple-500 to-purple-600',
  sentenceAnalysis: 'from-pink-500 to-pink-600',
  irregularVerbs: 'from-red-500 to-red-600',
  chunks: 'from-orange-500 to-orange-600',
  tenseVoice: 'from-yellow-500 to-yellow-600',
  attributiveClause: 'from-indigo-500 to-indigo-600',
  britishAmericanCulture: 'from-fuchsia-500 to-fuchsia-600',
};

export default function WrongWordsPage() {
  const router = useRouter();
  const [wrongWords, setWrongWords] = useState<WrongWord[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'mastered'>('all');
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadWrongWords();
  }, []);

  const loadWrongWords = () => {
    const allWrongWords = progressManager.getAllWrongWords();
    setWrongWords(allWrongWords);
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  const handleDelete = (word: WrongWord) => {
    if (confirm(`确定要删除这个错词"${word.word}"吗？`)) {
      progressManager.removeWrongWord(word.word, word.moduleType);
      loadWrongWords();
    }
  };

  const filteredWords = wrongWords.filter(w => {
    if (filter === 'pending' && w.mastered) return false;
    if (filter === 'mastered' && !w.mastered) return false;
    if (selectedModule && w.moduleType !== selectedModule) return false;
    return true;
  });

  const groupedWords = filteredWords.reduce((acc, word) => {
    const moduleType = word.moduleType;
    if (!acc[moduleType]) {
      acc[moduleType] = [];
    }
    acc[moduleType].push(word);
    return acc;
  }, {} as Record<string, WrongWord[]>);

  const stats = progressManager.getWrongWordsStats();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => router.push('/')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>返回首页</span>
            </Button>
            <h1 className="text-2xl font-bold text-gray-800">错词库</h1>
            <div className="w-32" />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-300">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-red-700">{stats.total}</div>
                  <div className="text-sm text-gray-600 mt-1">总错词</div>
                </div>
                <AlertCircle className="h-12 w-12 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-300">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-yellow-700">{stats.pending}</div>
                  <div className="text-sm text-gray-600 mt-1">待复习</div>
                </div>
                <TrendingDown className="h-12 w-12 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-300">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-green-700">{stats.mastered}</div>
                  <div className="text-sm text-gray-600 mt-1">已掌握</div>
                </div>
                <CheckCircle2 className="h-12 w-12 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 复习入口 */}
        {stats.pending > 0 && (
          <Card className="mb-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold mb-1">开始复习错题</h2>
                  <p className="text-white/80 text-sm">答对3次即可从错词库移除</p>
                </div>
                <Button
                  onClick={() => router.push('/wrong-words/review')}
                  className="bg-white text-blue-600 hover:bg-blue-50"
                  size="lg"
                >
                  <Play className="h-4 w-4 mr-2" />
                  开始复习
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 筛选器 */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">筛选：</span>
              </div>

              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('all')}
              >
                全部 ({stats.total})
              </Button>
              <Button
                variant={filter === 'pending' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('pending')}
              >
                待复习 ({stats.pending})
              </Button>
              <Button
                variant={filter === 'mastered' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('mastered')}
              >
                已掌握 ({stats.mastered})
              </Button>

              <div className="w-px h-8 bg-gray-300 mx-2" />

              {Object.entries(MODULE_NAMES).map(([key, name]) => (
                <Badge
                  key={key}
                  variant={selectedModule === key ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => setSelectedModule(selectedModule === key ? null : key)}
                >
                  {name}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 错词列表 */}
        {Object.entries(groupedWords).length === 0 ? (
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">暂无错词记录</p>
              <p className="text-gray-400 text-sm mt-2">继续学习，错词会自动记录到这里</p>
            </CardContent>
          </Card>
        ) : (
          Object.entries(groupedWords).map(([moduleType, words]) => (
            <Card key={moduleType} className="mb-6">
              <CardHeader className={`bg-gradient-to-r ${MODULE_COLORS[moduleType]} text-white`}>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">{MODULE_NAMES[moduleType]}</CardTitle>
                    <CardDescription className="text-white/80">
                      {words.length} 个错词
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                      {words.filter(w => !w.mastered).length} 待复习
                    </Badge>
                    {words.filter(w => !w.mastered).length > 0 && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => router.push(`/wrong-words/review?module=${moduleType}`)}
                        className="bg-white/90 text-gray-800 hover:bg-white"
                      >
                        <Play className="h-3 w-3 mr-1" />
                        复习
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {words.map((word, index) => (
                    <div
                      key={`${moduleType}-${word.word}-${index}`}
                      className={`p-4 rounded-lg border-2 transition-all ${word.mastered
                        ? 'bg-green-50 border-green-200'
                        : 'bg-yellow-50 border-yellow-200'
                        }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold text-gray-800">
                              {word.word}
                            </h3>
                            {word.mastered ? (
                              <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                                已掌握
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-300">
                                待复习
                              </Badge>
                            )}
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">错误次数：</span>
                              <span className="font-semibold text-gray-700 ml-1">{word.errorCount}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">正确次数：</span>
                              <span className="font-semibold text-gray-700 ml-1">{word.correctCount}</span>
                            </div>
                          </div>

                          {word.metadata && (
                            <div className="mt-3 p-3 bg-white rounded-lg border border-gray-200">
                              <div className="text-xs text-gray-500 mb-1">附加信息</div>
                              {word.metadata.userAnswer && (
                                <div className="text-sm mb-1">
                                  <span className="text-gray-600">用户答案：</span>
                                  <span className="text-gray-800 ml-1">{word.metadata.userAnswer}</span>
                                </div>
                              )}
                              {word.metadata.correctAnswer && (
                                <div className="text-sm mb-1">
                                  <span className="text-gray-600">正确答案：</span>
                                  <span className="text-gray-800 ml-1">{word.metadata.correctAnswer}</span>
                                </div>
                              )}
                              {word.metadata.translation && word.metadata.translation.length > 0 && (
                                <div className="text-sm">
                                  <span className="text-gray-600">翻译：</span>
                                  <span className="text-gray-800 ml-1">
                                    {word.metadata.translation.join(', ')}
                                  </span>
                                </div>
                              )}
                              {word.metadata.explanation && (
                                <div className="text-sm mt-2">
                                  <span className="text-gray-600">解释：</span>
                                  <span className="text-gray-800 ml-1">{word.metadata.explanation}</span>
                                </div>
                              )}
                            </div>
                          )}

                          {/* 掌握进度 */}
                          {!word.mastered && (
                            <div className="mt-3">
                              <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                                <span>掌握进度</span>
                                <span>{word.correctCount}/3</span>
                              </div>
                              <Progress value={(word.correctCount / 3) * 100} className="h-2" />
                            </div>
                          )}
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(word)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </main>
    </div>
  );
}
