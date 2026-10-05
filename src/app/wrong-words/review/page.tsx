'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, Trophy, BookOpen } from 'lucide-react';
import { progressManager } from '@/lib/progress-manager';
import type { WrongWord, ModuleType } from '@/types/progress';

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
  culture: '外国文化常识',
  inversion: '倒装句',
  nounClause: '名词性从句',
  polysemy: '一词多义',
};

function WrongWordsReviewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const moduleFilter = searchParams.get('module') as ModuleType | null;

  const [pendingWords, setPendingWords] = useState<WrongWord[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [multiAnswers, setMultiAnswers] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState<string | string[] | undefined>();
  const [completedCount, setCompletedCount] = useState(0);
  const [correctInSession, setCorrectInSession] = useState(0);

  useEffect(() => {
    loadPendingWords();
  }, [moduleFilter]);

  const loadPendingWords = () => {
    const words = progressManager.getPendingWrongWords(moduleFilter || undefined);
    setPendingWords(words);
    setCurrentIndex(0);
    setUserAnswer('');
    setMultiAnswers([]);
    setShowResult(false);
    setCompletedCount(0);
    setCorrectInSession(0);
  };

  const currentWord = pendingWords[currentIndex];
  const totalWords = pendingWords.length;

  const getBlankCount = (question: string): number => {
    if (!question) return 1;
    return question.split('__________').length - 1 || 1;
  };

  const handleSubmit = useCallback(() => {
    if (!currentWord) return;

    const blankCount = getBlankCount(currentWord.word);
    let answerToSubmit: string | string[];

    if (blankCount > 1) {
      answerToSubmit = multiAnswers;
    } else {
      answerToSubmit = userAnswer;
    }

    const result = progressManager.reviewWrongWord(
      currentWord.word,
      currentWord.moduleType,
      answerToSubmit
    );

    setIsCorrect(result.isCorrect);
    setCorrectAnswer(result.correctAnswer);
    setShowResult(true);

    if (result.isCorrect) {
      setCorrectInSession(prev => prev + 1);
    }
    setCompletedCount(prev => prev + 1);
  }, [currentWord, userAnswer, multiAnswers]);

  const handleNext = () => {
    if (currentIndex < totalWords - 1) {
      setCurrentIndex(prev => prev + 1);
      setUserAnswer('');
      setMultiAnswers([]);
      setShowResult(false);
    } else {
      loadPendingWords();
    }
  };

  const handleBack = () => {
    router.push('/wrong-words');
  };

  if (totalWords === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50">
        <header className="bg-white shadow-lg border-b border-gray-200">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <Button variant="ghost" onClick={handleBack} className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                <span>返回错词库</span>
              </Button>
              <h1 className="text-2xl font-bold text-gray-800">错题复习</h1>
              <div className="w-32" />
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <Card className="text-center py-12">
            <CardContent>
              <Trophy className="h-20 w-20 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">太棒了！</h2>
              <p className="text-gray-600 mb-6">暂无待复习的错题，继续保持！</p>
              <Button onClick={handleBack}>返回错词库</Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  const blankCount = getBlankCount(currentWord?.word || '');
  const questionType = currentWord?.questionType || currentWord?.metadata?.questionType;
  const options = currentWord?.options || currentWord?.metadata?.options;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      <header className="bg-white shadow-lg border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={handleBack} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span>返回错词库</span>
            </Button>
            <h1 className="text-2xl font-bold text-gray-800">错题复习</h1>
            <div className="text-sm text-gray-600">
              {currentIndex + 1} / {totalWords}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">复习进度</span>
            <span className="text-sm font-medium text-blue-600">
              {completedCount} / {totalWords} 已完成
            </span>
          </div>
          <Progress value={(completedCount / totalWords) * 100} className="h-2" />
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-4 pb-4 text-center">
              <div className="text-2xl font-bold text-blue-700">{totalWords}</div>
              <div className="text-xs text-gray-600">待复习</div>
            </CardContent>
          </Card>
          <Card className="bg-green-50 border-green-200">
            <CardContent className="pt-4 pb-4 text-center">
              <div className="text-2xl font-bold text-green-700">{correctInSession}</div>
              <div className="text-xs text-gray-600">本次答对</div>
            </CardContent>
          </Card>
          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="pt-4 pb-4 text-center">
              <div className="text-2xl font-bold text-purple-700">{currentWord?.correctCount || 0}/3</div>
              <div className="text-xs text-gray-600">掌握进度</div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="bg-blue-100 text-blue-700">
                {MODULE_NAMES[currentWord?.moduleType] || currentWord?.moduleType}
              </Badge>
              {currentWord?.mastered && (
                <Badge className="bg-green-100 text-green-700">已掌握</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 whitespace-pre-line leading-relaxed">
                {currentWord?.word}
              </h2>
            </div>

            {!showResult ? (
              <>
                {options && options.length > 0 ? (
                  <div className="space-y-3">
                    {options.map((option, idx) => {
                      const letter = String.fromCharCode(65 + idx);
                      const isSelected = userAnswer === option;
                      return (
                        <div
                          key={idx}
                          className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${isSelected
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            }`}
                          onClick={() => setUserAnswer(option)}
                        >
                          <span className="font-medium mr-2">{letter}.</span>
                          {option}
                        </div>
                      );
                    })}
                  </div>
                ) : blankCount > 1 ? (
                  <div className="space-y-3">
                    {Array.from({ length: blankCount }).map((_, idx) => (
                      <div key={idx}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          空格 {idx + 1}
                        </label>
                        <input
                          type="text"
                          value={multiAnswers[idx] || ''}
                          onChange={(e) => {
                            const newAnswers = [...multiAnswers];
                            newAnswers[idx] = e.target.value;
                            setMultiAnswers(newAnswers);
                          }}
                          placeholder={`请输入第${idx + 1}个答案`}
                          className="w-full p-4 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <input
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="请输入答案"
                    className="w-full p-4 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}

                <div className="mt-6 flex justify-end">
                  <Button
                    onClick={handleSubmit}
                    disabled={options && options.length > 0 ? !userAnswer : blankCount > 1 ? multiAnswers.filter(a => a).length < blankCount : !userAnswer}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    提交答案
                  </Button>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className={`p-4 rounded-lg ${isCorrect ? 'bg-green-50 border-2 border-green-200' : 'bg-red-50 border-2 border-red-200'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    {isCorrect ? (
                      <>
                        <CheckCircle className="h-6 w-6 text-green-600" />
                        <span className="text-lg font-semibold text-green-700">回答正确！</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-6 w-6 text-red-600" />
                        <span className="text-lg font-semibold text-red-700">回答错误</span>
                      </>
                    )}
                  </div>

                  {!isCorrect && correctAnswer && (
                    <div className="mt-2">
                      <span className="text-gray-600">正确答案：</span>
                      <span className="font-medium text-gray-800 ml-1">
                        {Array.isArray(correctAnswer) ? correctAnswer.join(', ') : correctAnswer}
                      </span>
                    </div>
                  )}

                  {currentWord?.metadata?.explanation && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <span className="text-gray-600">解析：</span>
                      <span className="text-gray-800 ml-1">{currentWord.metadata.explanation}</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center pt-4">
                  <div className="text-sm text-gray-600">
                    掌握进度：{currentWord?.correctCount || 0} / 3 次答对
                  </div>
                  <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700">
                    {currentIndex < totalWords - 1 ? '下一题' : '完成复习'}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <Button variant="outline" onClick={loadPendingWords} className="flex items-center gap-2">
            <RotateCcw className="h-4 w-4" />
            重新开始
          </Button>
        </div>
      </main>
    </div>
  );
}

export default function WrongWordsReviewPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    }>
      <WrongWordsReviewContent />
    </Suspense>
  );
}
