'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { levels, questions } from '@/data/questions';
import NounLearningMode from '@/components/NounLearningMode';
import NounPracticeMode from '@/components/NounPracticeMode';
import { progressManager } from '@/lib/progress-manager';
import { LevelGenerator } from '@/lib/level-generator';

type Phase = 'select' | 'learning' | 'practice' | 'victory' | 'defeat';

export default function LevelPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const levelId = parseInt(resolvedParams.id);
  const level = levels.find(l => l.id === levelId);

  const [phase, setPhase] = useState<Phase>('learning');
  const [weaponLevel, setWeaponLevel] = useState(0);
  const [learningWrongAnswers, setLearningWrongAnswers] = useState<Array<{ question: any; userAnswer: string }>>([]);
  const [practiceWrongAnswers, setPracticeWrongAnswers] = useState<Array<{ question: any; userAnswer: string }>>([]);
  const [savedSession, setSavedSession] = useState<any>(null);

  // 检查是否有保存的进度
  useEffect(() => {
    if (level) {
      const session = progressManager.getSession();
      if (session && session.levelId === levelId && session.moduleType === 'nounClause') {
        setSavedSession(session);
        setPhase('select');
      } else {
        // 没有保存的进度，直接开始
        setPhase('learning');
      }
    }
  }, [levelId, level]);

  // 继续上次进度
  const handleContinue = () => {
    if (savedSession) {
      setWeaponLevel(savedSession.weaponLevel || 0);
      setLearningWrongAnswers(savedSession.learningWrongAnswers || []);
      setPhase(savedSession.phase || 'learning');
      setSavedSession(null);
    }
  };

  // 重新开始
  const handleRestart = () => {
    progressManager.clearSession();
    setWeaponLevel(0);
    setLearningWrongAnswers([]);
    setPracticeWrongAnswers([]);
    setPhase('learning');
  };

  // 保存当前会话
  const saveCurrentSession = (currentPhase: Phase) => {
    progressManager.saveSession({
      levelId,
      moduleType: 'nounClause',
      phase: currentPhase,
      weaponLevel,
      learningWrongAnswers,
      practiceWrongAnswers,
      timestamp: Date.now(),
    });
  };

  if (!level) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">关卡不存在</h1>
          <button
            onClick={() => router.push('/noun-clause')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            返回主页
          </button>
        </div>
      </div>
    );
  }

  const levelQuestions = level.questions.map(qid => questions.find(q => q.id === qid)!).filter(q => q);
  
  // 使用 LevelGenerator 生成学习题目（关卡2及以后会包含错词复习）
  const learningQuestions = LevelGenerator.shouldIncludeWrongWords(levelId)
    ? LevelGenerator.generateLearningQuestions(level, questions, 'nounClause')
    : level.learningQuestions.map(qid => questions.find(q => q.id === qid)!).filter(q => q);
  
  // 使用 LevelGenerator 生成练习题目（关卡2及以后会包含错词复习）
  const practiceQuestions = LevelGenerator.shouldIncludeWrongWords(levelId)
    ? LevelGenerator.generatePracticeQuestions(level, questions, 'nounClause')
    : level.practiceQuestions.map(qid => questions.find(q => q.id === qid)!).filter(q => q);

  const handleLearningComplete = (wLevel: number, wrongAnswers: Array<{ question: any; userAnswer: string }>) => {
    setWeaponLevel(wLevel);
    setLearningWrongAnswers(wrongAnswers);
    setPhase('practice');
    saveCurrentSession('practice');

    // 记录错词到数据库
    wrongAnswers.forEach(item => {
      progressManager.recordError(
        item.question.question,
        'nounClause',
        {
          translation: item.question.options,
          correctAnswer: item.question.correctAnswer,
        }
      );
    });
  };

  const handlePracticeComplete = (victory: boolean, wrongAnswers: Array<{ question: any; userAnswer: string }>) => {
    setPracticeWrongAnswers(wrongAnswers);
    setPhase(victory ? 'victory' : 'defeat');

    if (victory) {
      // 记录通关进度
      progressManager.completeLevel('nounClause', levelId);
      progressManager.clearSession();
    } else {
      saveCurrentSession('defeat');
    }

    // 记录错词
    wrongAnswers.forEach(item => {
      progressManager.recordError(
        item.question.question,
        'nounClause',
        {
          translation: item.question.options,
          correctAnswer: item.question.correctAnswer,
        }
      );
    });
  };

  const handleBack = () => {
    router.push('/');
  };

  // 选择继续或重新开始界面
  if (phase === 'select' && savedSession) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <div className="text-6xl mb-4">💾</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">发现保存的进度</h2>
              <p className="text-gray-600 mb-6">
                上次你在 <span className="font-bold">Level {levelId} - {level.name}</span> 中途退出
              </p>

              <div className="bg-blue-50 rounded-xl p-4 mb-6 text-left">
                <p className="text-sm text-gray-700 mb-2">
                  <span className="font-bold">当前阶段：</span>
                  {savedSession.phase === 'learning' ? '学习模式' : '练习模式'}
                </p>
                <p className="text-sm text-gray-700 mb-2">
                  <span className="font-bold">武器等级：</span>
                  {savedSession.weaponLevel + 1}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-bold">保存时间：</span>
                  {new Date(savedSession.timestamp).toLocaleString('zh-CN')}
                </p>
              </div>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleContinue}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors font-bold"
                >
                  继续上次进度
                </button>
                <button
                  onClick={handleRestart}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-bold"
                >
                  重新开始
                </button>
              </div>

              <button
                onClick={() => {
                  progressManager.clearSession();
                  router.push('/');
                }}
                className="mt-4 text-sm text-gray-500 hover:text-gray-700"
              >
                返回首页
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'learning') {
    return (
      <NounLearningMode
        level={level}
        questions={learningQuestions}
        moduleType="nounClause"
        onComplete={handleLearningComplete}
        onBack={handleBack}
      />
    );
  }

  if (phase === 'practice') {
    return (
      <NounPracticeMode
        level={level}
        questions={practiceQuestions}
        weaponLevel={weaponLevel}
        moduleType="nounClause"
        onComplete={handlePracticeComplete}
      />
    );
  }

  if (phase === 'victory') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            {/* 胜利界面 */}
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-6 text-center">
              <div className="text-8xl mb-4">🎉</div>
              <h2 className="text-4xl font-bold text-green-600 mb-4">关卡通关！</h2>
              <p className="text-xl text-gray-600 mb-2">Level {level.id} - {level.name}</p>
              <p className="text-gray-600 mb-6">{level.description}</p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-blue-50 rounded-xl p-4">
                  <div className="text-3xl font-bold text-blue-600 mb-1">{weaponLevel + 1}</div>
                  <div className="text-sm text-gray-600">武器等级</div>
                </div>
                <div className="bg-green-50 rounded-xl p-4">
                  <div className="text-3xl font-bold text-green-600 mb-1">{learningQuestions.length + practiceQuestions.length - learningWrongAnswers.length - practiceWrongAnswers.length}</div>
                  <div className="text-sm text-gray-600">正确答题</div>
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => router.push('/noun-clause')}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-bold"
                >
                  返回主页
                </button>
                <button
                  onClick={() => {
                    setPhase('learning');
                    setWeaponLevel(0);
                    setLearningWrongAnswers([]);
                    setPracticeWrongAnswers([]);
                  }}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-bold"
                >
                  重新挑战
                </button>
              </div>
            </div>

            {/* 错题回顾 */}
            {(learningWrongAnswers.length > 0 || practiceWrongAnswers.length > 0) && (
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <span>📝</span>
                  本关错题回顾
                </h3>

                {learningWrongAnswers.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-lg font-bold text-blue-700 mb-3">学习模式错题</h4>
                    <div className="space-y-3">
                      {learningWrongAnswers.map((item, index) => (
                        <div key={index} className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                          <p className="font-medium text-gray-800 mb-2">
                            ❌ {item.question.question}
                          </p>
                          <p className="text-sm text-gray-600">
                            你选择了：<span className="text-red-600 font-bold">{item.userAnswer}</span>
                          </p>
                          <p className="text-sm text-gray-600">
                            ✅ 正确答案：<span className="text-green-600 font-bold">{item.question.correctAnswer}</span>
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {practiceWrongAnswers.length > 0 && (
                  <div>
                    <h4 className="text-lg font-bold text-purple-700 mb-3">练习模式错题</h4>
                    <div className="space-y-3">
                      {practiceWrongAnswers.map((item, index) => (
                        <div key={index} className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                          <p className="font-medium text-gray-800 mb-2">
                            ❌ {item.question.question}
                          </p>
                          <p className="text-sm text-gray-600">
                            你选择了：<span className="text-red-600 font-bold">{item.userAnswer}</span>
                          </p>
                          <p className="text-sm text-gray-600">
                            ✅ 正确答案：<span className="text-green-600 font-bold">{item.question.correctAnswer}</span>
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'defeat') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-50 to-orange-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            {/* 失败界面 */}
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-6 text-center">
              <div className="text-8xl mb-4">💔</div>
              <h2 className="text-4xl font-bold text-red-600 mb-4">挑战失败</h2>
              <p className="text-xl text-gray-600 mb-2">Level {level.id} - {level.name}</p>
              <p className="text-gray-600 mb-6">{level.description}</p>
              <p className="text-gray-700 mb-8">
                怪物太强了，回去再加强学习吧！
              </p>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => router.push('/noun-clause')}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-bold"
                >
                  返回主页
                </button>
                <button
                  onClick={() => {
                    setPhase('learning');
                    setWeaponLevel(0);
                    setLearningWrongAnswers([]);
                    setPracticeWrongAnswers([]);
                  }}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-bold"
                >
                  重新挑战
                </button>
              </div>
            </div>

            {/* 错题回顾 */}
            {(learningWrongAnswers.length > 0 || practiceWrongAnswers.length > 0) && (
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <span>📝</span>
                  本关错题回顾
                </h3>

                {learningWrongAnswers.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-lg font-bold text-blue-700 mb-3">学习模式错题</h4>
                    <div className="space-y-3">
                      {learningWrongAnswers.map((item, index) => (
                        <div key={index} className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                          <p className="font-medium text-gray-800 mb-2">
                            ❌ {item.question.question}
                          </p>
                          <p className="text-sm text-gray-600">
                            你选择了：<span className="text-red-600 font-bold">{item.userAnswer}</span>
                          </p>
                          <p className="text-sm text-gray-600">
                            ✅ 正确答案：<span className="text-green-600 font-bold">{item.question.correctAnswer}</span>
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {practiceWrongAnswers.length > 0 && (
                  <div>
                    <h4 className="text-lg font-bold text-purple-700 mb-3">练习模式错题</h4>
                    <div className="space-y-3">
                      {practiceWrongAnswers.map((item, index) => (
                        <div key={index} className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                          <p className="font-medium text-gray-800 mb-2">
                            ❌ {item.question.question}
                          </p>
                          <p className="text-sm text-gray-600">
                            你选择了：<span className="text-red-600 font-bold">{item.userAnswer}</span>
                          </p>
                          <p className="text-sm text-gray-600">
                            ✅ 正确答案：<span className="text-green-600 font-bold">{item.question.correctAnswer}</span>
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
