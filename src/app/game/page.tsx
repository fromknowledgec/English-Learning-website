'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle, XCircle, ArrowRight, Trophy, BookOpen, Target } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { progressManager } from '@/lib/progress-manager';

interface Knowledge {
  worldId: number;
  levelId: number;
  knowledge: string[];
}

interface Question {
  question: string;
  blankIndex?: number;
  options: string[];
  correctAnswer: string | number;
  explanation: string;
}

interface Level {
  id: number;
  name: string;
  description: string;
  knowledge: string[];
  learningQuestions: Question[];
  practiceQuestions: Question[];
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

type GamePhase = 'start' | 'learning' | 'practice' | 'result';

function GamePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const worldId = Number(searchParams.get('worldId'));
  const levelId = Number(searchParams.get('levelId'));

  const [level, setLevel] = useState<Level | null>(null);
  const [phase, setPhase] = useState<GamePhase>('start');
  const [learningIndex, setLearningIndex] = useState(0);
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState<Question[]>([]);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [levelsData, setLevelsData] = useState<LevelsData | null>(null);

  useEffect(() => {
    // 加载关卡数据
    fetch('/levels.json')
      .then(res => res.json())
      .then(data => {
        setLevelsData(data);
        const world = data.worlds.find((w: World) => w.id === worldId);
        if (world) {
          const foundLevel = world.levels.find((l: Level) => l.id === levelId);
          if (foundLevel) {
            setLevel(foundLevel);
          }
        }
      })
      .catch(err => {
        console.error('Failed to load level:', err);
      });

    // 检查是否有保存的会话
    const session = progressManager.getSession();
    const resumePhase = searchParams.get('phase') as GamePhase;

    if (session && session.moduleType === 'inversion' &&
        session.worldId === worldId && session.levelId === levelId) {
      if (resumePhase) {
        setPhase(resumePhase);
        if (session.learningIndex !== undefined) {
          setLearningIndex(session.learningIndex);
        }
        if (session.practiceIndex !== undefined) {
          setPracticeIndex(session.practiceIndex);
        }
        if (session.score !== undefined) {
          setScore(session.score);
        }
        if (session.wrongAnswers) {
          setWrongAnswers(session.wrongAnswers);
        }
      }
    }
  }, [worldId, levelId, searchParams]);

  // 保存游戏会话
  const saveSession = () => {
    progressManager.saveSession({
      moduleType: 'inversion',
      worldId,
      levelId,
      phase,
      learningIndex,
      practiceIndex,
      score,
      wrongAnswers,
      timestamp: Date.now(),
    });
  };

  // 清除游戏会话
  const clearSession = () => {
    progressManager.clearSession();
  };

  const handleBackToLevels = () => {
    router.push('/inversion');
  };

  const startGame = () => {
    setPhase('learning');
    setLearningIndex(0);
    saveSession();
  };

  const handleLearningAnswer = (answer: string) => {
    if (!level) return;

    const question = level.learningQuestions[learningIndex];
    const correct = question.correctAnswer === answer;
    setIsCorrect(correct);
    setShowExplanation(true);
    setUserAnswer(answer);

    if (!correct) {
      setWrongAnswers(prev => [...prev, question]);
      // 记录错词到错词库（使用问题作为 word）
      progressManager.recordError(question.question, 'inversion', {
        userAnswer: answer,
        correctAnswer: String(question.correctAnswer),
        explanation: question.explanation,
      });
    }
  };

  const handleNextLearning = () => {
    if (!level) return;

    setShowExplanation(false);
    setUserAnswer('');

    if (learningIndex < level.learningQuestions.length - 1) {
      setLearningIndex(prev => prev + 1);
    } else {
      setPhase('practice');
      setPracticeIndex(0);
      setScore(0);
      setWrongAnswers([]);
    }
    saveSession();
  };

  const handlePracticeAnswer = (answer: string) => {
    if (!level) return;

    const question = level.practiceQuestions[practiceIndex];
    const correct = question.correctAnswer === answer || question.correctAnswer === level.practiceQuestions[practiceIndex].options.indexOf(answer);
    setIsCorrect(correct);
    setShowExplanation(true);
    setUserAnswer(answer);

    if (correct) {
      setScore(prev => prev + 1);
    } else {
      setWrongAnswers(prev => [...prev, question]);
      // 记录错词到错词库（使用问题作为 word）
      progressManager.recordError(question.question, 'inversion', {
        userAnswer: answer,
        correctAnswer: String(question.correctAnswer),
        explanation: question.explanation,
      });
    }
  };

  const handleNextPractice = () => {
    if (!level) return;

    setShowExplanation(false);
    setUserAnswer('');

    if (practiceIndex < level.practiceQuestions.length - 1) {
      setPracticeIndex(prev => prev + 1);
    } else {
      // 保存完成状态到 progressManager
      const savedProgress = progressManager.getModuleProgress('inversion');
      const currentCompletedLevels = savedProgress?.completedLevels || [];

      if (!currentCompletedLevels.includes(levelId)) {
        progressManager.updateModuleProgress('inversion', {
          completedLevels: [...currentCompletedLevels, levelId],
        });
      }

      // 清除会话
      clearSession();

      setPhase('result');
    }
    saveSession();
  };

  const handleBackToHome = () => {
    router.push('/');
  };

  if (!level) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-purple-50">
        <div className="text-2xl font-semibold text-gray-600">加载中...</div>
      </div>
    );
  }

  if (phase === 'start') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 via-purple-50 to-pink-50">
        <header className="bg-white shadow-lg border-b-4 border-blue-500">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={handleBackToLevels}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>返回关卡</span>
              </Button>
              <div className="flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-blue-600" />
                <span className="text-lg font-bold text-blue-700">英萃英语学习</span>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-12">
          <Card className="max-w-3xl mx-auto shadow-2xl">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center text-blue-700">
                {level.name}
              </CardTitle>
              <p className="text-center text-gray-600 mt-2">{level.description}</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  知识点
                </h3>
                <ul className="space-y-2">
                  {level.knowledge.map((item, index) => (
                    <li key={index} className="text-gray-700 flex items-start gap-2">
                      <span className="text-blue-500 font-bold">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                  <Target className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-700">
                    {level.learningQuestions.length}
                  </div>
                  <div className="text-sm text-gray-600">学习题</div>
                </div>
                <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4">
                  <Trophy className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-purple-700">
                    {level.practiceQuestions.length}
                  </div>
                  <div className="text-sm text-gray-600">练习题</div>
                </div>
              </div>

              <Button
                onClick={startGame}
                className="w-full h-14 text-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              >
                开始学习
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  if (phase === 'learning') {
    const question = level.learningQuestions[learningIndex];
    const progress = ((learningIndex + 1) / level.learningQuestions.length) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50">
        <header className="bg-white shadow-lg border-b-4 border-green-500">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={handleBackToLevels}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>返回</span>
              </Button>
              <Badge variant="secondary" className="text-base px-4 py-1">
                学习阶段 {learningIndex + 1}/{level.learningQuestions.length}
              </Badge>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <Progress value={progress} className="mb-8 h-3" />

            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl">学习题 {learningIndex + 1}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
                  <p className="text-gray-700 text-lg leading-relaxed">{question.question}</p>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {question.options.map((option, index) => (
                    <Button
                      key={index}
                      variant={userAnswer === option ? (isCorrect ? 'default' : 'destructive') : 'outline'}
                      onClick={() => !showExplanation && handleLearningAnswer(option)}
                      className={`h-14 text-left px-6 justify-start text-base ${
                        !showExplanation && 'hover:bg-blue-50 hover:border-blue-300'
                      }`}
                      disabled={showExplanation}
                    >
                      {option}
                    </Button>
                  ))}
                </div>

                {showExplanation && (
                  <div className={`border-2 rounded-lg p-4 ${isCorrect ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
                    <div className="flex items-start gap-3 mb-2">
                      {isCorrect ? (
                        <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className="font-semibold text-gray-800 mb-1">
                          {isCorrect ? '回答正确！' : '回答错误'}
                        </p>
                        <p className="text-gray-700">{question.explanation}</p>
                      </div>
                    </div>
                  </div>
                )}

                {showExplanation && (
                  <Button
                    onClick={handleNextLearning}
                    className="w-full h-12 bg-gradient-to-r from-green-500 to-blue-500"
                  >
                    {learningIndex < level.learningQuestions.length - 1 ? (
                      <>
                        继续学习 <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    ) : (
                      <>
                        进入练习 <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  if (phase === 'practice') {
    const question = level.practiceQuestions[practiceIndex];
    const progress = ((practiceIndex + 1) / level.practiceQuestions.length) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50">
        <header className="bg-white shadow-lg border-b-4 border-purple-500">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={handleBackToLevels}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>返回</span>
              </Button>
              <div className="flex items-center gap-4">
                <Badge variant="secondary" className="text-base px-4 py-1">
                  练习阶段 {practiceIndex + 1}/{level.practiceQuestions.length}
                </Badge>
                <Badge className="text-base px-4 py-1 bg-gradient-to-r from-purple-500 to-pink-500">
                  得分: {score}
                </Badge>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <Progress value={progress} className="mb-8 h-3" />

            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl">练习题 {practiceIndex + 1}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4">
                  <p className="text-gray-700 text-lg leading-relaxed">{question.question}</p>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {question.options.map((option, index) => (
                    <Button
                      key={index}
                      variant={userAnswer === option ? (isCorrect ? 'default' : 'destructive') : 'outline'}
                      onClick={() => !showExplanation && handlePracticeAnswer(option)}
                      className={`h-14 text-left px-6 justify-start text-base ${
                        !showExplanation && 'hover:bg-purple-50 hover:border-purple-300'
                      }`}
                      disabled={showExplanation}
                    >
                      {option}
                    </Button>
                  ))}
                </div>

                {showExplanation && (
                  <div className={`border-2 rounded-lg p-4 ${isCorrect ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
                    <div className="flex items-start gap-3 mb-2">
                      {isCorrect ? (
                        <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className="font-semibold text-gray-800 mb-1">
                          {isCorrect ? '回答正确！+1分' : '回答错误'}
                        </p>
                        <p className="text-gray-700">{question.explanation}</p>
                      </div>
                    </div>
                  </div>
                )}

                {showExplanation && (
                  <Button
                    onClick={handleNextPractice}
                    className="w-full h-12 bg-gradient-to-r from-purple-500 to-pink-500"
                  >
                    {practiceIndex < level.practiceQuestions.length - 1 ? (
                      <>
                        下一题 <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    ) : (
                      <>
                        查看结果 <Trophy className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  if (phase === 'result') {
    const totalQuestions = level.practiceQuestions.length;
    const percentage = Math.round((score / totalQuestions) * 100);
    const passed = percentage >= 60;

    return (
      <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-orange-50">
        <header className="bg-white shadow-lg border-b-4 border-yellow-500">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={handleBackToLevels}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>返回关卡</span>
              </Button>
              <div className="flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-blue-600" />
                <span className="text-lg font-bold text-blue-700">英萃英语学习</span>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-12">
          <Card className="max-w-3xl mx-auto shadow-2xl">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center">
                {passed ? '🎉 恭喜通关！' : '💪 继续努力！'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className={`border-2 rounded-lg p-8 text-center ${passed ? 'bg-green-50 border-green-300' : 'bg-orange-50 border-orange-300'}`}>
                <Trophy className={`h-24 w-24 mx-auto mb-4 ${passed ? 'text-yellow-500' : 'text-orange-500'}`} />
                <div className="text-6xl font-bold mb-2">
                  {score}/{totalQuestions}
                </div>
                <div className={`text-2xl font-semibold ${passed ? 'text-green-600' : 'text-orange-600'}`}>
                  正确率: {percentage}%
                </div>
              </div>

              {wrongAnswers.length > 0 && (
                <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-red-800 mb-4 flex items-center gap-2">
                    <XCircle className="h-5 w-5" />
                    错题回顾 ({wrongAnswers.length})
                  </h3>
                  <div className="space-y-3">
                    {wrongAnswers.map((q, index) => (
                      <div key={index} className="bg-white border border-red-200 rounded p-3">
                        <p className="text-sm text-gray-700 mb-2">{q.question}</p>
                        <p className="text-sm text-gray-600">{q.explanation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <Button
                  onClick={() => router.push(`/inversion`)}
                  className="flex-1 h-14"
                  variant="outline"
                >
                  返回关卡选择
                </Button>
                {passed && (
                  <Button
                    onClick={handleBackToHome}
                    className="flex-1 h-14 bg-gradient-to-r from-yellow-500 to-orange-500"
                  >
                    返回首页
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return null;
}

export default function GamePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-purple-50">
        <div className="text-2xl font-semibold text-gray-600">加载中...</div>
      </div>
    }>
      <GamePageContent />
    </Suspense>
  );
}
