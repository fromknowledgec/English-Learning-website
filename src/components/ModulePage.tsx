'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, BookOpen, CheckCircle, XCircle, User, Swords, Trophy } from 'lucide-react';
import { progressManager } from '@/lib/progress-manager';
import { WrongWord, ModuleType, ExerciseProgress } from '@/types/progress';
import { ProgressRestoreDialog } from '@/components/ui/progress-restore-dialog';
import Image from 'next/image';

interface KnowledgePoint {
  id: number;
  title: string;
  content: string;
  subPoints?: Array<{
    id: number;
    title: string;
    content: string;
  }>;
}

interface Exercise {
  id: number;
  question: string;
  type: 'fill' | 'choice' | 'analysis';
  options?: string[];
  correctAnswer: string;
  explanation?: string;
}

interface ModuleData {
  moduleName: string;
  knowledgePoints: KnowledgePoint[];
  exercises: Exercise[];
}

interface ModulePageProps {
  moduleType: string;
  moduleTitle: string;
  dataFile: string;
}

export default function ModulePage({ moduleType, moduleTitle, dataFile }: ModulePageProps) {
  const router = useRouter();
  const [view, setView] = useState<'home' | 'learn' | 'practice'>('home');
  const [moduleData, setModuleData] = useState<ModuleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Map<number, string[]>>(new Map());
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const [showRestoreDialog, setShowRestoreDialog] = useState(false);
  const [savedProgress, setSavedProgress] = useState<ExerciseProgress | null>(null);
  const [isProgressRestored, setIsProgressRestored] = useState(false);

  const exerciseId = `exercise_${moduleType}_${dataFile}`;

  useEffect(() => {
    fetch(`/data/${dataFile}`)
      .then(res => res.json())
      .then(data => {
        setModuleData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load module data:', err);
        setLoading(false);
      });
  }, [dataFile]);

  const handleStartLearning = () => {
    setView('learn');
  };

  const handleStartPractice = () => {
    const existingProgress = progressManager.getExerciseProgress(exerciseId);
    if (existingProgress && existingProgress.status === 'in_progress') {
      setSavedProgress(existingProgress);
      setShowRestoreDialog(true);
    } else {
      startNewPractice();
    }
  };

  const startNewPractice = useCallback(() => {
    if (moduleData?.exercises) {
      progressManager.createExerciseProgress(
        exerciseId,
        moduleData.moduleName || moduleTitle,
        moduleType as ModuleType,
        moduleData.exercises.length
      );
    }
    setView('practice');
    setCurrentExerciseIndex(0);
    setUserAnswers(new Map());
    setShowResults(false);
    setScore(0);
    setIsProgressRestored(false);
  }, [exerciseId, moduleData, moduleType, moduleTitle]);

  const restoreProgress = useCallback(() => {
    if (savedProgress) {
      const restoredAnswers = new Map<number, string[]>();
      Object.entries(savedProgress.answers).forEach(([key, value]) => {
        restoredAnswers.set(Number(key), value);
      });
      setUserAnswers(restoredAnswers);
      setCurrentExerciseIndex(savedProgress.currentQuestionIndex);
      setIsProgressRestored(true);
      setView('practice');
      setShowResults(false);
      setScore(0);
    }
  }, [savedProgress]);

  const handleContinueFromDialog = () => {
    setShowRestoreDialog(false);
    restoreProgress();
  };

  const handleResetFromDialog = () => {
    setShowRestoreDialog(false);
    progressManager.clearExerciseProgress(exerciseId);
    setSavedProgress(null);
    startNewPractice();
  };

  const getBlankCount = (question: string): number => {
    return question.split('__________').length - 1;
  };

  const getCorrectAnswers = (correctAnswer: string): string[] => {
    return correctAnswer.split(',').map(a => a.trim());
  };

  const saveCurrentProgress = useCallback(() => {
    if (view !== 'practice' || showResults) return;

    const answersObj: Record<number, string[]> = {};
    userAnswers.forEach((value, key) => {
      answersObj[key] = value;
    });

    const progress = progressManager.getExerciseProgress(exerciseId);
    if (progress) {
      progress.answers = answersObj;
      progress.currentQuestionIndex = currentExerciseIndex;
      progress.answeredCount = userAnswers.size;
      progressManager.saveExerciseProgress(progress);
    }
  }, [view, showResults, userAnswers, currentExerciseIndex, exerciseId]);

  const handleAnswerSubmit = (exerciseIdParam: number, answer: string | string[], blankIndex?: number) => {
    const newAnswers = new Map(userAnswers);

    if (typeof answer === 'string') {
      if (blankIndex !== undefined) {
        const existingAnswers = newAnswers.get(exerciseIdParam) || [];
        newAnswers.set(exerciseIdParam, existingAnswers);
        existingAnswers[blankIndex] = answer;
      } else {
        newAnswers.set(exerciseIdParam, [answer]);
      }
    }

    setUserAnswers(newAnswers);

    const answersObj: Record<number, string[]> = {};
    newAnswers.forEach((value, key) => {
      answersObj[key] = value;
    });

    progressManager.updateExerciseAnswer(
      exerciseId,
      exerciseIdParam,
      newAnswers.get(exerciseIdParam) || [],
      currentExerciseIndex,
      moduleData?.exercises.length || 0
    );

    const exercise = moduleData?.exercises.find(e => e.id === exerciseIdParam);
    if (exercise) {
      const correctAnswers = getCorrectAnswers(exercise.correctAnswer);
      const userAnswerArray = newAnswers.get(exerciseIdParam) || [];
      const isCorrect = userAnswerArray.length === correctAnswers.length &&
        userAnswerArray.every((ans, idx) => ans.trim().toLowerCase() === correctAnswers[idx].trim().toLowerCase());

      if (isCorrect) {
        progressManager.recordCorrect(exercise.question, moduleType as any);
        progressManager.recordCorrectQuestion(exerciseIdParam, moduleType as any);
      } else {
        const metadata: WrongWord['metadata'] = {
          translation: correctAnswers,
          explanation: exercise.explanation,
          correctAnswer: exercise.correctAnswer,
          userAnswer: userAnswerArray
        };
        progressManager.recordError(exercise.question, moduleType as any, metadata);
      }
    }
  };

  const handleFinishPractice = () => {
    let correctCount = 0;
    moduleData?.exercises.forEach(exercise => {
      const userAnswerArray = userAnswers.get(exercise.id) || [];
      const correctAnswers = getCorrectAnswers(exercise.correctAnswer);

      const isCorrect = userAnswerArray.length === correctAnswers.length &&
        userAnswerArray.every((ans, idx) => ans.trim().toLowerCase() === correctAnswers[idx].trim().toLowerCase());

      if (isCorrect) {
        correctCount++;
        progressManager.recordCorrectQuestion(exercise.id, moduleType as any);
      }
    });
    setScore(correctCount);
    setShowResults(true);

    progressManager.completeExerciseProgress(exerciseId);

    progressManager.updateModuleProgress(moduleType as any, {
      currentLevel: 1,
      completedLevels: [1],
      answeredQuestions: Array.from(userAnswers.keys()),
    });
  };

  const handleBack = () => {
    saveCurrentProgress();
    router.push('/');
  };

  const handleBackToHome = () => {
    saveCurrentProgress();
    setView('home');
  };

  useEffect(() => {
    const handleBeforeUnload = () => {
      saveCurrentProgress();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [saveCurrentProgress]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  if (view === 'home') {
    const progressStats = progressManager.getExerciseProgressStats(exerciseId);

    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 via-purple-50 to-pink-50">
        <div className="container mx-auto px-4 py-8">
          <Button onClick={handleBack} variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回首页
          </Button>

          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-3xl text-blue-700">{moduleData?.moduleName || moduleTitle}</CardTitle>
              <CardDescription>选择学习模式开始学习</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {progressStats && progressStats.status === 'in_progress' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-800 font-medium">📌 有未完成的练习进度</p>
                      <p className="text-sm text-blue-600 mt-1">
                        已完成 {progressStats.answeredCount} / {progressStats.totalQuestions} 题
                      </p>
                      {progressStats.lastUpdated && (
                        <p className="text-xs text-gray-500 mt-1">
                          上次答题：{progressStats.lastUpdated.toLocaleString('zh-CN')}
                        </p>
                      )}
                    </div>
                    <Button
                      onClick={handleStartPractice}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      继续答题
                    </Button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-2 border-blue-200 hover:border-blue-500 transition-colors cursor-pointer" onClick={handleStartLearning}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <BookOpen className="h-8 w-8 text-blue-600" />
                      <CardTitle className="text-xl">知识点学习</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">学习模块的核心知识点，掌握理论基础</p>
                  </CardContent>
                </Card>

                <Card className="border-2 border-purple-200 hover:border-purple-500 transition-colors cursor-pointer" onClick={handleStartPractice}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-8 w-8 text-purple-600" />
                      <CardTitle className="text-xl">练习题</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">完成练习题，检验学习成果</p>
                  </CardContent>
                </Card>
              </div>

            </CardContent>
          </Card>
        </div>

        <ProgressRestoreDialog
          open={showRestoreDialog}
          onOpenChange={setShowRestoreDialog}
          progress={savedProgress}
          onContinue={handleContinueFromDialog}
          onReset={handleResetFromDialog}
        />
      </div>
    );
  }

  if (view === 'learn') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 via-purple-50 to-pink-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <Button onClick={() => setView('home')} variant="ghost">
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回
            </Button>
            <h1 className="text-2xl font-bold text-blue-700">{moduleData?.moduleName}</h1>
            <div className="w-24" />
          </div>

          <div className="space-y-6 max-w-4xl mx-auto">
            {moduleData?.knowledgePoints.map((kp) => (
              <Card key={kp.id}>
                <CardHeader>
                  <CardTitle className="text-xl text-blue-700">{kp.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4 whitespace-pre-line">{kp.content}</p>
                  {kp.subPoints && kp.subPoints.length > 0 && (
                    <div className="space-y-4">
                      {kp.subPoints.map((sub, idx) => (
                        <div key={sub.id} className="border-l-4 border-blue-500 pl-4">
                          <h3 className="font-semibold text-gray-800 mb-2">{idx + 1}. {sub.title}</h3>
                          <p className="text-gray-700 whitespace-pre-line">{sub.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (view === 'practice') {
    const currentExercise = moduleData?.exercises[currentExerciseIndex];
    const totalExercises = moduleData?.exercises.length || 0;

    if (showResults) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 via-purple-50 to-pink-50">
          <div className="container mx-auto px-4 py-8">
            <Button onClick={() => setView('home')} variant="ghost" className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回
            </Button>

            <Card className="max-w-4xl mx-auto">
              <CardHeader>
                <CardTitle className="text-3xl text-center text-blue-700">练习完成！</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-8">
                  <div className="text-6xl font-bold text-blue-600 mb-2">
                    {score} / {totalExercises}
                  </div>
                  <p className="text-gray-600">正确率：{Math.round((score / totalExercises) * 100)}%</p>
                </div>

                <div className="space-y-4">
                  {moduleData?.exercises.map((exercise) => {
                    const userAnswerArray = userAnswers.get(exercise.id) || [];
                    const correctAnswers = getCorrectAnswers(exercise.correctAnswer);

                    const isCorrect = userAnswerArray.length === correctAnswers.length &&
                      userAnswerArray.every((ans, idx) => ans.trim().toLowerCase() === correctAnswers[idx].trim().toLowerCase());

                    return (
                      <div key={exercise.id} className={`p-4 rounded-lg border ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                        <div className="flex items-start gap-3">
                          {isCorrect ? (
                            <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-600 mt-1" />
                          )}
                          <div className="flex-1">
                            <p className="font-medium mb-2">{exercise.question}</p>
                            <p className="text-sm text-gray-600">你的答案：{userAnswerArray.length > 0 ? userAnswerArray.join(', ') : '未作答'}</p>
                            {!isCorrect && (
                              <p className="text-sm text-green-600">正确答案：{exercise.correctAnswer}</p>
                            )}
                            {exercise.explanation && (
                              <p className="text-sm text-gray-500 mt-2">解析：{exercise.explanation}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-8 text-center">
                  <Button onClick={() => setView('home')} size="lg">
                    返回首页
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 via-purple-50 to-pink-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <Button onClick={handleBackToHome} variant="ghost">
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回
            </Button>
            <h1 className="text-2xl font-bold text-blue-700">{moduleData?.moduleName} - 练习</h1>
            <div className="text-sm text-gray-600">
              {currentExerciseIndex + 1} / {totalExercises}
            </div>
          </div>

          <Card className="max-w-4xl mx-auto">
            <CardContent className="pt-6">
              {isProgressRestored && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 text-sm">✓ 已恢复之前的答题进度</p>
                </div>
              )}

              {currentExercise && progressManager.isQuestionCorrect(currentExercise.id, moduleType as any) && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-green-800 font-medium">此题之前已答对</span>
                  </div>
                  <Button
                    onClick={() => setCurrentExerciseIndex(prev => prev + 1)}
                    disabled={currentExerciseIndex === totalExercises - 1}
                    size="sm"
                    variant="outline"
                  >
                    跳过此题
                  </Button>
                </div>
              )}

              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">题目 {currentExerciseIndex + 1}</h2>
                <p className="text-lg text-gray-800 whitespace-pre-line">{currentExercise?.question}</p>
              </div>

              {currentExercise?.type === 'choice' && currentExercise.options && (
                <div className="space-y-3 mb-6">
                  {currentExercise.options.map((option, idx) => {
                    const letter = String.fromCharCode(65 + idx);
                    const isSelected = (userAnswers.get(currentExercise.id) || [])[0] === option;
                    return (
                      <div
                        key={idx}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${isSelected
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                          }`}
                        onClick={() => handleAnswerSubmit(currentExercise.id, option)}
                      >
                        <span className="font-medium mr-2">{letter}.</span>
                        {option}
                      </div>
                    );
                  })}
                </div>
              )}

              {currentExercise?.type === 'fill' && (
                <div className="mb-6">
                  {(() => {
                    const blankCount = getBlankCount(currentExercise.question);
                    const userAnswerArray = userAnswers.get(currentExercise.id) || [];

                    if (blankCount > 1) {
                      return (
                        <div className="space-y-3">
                          {Array.from({ length: blankCount }).map((_, idx) => (
                            <div key={idx}>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                空格 {idx + 1}
                              </label>
                              <input
                                type="text"
                                value={userAnswerArray[idx] || ''}
                                onChange={(e) => handleAnswerSubmit(currentExercise.id, e.target.value, idx)}
                                placeholder={`请输入第${idx + 1}个答案`}
                                className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                          ))}
                        </div>
                      );
                    } else {
                      return (
                        <input
                          type="text"
                          value={userAnswerArray[0] || ''}
                          onChange={(e) => handleAnswerSubmit(currentExercise.id, e.target.value)}
                          placeholder="请输入答案"
                          className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      );
                    }
                  })()}
                </div>
              )}

              {currentExercise?.type === 'analysis' && (
                <div className="mb-6">
                  <textarea
                    value={(userAnswers.get(currentExercise.id) || [])[0] || ''}
                    onChange={(e) => handleAnswerSubmit(currentExercise.id, e.target.value)}
                    placeholder="请输入你的分析..."
                    className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[150px]"
                  />
                </div>
              )}

              <div className="flex justify-between items-center pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setCurrentExerciseIndex(prev => prev - 1)}
                  disabled={currentExerciseIndex === 0}
                >
                  上一题
                </Button>

                {currentExerciseIndex === totalExercises - 1 ? (
                  <Button onClick={handleFinishPractice} className="bg-green-600 hover:bg-green-700">
                    完成练习
                  </Button>
                ) : (
                  <Button
                    onClick={() => setCurrentExerciseIndex(prev => prev + 1)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    下一题
                  </Button>
                )}
              </div>

              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>已答 {userAnswers.size} / {totalExercises} 题</span>
                  <span className="text-green-600">进度已自动保存</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return null;
}
