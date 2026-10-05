'use client';

import { useState, useEffect } from 'react';
import { BaseQuestion, BaseLevel } from '@/types/common';
import { LevelGenerator } from '@/lib/level-generator';

interface NounPracticeModeProps {
  level: BaseLevel;
  questions: BaseQuestion[];
  weaponLevel: number;
  moduleType?: 'polysemy' | 'chunks' | 'inversion' | 'nounClause' | 'culture';
  onComplete: (victory: boolean, wrongAnswers: Array<{ question: BaseQuestion; userAnswer: string }>) => void;
}

const weapons = [
  { name: '木剑', emoji: '🪵', damage: 15 },
  { name: '铁剑', emoji: '⚔️', damage: 20 },
  { name: '钢剑', emoji: '🗡️', damage: 25 },
  { name: '精钢剑', emoji: '⚡', damage: 30 },
  { name: '光剑', emoji: '✨', damage: 40 },
];

const monsters = [
  { emoji: '🐉', name: '语义混沌兽' },
  { emoji: '👹', name: '从句恶魔' },
  { emoji: '🦖', name: '语法恐龙' },
  { emoji: '👻', name: '逻辑幽灵' },
];

export default function NounPracticeMode({ level, questions, weaponLevel, moduleType = 'nounClause', onComplete }: NounPracticeModeProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [playerHP, setPlayerHP] = useState(100);
  const [monsterHP, setMonsterHP] = useState(100);
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null);
  const [damageDisplay, setDamageDisplay] = useState<{ player?: number; monster?: number } | null>(null);
  const [wrongAnswers, setWrongAnswers] = useState<Array<{ question: BaseQuestion; userAnswer: string }>>([]);

  const currentQuestion = questions[currentQuestionIndex];
  const currentWeapon = weapons[Math.min(weaponLevel, 4)];
  const currentMonster = monsters[level.worldId % monsters.length];
  const baseDamage = currentWeapon.damage;

  const handleAnswer = (selectedOption: string) => {
    if (result) return;

    const isCorrect = selectedOption === currentQuestion.correctAnswer;

    // 使用LevelGenerator处理答题结果
    LevelGenerator.handleAnswer(currentQuestion, selectedOption, isCorrect, moduleType);

    if (isCorrect) {
      const damage = baseDamage;
      setMonsterHP(prev => Math.max(0, prev - damage));
      setResult('correct');
      setDamageDisplay({ monster: damage });
    } else {
      const damage = 15;
      setPlayerHP(prev => Math.max(0, prev - damage));
      setResult('wrong');
      setDamageDisplay({ player: damage });
      // 记录错题
      setWrongAnswers(prev => [
        ...prev,
        { question: currentQuestion, userAnswer: selectedOption }
      ]);
    }

    // 1.5秒后自动进入下一题
    setTimeout(() => {
      if (monsterHP <= baseDamage || playerHP <= 15) {
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
      setDamageDisplay(null);
    }
  };

  useEffect(() => {
    if (playerHP <= 0) {
      setTimeout(() => onComplete(false, wrongAnswers), 500);
    } else if (monsterHP <= 0) {
      setTimeout(() => onComplete(true, wrongAnswers), 500);
    }
  }, [playerHP, monsterHP, onComplete, wrongAnswers]);

  if (playerHP <= 0 || monsterHP <= 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8 text-center">
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
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 战斗场景 */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-b from-purple-100 to-blue-100 rounded-3xl shadow-2xl p-8">

          {/* 战斗双方 */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            {/* 玩家 */}
            <div className={`bg-white rounded-2xl p-6 shadow-lg transition-all duration-300 ${damageDisplay?.player ? 'animate-shake' : ''}`}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-sm text-gray-600 mb-1">你</div>
                  <div className="font-bold text-gray-800">勇敢的语法战士</div>
                </div>
                <div className="text-4xl">🦸</div>
              </div>

              {/* 玩家生命条 */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">HP</span>
                  <span className="text-sm font-bold text-red-600">{playerHP}/100</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-red-500 to-red-600 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${playerHP}%` }}
                  />
                </div>
              </div>

              {/* 武器信息 */}
              <div className="flex items-center gap-3 bg-blue-50 rounded-xl p-3">
                <span className="text-3xl">{currentWeapon.emoji}</span>
                <div>
                  <div className="font-bold text-gray-800">{currentWeapon.name}</div>
                  <div className="text-sm text-gray-600">攻击力: {baseDamage}</div>
                </div>
              </div>

              {/* 伤害数字 */}
              {damageDisplay?.player && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl font-bold text-red-600 animate-bounce">
                  -{damageDisplay.player}
                </div>
              )}
            </div>

            {/* 怪物 */}
            <div className={`bg-white rounded-2xl p-6 shadow-lg transition-all duration-300 ${damageDisplay?.monster ? 'animate-shake' : ''}`}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-sm text-gray-600 mb-1">{currentMonster.name}</div>
                  <div className="font-bold text-gray-800">语义混沌兽</div>
                </div>
                <div className="text-4xl">{currentMonster.emoji}</div>
              </div>

              {/* 怪物生命条 */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">HP</span>
                  <span className="text-sm font-bold text-red-600">{monsterHP}/100</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-red-500 to-red-600 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${monsterHP}%` }}
                  />
                </div>
              </div>

              {/* 怪物攻击力 */}
              <div className="flex items-center gap-3 bg-purple-50 rounded-xl p-3">
                <span className="text-3xl">⚔️</span>
                <div>
                  <div className="font-bold text-gray-800">攻击</div>
                  <div className="text-sm text-gray-600">15 伤害</div>
                </div>
              </div>

              {/* 伤害数字 */}
              {damageDisplay?.monster && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl font-bold text-red-600 animate-bounce">
                  -{damageDisplay.monster}
                </div>
              )}
            </div>
          </div>

          {/* 题目区域 */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
            <div className="text-center mb-6">
              <div className="text-sm text-gray-600 mb-2">
                Level {level.id} - {level.worldName} - 练习模式
              </div>
              <div className="text-sm text-gray-600 mb-4">
                进度: {currentQuestionIndex + 1} / {questions.length}
              </div>
            </div>

            <h2 className="text-2xl font-bold text-center text-gray-800 mb-8 leading-relaxed">
              {currentQuestion.question}
            </h2>

            {/* 选项 */}
            <div className="grid gap-3 mb-6">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  disabled={result !== null}
                  className={`
                    p-6 rounded-xl text-center transition-all duration-200 border-3 font-bold text-lg
                    ${result === 'correct' && option === currentQuestion.correctAnswer
                      ? 'bg-green-500 border-green-600 text-white scale-105'
                      : result === 'wrong' && option !== currentQuestion.correctAnswer
                      ? 'bg-red-500 border-red-600 text-white'
                      : result === 'wrong' && option === currentQuestion.correctAnswer
                      ? 'bg-green-200 border-green-300 text-green-800'
                      : result !== null
                      ? 'bg-gray-100 border-gray-300 cursor-not-allowed'
                      : 'bg-white border-gray-300 hover:border-purple-500 hover:shadow-lg cursor-pointer'
                    }
                  `}
                >
                  {option}
                </button>
              ))}
            </div>

            {/* 进度条 */}
            <div className="mt-6">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          25% { transform: translateX(-5px) rotate(-5deg); }
          75% { transform: translateX(5px) rotate(5deg); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}
