'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { gameData } from '@/data';

// 类型定义
interface LexicalChunk {
  en: string;
  cn: string[];
}

interface PracticeQuestion {
  stem: string;
  options: string[];
  answer: string;
}

interface Level {
  id: number;
  name: string;
  lexicalChunks: LexicalChunk[];
  practiceQuestions: PracticeQuestion[];
}

interface World {
  id: number;
  name: string;
  levels: Level[];
}

interface GameState {
  unlockedWorlds: number[];
  completedLevels: Array<{ worldId: number; levelId: number }>;
  currentWeaponLevel: number;
}

const weapons = [
  { name: '木剑', image: '/sword in stone.png', level: 0 },
  { name: '铁剑', image: '/sword.png', level: 1 },
  { name: '钢剑', image: '/solider.png', level: 2 },
];

const worldMonsters: { name: string; image: string }[] = [];

export default function Home() {
  const [gameState, setGameState] = useState<GameState>({
    unlockedWorlds: [1, 2, 3, 4],
    completedLevels: [],
    currentWeaponLevel: 0,
  });
  const [selectedWorld, setSelectedWorld] = useState<number | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [gameMode, setGameMode] = useState<'home' | 'learning' | 'practice' | 'victory' | 'defeat'>('home');

  // 从localStorage加载游戏进度
  useEffect(() => {
    const savedState = localStorage.getItem('lexicalGame');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        // 确保所有世界始终解锁
        parsed.unlockedWorlds = [1, 2, 3, 4];
        setGameState(parsed);
      } catch (e) {
        console.error('Failed to load saved game:', e);
      }
    }
  }, []);

  // 保存游戏进度
  const saveGameState = (newState: Partial<GameState>) => {
    const updated = { ...gameState, ...newState };
    // 确保所有世界始终解锁
    updated.unlockedWorlds = [1, 2, 3, 4];
    setGameState(updated);
    localStorage.setItem('lexicalGame', JSON.stringify(updated));
  };

  const handleWorldSelect = (worldId: number) => {
    setSelectedWorld(worldId);
  };

  const handleLevelSelect = (levelId: number) => {
    setSelectedLevel(levelId);
    setGameMode('learning');
  };

  const handleBackToLevels = () => {
    setSelectedLevel(null);
    setGameMode('home');
  };

  const handleBackToWorlds = () => {
    setSelectedWorld(null);
    setGameMode('home');
  };

  const handleLearningComplete = (weaponLevel: number) => {
    saveGameState({ currentWeaponLevel: weaponLevel });
    setGameMode('practice');
  };

  const handlePracticeComplete = (victory: boolean) => {
    if (victory && selectedWorld && selectedLevel) {
      const newCompletedLevels = [
        ...gameState.completedLevels.filter(
          (l) => !(l.worldId === selectedWorld && l.levelId === selectedLevel)
        ),
        { worldId: selectedWorld, levelId: selectedLevel },
      ];

      saveGameState({
        completedLevels: newCompletedLevels,
      });

      setGameMode('victory');
    } else {
      setGameMode('defeat');
    }
  };

  // 主页：世界选择
  if (gameMode === 'home' && selectedWorld === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 text-gray-800">
        {/* Header */}
        <header className="bg-white shadow-md">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              {/* 左侧：附属中学logo */}
              <div className="flex-shrink-0">
                <Image
                  src="/r江西师大附中校徽.png"
                  alt="江西师大附中校徽"
                  width={80}
                  height={80}
                  className="object-contain"
                />
              </div>

              {/* 中间：标题 */}
              <h1 className="text-3xl md:text-4xl font-bold text-center text-blue-700">
                高二英语词块闯关王
              </h1>

              {/* 右侧：江西师范大学logo */}
              <div className="flex-shrink-0">
                <Image
                  src="/jxnu_logo.png"
                  alt="江西师范大学Logo"
                  width={120}
                  height={120}
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </header>

        {/* 主内容 */}
        <main className="container mx-auto px-4 py-12">
          {/* 世界选择 */}
          <h2 className="text-3xl font-bold text-center mb-8">选择你的冒险世界</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {gameData.worlds.map((world: World, index: number) => {
              const monster = worldMonsters[index];

              return (
                <Card
                  key={world.id}
                  className={`
                    relative overflow-hidden transition-all duration-300 hover:scale-105
                    cursor-pointer bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-xl hover:shadow-2xl
                  `}
                  onClick={() => handleWorldSelect(world.id)}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="text-sm font-semibold opacity-90 mb-1">World {world.id}</div>
                        <h3 className="text-2xl font-bold mb-2">{world.name}</h3>
                        <p className="text-sm opacity-90">包含 5 个关卡</p>
                      </div>
                      <div className="relative">
                        <Image
                          src={monster.image}
                          alt={monster.name}
                          width={80}
                          height={80}
                          className="object-contain"
                        />
                      </div>
                    </div>

                    {/* 关卡完成进度 */}
                    <div className="mt-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>关卡进度</span>
                        <span>
                          {
                            gameState.completedLevels.filter((l) => l.worldId === world.id).length
                          } / 5
                        </span>
                      </div>
                      <div className="w-full bg-black/20 rounded-full h-2">
                        <div
                          className="bg-white h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${
                              (gameState.completedLevels.filter((l) => l.worldId === world.id).length / 5) * 100
                            }%`
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </main>
      </div>
    );
  }

  // 关卡选择页面
  if (gameMode === 'home' && selectedWorld !== null) {
    const world = gameData.worlds.find((w: World) => w.id === selectedWorld);

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 text-gray-800">
        <header className="bg-white shadow-md">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <button
                onClick={handleBackToWorlds}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
              >
                <span>←</span>
                <span>返回世界选择</span>
              </button>
              <h1 className="text-2xl font-bold text-blue-700">{world?.name}</h1>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">当前武器</span>
                <Image
                  src={weapons[Math.min(gameState.currentWeaponLevel, 2)].image}
                  alt="当前武器"
                  width={30}
                  height={30}
                />
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">选择关卡</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {world?.levels.map((level: Level) => {
                const isCompleted = gameState.completedLevels.some(
                  (l) => l.worldId === world.id && l.levelId === level.id
                );

                return (
                  <Card
                    key={level.id}
                    className={`
                      p-6 text-center transition-all duration-300 hover:scale-105 cursor-pointer
                      ${isCompleted
                        ? 'bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg'
                        : 'bg-white hover:shadow-lg border-2 border-blue-300'
                      }
                    `}
                    onClick={() => handleLevelSelect(level.id)}
                  >
                    <div className="text-4xl font-bold mb-2">{level.id}</div>
                    <div className="font-semibold mb-2">{level.name}</div>
                    {isCompleted && <div className="text-2xl">✓</div>}
                  </Card>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    );
  }

  // 学习模式
  if (gameMode === 'learning' && selectedWorld && selectedLevel) {
    return (
      <LearningMode
        worldId={selectedWorld}
        levelId={selectedLevel}
        weaponLevel={gameState.currentWeaponLevel}
        onComplete={handleLearningComplete}
        onBack={handleBackToLevels}
      />
    );
  }

  // 练习模式
  if (gameMode === 'practice' && selectedWorld && selectedLevel) {
    return (
      <PracticeMode
        worldId={selectedWorld}
        levelId={selectedLevel}
        weaponLevel={gameState.currentWeaponLevel}
        onComplete={handlePracticeComplete}
      />
    );
  }

  // 胜利页面
  if (gameMode === 'victory') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-green-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4 p-8 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-4xl font-bold text-green-600 mb-4">挑战成功！</h2>
          <p className="text-lg text-gray-600 mb-8">
            恭喜你成功击败了词汇怪物！
          </p>
          <Button
            onClick={handleBackToLevels}
            className="w-full h-12 text-lg"
          >
            返回关卡选择
          </Button>
        </Card>
      </div>
    );
  }

  // 失败页面
  if (gameMode === 'defeat') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4 p-8 text-center">
          <div className="text-6xl mb-4">💔</div>
          <h2 className="text-4xl font-bold text-red-600 mb-4">挑战失败</h2>
          <p className="text-lg text-gray-600 mb-8">
            怪物太强了，回去再加强学习吧！
          </p>
          <Button
            onClick={handleBackToLevels}
            className="w-full h-12 text-lg"
          >
            再试一次
          </Button>
        </Card>
      </div>
    );
  }

  return null;
}

// 学习模式组件
function LearningMode({ worldId, levelId, weaponLevel, onComplete, onBack }: {
  worldId: number;
  levelId: number;
  weaponLevel: number;
  onComplete: (weaponLevel: number) => void;
  onBack: () => void;
}) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Set<string>>(new Set());
  const [result, setResult] = useState<'perfect' | 'partial' | 'wrong' | null>(null);
  const [currentWeaponLevel, setCurrentWeaponLevel] = useState(weaponLevel);
  const [showSummary, setShowSummary] = useState(false);

  const world = gameData.worlds.find((w: World) => w.id === worldId);
  const level = world?.levels.find((l: Level) => l.id === levelId);
  const words = level?.lexicalChunks || [];

  const currentWord = words[currentWordIndex];

  const toggleOption = (option: string) => {
    if (result) return;

    const newSelected = new Set(selectedOptions);
    if (newSelected.has(option)) {
      newSelected.delete(option);
    } else {
      newSelected.add(option);
    }
    setSelectedOptions(newSelected);
  };

  const handleSubmit = () => {
    if (selectedOptions.size === 0) return;

    const correctOptions = currentWord?.cn || [];
    const selectedArray = Array.from(selectedOptions);

    const hasWrong = selectedArray.some((opt: string) => !correctOptions.includes(opt));
    const allCorrectSelected = correctOptions.every((opt: string) => selectedArray.includes(opt));

    if (hasWrong) {
      setResult('wrong');
    } else if (allCorrectSelected) {
      setResult('perfect');
      setCurrentWeaponLevel(prev => Math.min(prev + 1, 2));
    } else {
      setResult('partial');
    }
  };

  const handleNext = () => {
    if (currentWordIndex < words.length - 1) {
      setCurrentWordIndex(prev => prev + 1);
      setSelectedOptions(new Set());
      setResult(null);
    } else {
      setShowSummary(true);
    }
  };

  const handleComplete = () => {
    onComplete(currentWeaponLevel);
  };

  const currentWeapon = weapons[Math.min(currentWeaponLevel, 2)];

  if (showSummary) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 text-gray-800">
        <header className="bg-white shadow-md">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <button onClick={onBack} className="text-blue-600 hover:text-blue-700">
                ← 返回
              </button>
              <h1 className="text-2xl font-bold text-blue-700">词块熔炉</h1>
              <div className="w-16"></div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto">
            <Card className="p-8 text-center">
              <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">学习完成！</h2>

              <div className="flex justify-center mb-6">
                <Image
                  src={currentWeapon.image}
                  alt={currentWeapon.name}
                  width={120}
                  height={120}
                  className="object-contain"
                />
              </div>
              <div className="text-2xl font-bold text-gray-800 mb-2">获得武器</div>
              <div className="text-xl text-blue-600 mb-8">{currentWeapon.name}</div>

              <div className="bg-blue-50 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-3">武器等级</h3>
                <div className="flex justify-center gap-4">
                  {weapons.map((weapon, index) => (
                    <div
                      key={index}
                      className={`
                        flex flex-col items-center gap-2 p-3 rounded-lg
                        ${index <= currentWeaponLevel
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-400'
                        }
                      `}
                    >
                      <Image
                        src={weapon.image}
                        alt={weapon.name}
                        width={40}
                        height={40}
                        className="object-contain"
                      />
                      <span className="text-sm font-semibold">{weapon.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleComplete}
                className="w-full h-12 text-lg"
              >
                开始战斗
              </Button>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 text-gray-800">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <button onClick={onBack} className="text-blue-600 hover:text-blue-700">
              ← 返回
            </button>
            <h1 className="text-2xl font-bold text-blue-700">词块熔炉：锻造神兵</h1>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">当前武器</span>
              <Image
                src={currentWeapon.image}
                alt="当前武器"
                width={30}
                height={30}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* 进度条 */}
        <div className="max-w-2xl mx-auto mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">
              {world?.name} - {level?.name}
            </span>
            <span className="text-sm text-gray-600">
              {currentWordIndex + 1} / {words.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentWordIndex + 1) / words.length) * 100}%` }}
            />
          </div>
        </div>

        {/* 单词卡片 */}
        <div className="max-w-2xl mx-auto">
          <Card className="p-8">
            {/* 单词标题 */}
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-blue-700 mb-2">
                {currentWord?.en}
              </h2>
            </div>

            {/* 提示信息 */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
              <p className="text-sm text-yellow-800">
                💡 请选择所有正确的中文释义（可能有多个）
              </p>
            </div>

            {/* 选项列表 */}
            <div className="grid gap-3 mb-6">
              {[...new Set([...currentWord?.cn || [], ...getDistractors(worldId, levelId, currentWord?.en || '')])].map((option: string, index: number) => (
                <button
                  key={index}
                  onClick={() => toggleOption(option)}
                  disabled={result !== null}
                  className={`
                    p-4 rounded-xl text-left transition-all duration-200 border-2
                    ${selectedOptions.has(option)
                      ? 'bg-blue-500 border-blue-600 text-white'
                      : 'bg-white border-gray-300 hover:border-blue-500 hover:shadow-md'
                    }
                    ${result === 'perfect' && currentWord?.cn?.includes(option) ? 'bg-green-500 border-green-600 text-white' : ''}
                    ${result === 'wrong' && !currentWord?.cn?.includes(option) && selectedOptions.has(option) ? 'bg-red-500 border-red-600 text-white' : ''}
                    ${result !== null ? 'cursor-not-allowed' : 'cursor-pointer'}
                  `}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {selectedOptions.has(option) && <span>✓</span>}
                  </div>
                </button>
              ))}
            </div>

            {/* 结果反馈 */}
            {result && (
              <div className={`
                rounded-xl p-6 mb-6 text-center animate-in slide-in-from-bottom-4
                ${result === 'perfect' ? 'bg-green-100 border-2 border-green-500' : ''}
                ${result === 'partial' ? 'bg-yellow-100 border-2 border-yellow-500' : ''}
                ${result === 'wrong' ? 'bg-red-100 border-2 border-red-500' : ''}
              `}>
                {result === 'perfect' && (
                  <>
                    <div className="text-4xl mb-2">✨</div>
                    <h3 className="text-2xl font-bold text-green-700 mb-2">完美升级！</h3>
                    <p className="text-green-600">武器强化 +1</p>
                  </>
                )}
                {result === 'partial' && (
                  <>
                    <div className="text-4xl mb-2">😔</div>
                    <h3 className="text-2xl font-bold text-yellow-700 mb-2">遗憾升级…</h3>
                    <p className="text-yellow-600">只选择了部分正确释义</p>
                  </>
                )}
                {result === 'wrong' && (
                  <>
                    <div className="text-4xl mb-2">❌</div>
                    <h3 className="text-2xl font-bold text-red-700 mb-2">掺杂杂质！</h3>
                    <p className="text-red-600">包含了错误选项，武器未升级</p>
                  </>
                )}
              </div>
            )}

            {/* 操作按钮 */}
            <div className="flex gap-4">
              {!result ? (
                <Button
                  onClick={handleSubmit}
                  disabled={selectedOptions.size === 0}
                  className="flex-1 h-12"
                >
                  锻造！
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  className="flex-1 h-12"
                >
                  {currentWordIndex < words.length - 1 ? '下一个' : '完成'}
                </Button>
              )}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}

// 练习模式组件
function PracticeMode({ worldId, levelId, weaponLevel, onComplete }: {
  worldId: number;
  levelId: number;
  weaponLevel: number;
  onComplete: (victory: boolean) => void;
}) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [playerHP, setPlayerHP] = useState(100);
  const [monsterHP, setMonsterHP] = useState(100);
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null);
  const [showResult, setShowResult] = useState(false);

  const world = gameData.worlds.find((w: World) => w.id === worldId);
  const level = world?.levels.find((l: Level) => l.id === levelId);
  const questions = level?.practiceQuestions || [];

  const currentQuestion = questions[currentQuestionIndex];

  const weapons = [
    { name: '木剑', image: '/sword in stone.png', damage: 15 },
    { name: '铁剑', image: '/sword.png', damage: 20 },
    { name: '钢剑', image: '/solider.png', damage: 30 },
  ];

  const worldMonsters: { name: string; image: string }[] = [];

  const currentWeapon = weapons[Math.min(weaponLevel, 2)];
  const currentMonster = worldMonsters[(worldId - 1) % worldMonsters.length];

  const handleAnswer = (selectedAnswer: string) => {
    if (result || !currentQuestion) return;

    const isCorrect = selectedAnswer === currentQuestion.answer;

    if (isCorrect) {
      const damage = currentWeapon.damage;
      setMonsterHP(prev => Math.max(0, prev - damage));
      setResult('correct');
    } else {
      const damage = 15;
      setPlayerHP(prev => Math.max(0, prev - damage));
      setResult('wrong');
    }

    // 1.5秒后自动进入下一题
    setTimeout(() => {
      if (playerHP <= 0 || monsterHP <= currentWeapon.damage) {
        // 即将结束
      } else {
        moveToNextQuestion();
      }
    }, 1500);
  };

  const moveToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setResult(null);
    } else {
      // 所有题目都答完了，根据血量判断胜负
      setShowResult(true);
      // 1.5秒后根据血量判断胜负
      setTimeout(() => {
        if (monsterHP <= 0 || (monsterHP < 100 && playerHP > monsterHP)) {
          onComplete(true); // 胜利
        } else {
          onComplete(false); // 失败
        }
      }, 1500);
    }
  };

  useEffect(() => {
    if (playerHP <= 0) {
      setShowResult(true);
      setTimeout(() => onComplete(false), 1500);
    } else if (monsterHP <= 0) {
      setShowResult(true);
      setTimeout(() => onComplete(true), 1500);
    }
  }, [playerHP, monsterHP, onComplete]);

  if (showResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 text-gray-800">
        <main className="container mx-auto px-4 py-12 flex items-center justify-center">
          <Card className="max-w-md w-full mx-4 p-8 text-center">
            {monsterHP <= 0 ? (
              <>
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-4xl font-bold text-green-600 mb-4">怪物被击败！</h2>
                <p className="text-xl text-gray-600 mb-8">你成功守护了知识堡垒！</p>
              </>
            ) : (
              <>
                <div className="text-6xl mb-4">💔</div>
                <h2 className="text-4xl font-bold text-red-600 mb-4">挑战失败</h2>
                <p className="text-xl text-gray-600 mb-8">怪物太强了，回去再加强学习吧！</p>
              </>
            )}
            <Button
              onClick={() => onComplete(monsterHP <= 0)}
              className="w-full h-12 text-lg"
            >
              继续游戏
            </Button>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 text-gray-800">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="text-xl font-bold text-blue-700">
              词义试炼：讨伐谬误兽
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">{currentWeapon.name}</span>
              <Image
                src={currentWeapon.image}
                alt="当前武器"
                width={30}
                height={30}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* 战斗场景 */}
        <div className="max-w-4xl mx-auto">
          <Card className="p-8">
            {/* 战斗双方 */}
            <div className="grid grid-cols-2 gap-8 mb-8">
              {/* 玩家 */}
              <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <Image
                    src={currentWeapon.image}
                    alt={currentWeapon.name}
                    width={80}
                    height={80}
                    className="object-contain"
                  />
                </div>
                <h3 className="text-xl font-bold mb-2">你</h3>
                <div className="w-full bg-gray-200 rounded-full h-6 mb-2">
                  <div
                    className="bg-green-500 h-6 rounded-full transition-all duration-300"
                    style={{ width: `${playerHP}%` }}
                  />
                </div>
                <p className="text-sm font-semibold">HP: {playerHP} / 100</p>
              </div>

              {/* 怪物 */}
              <div className="text-center">
                <Image
                  src={currentMonster.image}
                  alt={currentMonster.name}
                  width={120}
                  height={120}
                  className="object-contain mx-auto mb-4"
                />
                <h3 className="text-xl font-bold mb-2">{currentMonster.name}</h3>
                <div className="w-full bg-gray-200 rounded-full h-6 mb-2">
                  <div
                    className="bg-red-500 h-6 rounded-full transition-all duration-300"
                    style={{ width: `${monsterHP}%` }}
                  />
                </div>
                <p className="text-sm font-semibold">HP: {monsterHP} / 100</p>
              </div>
            </div>

            {/* 问题 */}
            <div className="bg-white rounded-xl p-6 mb-6 shadow-inner">
              <p className="text-lg text-center font-semibold">{currentQuestion?.stem}</p>
            </div>

            {/* 选项 */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {currentQuestion?.options.map((option: string, index: number) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  disabled={result !== null}
                  className={`
                    p-6 rounded-xl text-center transition-all duration-200 border-2
                    ${result === 'correct' && option === currentQuestion.answer
                      ? 'bg-green-500 border-green-600 text-white scale-105'
                      : result === 'wrong' && option !== currentQuestion.answer && result !== null
                      ? 'bg-red-500 border-red-600 text-white'
                      : result === 'correct' && option !== currentQuestion.answer
                      ? 'bg-white border-gray-300'
                      : 'bg-white border-gray-300 hover:border-purple-500 hover:shadow-lg'
                    }
                    ${result !== null ? 'cursor-not-allowed' : 'cursor-pointer'}
                    font-bold text-lg
                  `}
                >
                  {option}
                </button>
              ))}
            </div>

            {/* 进度 */}
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-2">
                总进度
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {currentQuestionIndex + 1} / {questions.length}
              </p>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}

// 辅助函数：获取干扰项
function getDistractors(worldId: number, levelId: number, currentWord: string): string[] {
  const world = gameData.worlds.find((w: World) => w.id === worldId);
  const level = world?.levels.find((l: Level) => l.id === levelId);
  const allWords = world?.levels.flatMap((l: Level) => l.lexicalChunks) || [];

  // 过滤掉当前词块，随机选择2-3个作为干扰项
  const distractors = allWords
    .filter((w: LexicalChunk) => w.en !== currentWord)
    .flatMap((w: LexicalChunk) => w.cn)
    .slice(0, 3);

  return distractors;
}
