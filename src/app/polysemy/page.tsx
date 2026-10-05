'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home } from 'lucide-react';
import LevelSelector from '@/components_polysemy/LevelSelector';
import LearningMode from '@/components_polysemy/LearningMode';
import PracticeMode from '@/components_polysemy/PracticeMode';
import type { ErrorRecord as GameErrorRecord, PracticeErrorRecord, GameState, GroupData } from '@/types/game';
import { progressManager } from '@/lib/progress-manager';
import { useWrongWordsReview } from '@/hooks/useWrongWordsReview';

type PageErrorRecord = GameErrorRecord | PracticeErrorRecord;

export default function PolysemyPage() {
  const router = useRouter();
  const [gameMode, setGameMode] = useState<'home' | 'learning' | 'practice' | 'victory' | 'defeat' | 'select'>('home');
  const [gameState, setGameState] = useState<GameState>({
    currentGroup: 1,
    currentWordIndex: 0,
    weaponLevel: 0,
    playerHP: 100,
    monsterHP: 100,
    unlockedLevels: [1]
  });
  const [wordsData, setWordsData] = useState<GroupData[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorRecords, setErrorRecords] = useState<PageErrorRecord[]>([]);
  const [savedSession, setSavedSession] = useState<any>(null);

  useEffect(() => {
    fetch('/words_data.json')
      .then(res => res.json())
      .then(data => {
        setWordsData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load words data:', err);
        setLoading(false);
      });

    // 加载保存的进度
    const savedProgress = progressManager.getModuleProgress('polysemy');
    if (savedProgress) {
      setGameState({
        currentGroup: savedProgress.currentLevel || 1,
        currentWordIndex: savedProgress.answeredQuestions?.length || 0,
        weaponLevel: savedProgress.weaponLevel || 0,
        playerHP: savedProgress.playerHP || 100,
        monsterHP: savedProgress.monsterHP || 100,
        unlockedLevels: savedProgress.completedLevels || [1],
      });
    }

    // 检查是否有保存的会话
    const session = progressManager.getSession();
    if (session && session.moduleType === 'polysemy') {
      setSavedSession(session);
      if (session.gameMode) {
        setGameMode(session.gameMode);
      }
    }
  }, []);

  // 继续上次进度
  const handleContinue = () => {
    if (savedSession) {
      setGameState(prev => ({
        ...prev,
        currentGroup: savedSession.currentGroup || prev.currentGroup,
        currentWordIndex: savedSession.currentWordIndex || 0,
        weaponLevel: savedSession.weaponLevel || 0,
        playerHP: savedSession.playerHP || 100,
        monsterHP: savedSession.monsterHP || 100,
      }));
      setErrorRecords(savedSession.errorRecords || []);
      setGameMode(savedSession.gameMode || 'home');
      setSavedSession(null);
    }
  };

  // 重新开始
  const handleRestart = () => {
    progressManager.clearSession();
    setGameState(prev => ({
      ...prev,
      currentGroup: 1,
      currentWordIndex: 0,
      weaponLevel: 0,
      playerHP: 100,
      monsterHP: 100,
    }));
    setErrorRecords([]);
    setGameMode('home');
  };

  // 保存当前会话
  const saveCurrentSession = (mode: 'learning' | 'practice' | 'victory' | 'defeat') => {
    progressManager.saveSession({
      moduleType: 'polysemy',
      gameMode: mode,
      currentGroup: gameState.currentGroup,
      currentWordIndex: gameState.currentWordIndex,
      weaponLevel: gameState.weaponLevel,
      playerHP: gameState.playerHP,
      monsterHP: gameState.monsterHP,
      errorRecords,
      timestamp: Date.now(),
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">📚</div>
          <h2 className="text-2xl font-bold text-gray-800">加载中...</h2>
        </div>
      </div>
    );
  }

  const handleLevelSelect = (level: number) => {
    setGameState(prev => ({
      ...prev,
      currentGroup: level,
      currentWordIndex: 0,
      weaponLevel: 0,
      playerHP: 100,
      monsterHP: 100
    }));
    setErrorRecords([]);
    setGameMode('learning');

    // 保存进度
    progressManager.updateModuleProgress('polysemy', {
      currentLevel: level,
      answeredQuestions: [],
    });
    saveCurrentSession('learning');
  };

  const handleLearningComplete = (finalWeaponLevel: number, errors: GameErrorRecord[]) => {
    setGameState(prev => ({
      ...prev,
      weaponLevel: finalWeaponLevel
    }));
    setErrorRecords(errors);
    setGameMode('practice');

    // 记录错误到错词库
    errors.forEach(error => {
      progressManager.recordError(error.word, 'polysemy', {
        translation: error.missedCorrect,
      });
    });

    // 保存进度
    progressManager.updateModuleProgress('polysemy', {
      weaponLevel: finalWeaponLevel,
      errorRecords: errors as any, // 临时类型转换，避免类型冲突
    });
    saveCurrentSession('practice');
  };

  const handleBattleComplete = (victory: boolean, errors: PracticeErrorRecord[]) => {
    setErrorRecords(errors);

    if (victory) {
      // 标记关卡完成
      progressManager.completeLevel('polysemy', gameState.currentGroup);
      setGameMode('victory');
      // 通关后清除会话
      progressManager.clearSession();
    } else {
      setGameMode('defeat');
      saveCurrentSession('defeat');
    }

    // 记录错误到错词库
    errors.forEach(error => {
      progressManager.recordError(error.word, 'polysemy', {
        example: error.example,
        translation: [error.correctAnswer],
      });
    });
  };

  const handleRetry = () => {
    setGameState(prev => ({
      ...prev,
      currentWordIndex: 0,
      weaponLevel: 0,
      playerHP: 100,
      monsterHP: 100
    }));
    setErrorRecords([]);
    setGameMode('learning');

    progressManager.updateModuleProgress('polysemy', {
      answeredQuestions: [],
      weaponLevel: 0,
      playerHP: 100,
      monsterHP: 100,
    });
  };

  const handleBackToHome = () => {
    setGameMode('home');
    setErrorRecords([]);
  };

  const handleBackToModules = () => {
    router.push('/');
  };

  const handleNextLevel = () => {
    const nextLevel = gameState.currentGroup + 1;
    if (nextLevel <= wordsData.length) {
      setGameState(prev => ({
        ...prev,
        currentGroup: nextLevel,
        currentWordIndex: 0,
        weaponLevel: 0,
        playerHP: 100,
        monsterHP: 100
      }));
      setErrorRecords([]);
      setGameMode('learning');

      progressManager.updateModuleProgress('polysemy', {
        currentLevel: nextLevel,
        answeredQuestions: [],
        weaponLevel: 0,
        playerHP: 100,
        monsterHP: 100,
      });
    } else {
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      {/* 顶部导航栏 */}
      <div className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={handleBackToModules}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <Home className="h-4 w-4" />
              返回首页
            </Button>

            <h1 className="text-2xl font-bold text-blue-700">一词多义闯关</h1>

            {/* 错词库统计 */}
            <div className="text-sm text-gray-600">
              {(() => {
                const stats = progressManager.getWrongWordsStats();
                return `错词库: ${stats.pending}待复习 / ${stats.total}总计`;
              })()}
            </div>
          </div>
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="container mx-auto px-4 py-8">
        {/* 继续学习界面 */}
        {gameMode === 'select' && savedSession && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <div className="text-6xl mb-4">💾</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">发现保存的进度</h2>
              <p className="text-gray-600 mb-6">
                上次你在 <span className="font-bold">Level {savedSession.currentGroup}</span> 中途退出
              </p>

              <div className="bg-blue-50 rounded-xl p-4 mb-6 text-left">
                <p className="text-sm text-gray-700 mb-2">
                  <span className="font-bold">当前模式：</span>
                  {savedSession.gameMode === 'learning' ? '学习模式' : savedSession.gameMode === 'practice' ? '练习模式' : '其他'}
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
                <Button
                  onClick={handleContinue}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  继续上次进度
                </Button>
                <Button
                  onClick={handleRestart}
                  variant="outline"
                >
                  重新开始
                </Button>
              </div>

              <Button
                onClick={() => {
                  progressManager.clearSession();
                  setGameMode('home');
                  setSavedSession(null);
                }}
                variant="ghost"
                className="mt-4 text-gray-500"
              >
                返回关卡选择
              </Button>
            </div>
          </div>
        )}

        {gameMode === 'home' && (
          <LevelSelector
            levels={wordsData.length}
            unlockedLevels={gameState.unlockedLevels}
            onSelectLevel={handleLevelSelect}
          />
        )}

        {gameMode === 'learning' && (
          <LearningMode
            groupData={wordsData[gameState.currentGroup - 1]}
            onComplete={handleLearningComplete}
            onBack={handleBackToHome}
          />
        )}

        {gameMode === 'practice' && (
          <PracticeMode
            groupData={wordsData[gameState.currentGroup - 1]}
            weaponLevel={gameState.weaponLevel}
            onComplete={handleBattleComplete}
          />
        )}

        {gameMode === 'victory' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold text-green-600 mb-4">恭喜过关！</h2>
              <p className="text-gray-600 mb-6">你已成功击败怪物！</p>

              {/* 错误统计 */}
              {errorRecords.length > 0 && (
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 mb-6 text-left">
                  <h3 className="text-lg font-bold text-red-700 mb-4">
                    ❌ 答错词汇 ({errorRecords.length} 个)
                  </h3>
                  <div className="space-y-4 max-h-64 overflow-y-auto">
                    {errorRecords.map((record, index) => {
                      const isLearningMode = 'selectedWrong' in record && 'missedCorrect' in record;

                      if (isLearningMode) {
                        const lr = record as GameErrorRecord;
                        return (
                          <div key={index} className="bg-white rounded-lg p-4 text-left">
                            <div className="font-bold text-gray-800 mb-2">
                              {lr.word}
                            </div>
                            {lr.selectedWrong && lr.selectedWrong.length > 0 && (
                              <div className="text-red-600 text-sm mb-1">
                                <strong>选择错误的释义：</strong>
                                {lr.selectedWrong.join('、')}
                              </div>
                            )}
                            {lr.missedCorrect && lr.missedCorrect.length > 0 && (
                              <div className="text-orange-600 text-sm mb-1">
                                <strong>漏选的正确释义：</strong>
                                {lr.missedCorrect.join('、')}
                              </div>
                            )}
                          </div>
                        );
                      } else {
                        const pr = record as PracticeErrorRecord;
                        return (
                          <div key={index} className="bg-white rounded-lg p-4 text-left">
                            <div className="font-bold text-gray-800 mb-2">
                              {pr.word}
                            </div>
                            <div className="text-gray-600 text-sm mb-2 italic">
                              "{pr.example}"
                            </div>
                            <div className="text-red-600 text-sm">
                              <strong>你的答案：</strong>{pr.selectedWrong}
                            </div>
                            <div className="text-green-600 text-sm mt-1">
                              <strong>正确答案：</strong>{pr.correctAnswer}
                            </div>
                          </div>
                        );
                      }
                    })}
                  </div>
                </div>
              )}

              <div className="flex gap-4 justify-center">
                <Button
                  onClick={handleBackToHome}
                  variant="outline"
                >
                  返回关卡选择
                </Button>
                {gameState.currentGroup < wordsData.length && (
                  <Button
                    onClick={handleNextLevel}
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    下一关
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

        {gameMode === 'defeat' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="text-6xl mb-4">💔</div>
              <h2 className="text-2xl font-bold text-red-600 mb-4">挑战失败</h2>
              <p className="text-gray-600 mb-6">别灰心，再试一次！</p>

              <div className="flex gap-4 justify-center">
                <Button
                  onClick={handleBackToHome}
                  variant="outline"
                >
                  返回关卡选择
                </Button>
                <Button
                  onClick={handleRetry}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  重新挑战
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
