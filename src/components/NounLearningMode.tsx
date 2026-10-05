'use client';

import { useState, useEffect } from 'react';
import { BaseQuestion, BaseLevel } from '@/types/common';
import { LevelGenerator } from '@/lib/level-generator';

interface NounLearningModeProps {
  level: BaseLevel;
  questions: BaseQuestion[];
  moduleType?: 'polysemy' | 'chunks' | 'inversion' | 'nounClause' | 'culture';
  onComplete: (weaponLevel: number, wrongAnswers: Array<{ question: BaseQuestion; userAnswer: string }>) => void;
  onBack: () => void;
}

const weapons = [
  { name: '木剑', emoji: '🪵', level: 0, damage: 15 },
  { name: '铁剑', emoji: '⚔️', level: 1, damage: 20 },
  { name: '钢剑', emoji: '🗡️', level: 2, damage: 25 },
  { name: '精钢剑', emoji: '⚡', level: 3, damage: 30 },
  { name: '光剑', emoji: '✨', level: 4, damage: 40 },
];

export default function NounLearningMode({ level, questions, moduleType = 'nounClause', onComplete, onBack }: NounLearningModeProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null);
  const [weaponLevel, setWeaponLevel] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [wrongAnswers, setWrongAnswers] = useState<Array<{ question: BaseQuestion; userAnswer: string }>>([]);

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const currentWeapon = weapons[Math.min(weaponLevel, 4)];

  useEffect(() => {
    setSelectedOption(null);
    setResult(null);
  }, [currentQuestionIndex]);

  const handleOptionSelect = (option: string) => {
    if (result) return;
    setSelectedOption(option);
  };

  const handleSubmit = () => {
    if (!selectedOption) return;

    const isCorrect = selectedOption === currentQuestion.correctAnswer;

    // 使用LevelGenerator处理答题结果
    LevelGenerator.handleAnswer(currentQuestion, selectedOption, isCorrect, moduleType);

    if (isCorrect) {
      setResult('correct');
      setWeaponLevel(prev => Math.min(prev + 1, 4));
    } else {
      setResult('wrong');
      // 记录错题
      setWrongAnswers(prev => [
        ...prev,
        { question: currentQuestion, userAnswer: selectedOption }
      ]);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setShowSummary(true);
    }
  };

  const handleComplete = () => {
    onComplete(weaponLevel, wrongAnswers);
  };

  if (showSummary) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">学习完成！</h2>

          <div className="text-center mb-8">
            <div className="text-8xl mb-4 animate-pulse">{currentWeapon.emoji}</div>
            <div className="text-2xl font-bold text-gray-800 mb-2">获得武器</div>
            <div className="text-xl text-blue-600">{currentWeapon.name}</div>
          </div>

          <div className="bg-blue-50 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-3">武器等级</h3>
            <div className="flex justify-center gap-2 mb-4">
              {weapons.map((weapon, index) => (
                <div
                  key={index}
                  className={`
                    w-12 h-12 rounded-lg flex items-center justify-center text-2xl
                    ${index <= weaponLevel
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-400'
                    }
                  `}
                >
                  {weapon.emoji}
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-600 text-center">
              武器等级越高，在战斗中造成的伤害越大！
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-3">学习统计</h3>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-green-600">{totalQuestions - wrongAnswers.length}</div>
                <div className="text-sm text-gray-600">正确</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-red-600">{wrongAnswers.length}</div>
                <div className="text-sm text-gray-600">错误</div>
              </div>
            </div>
          </div>

          <button
            onClick={handleComplete}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-xl text-xl font-bold hover:from-blue-700 hover:to-green-700 transition-all"
          >
            开始战斗 ⚔️
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 进度条 */}
      <div className="max-w-2xl mx-auto mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">
            Level {level.id} - {level.worldName} - 学习模式
          </span>
          <span className="text-sm text-gray-600">
            {currentQuestionIndex + 1} / {totalQuestions}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* 武器状态 */}
      <div className="max-w-2xl mx-auto mb-6 bg-white rounded-xl shadow-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-4xl">{currentWeapon.emoji}</div>
            <div>
              <div className="text-sm text-gray-600">当前武器</div>
              <div className="font-bold text-gray-800">{currentWeapon.name}</div>
            </div>
          </div>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            返回
          </button>
        </div>
      </div>

      {/* 规则摘要 */}
      <div className="max-w-2xl mx-auto mb-6 bg-blue-50 rounded-xl p-4">
        <h3 className="font-bold text-gray-800 mb-2">📘 核心规则</h3>
        <p className="text-sm text-gray-700">
          {level.worldId === 1 && "主语从句：that 不充当成分，无意义；what 充当成分，有具体意义；whether/if 表示'是否'。"}
          {level.worldId === 2 && "宾语从句：that 在动词后可省略，介词后不可省略；whether vs if 注意区别。"}
          {level.worldId === 3 && "表语从句：系动词后接从句；as if/because 引导特殊表语从句。"}
          {level.worldId === 4 && "同位语从句：fact/idea/belief/promise 等抽象名词后接 that 从句；注意与定语从句区分。"}
        </p>
      </div>

      {/* 题目卡片 */}
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* 题目 */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 leading-relaxed">
              {currentQuestion.question}
            </h2>
          </div>

          {/* 提示信息 */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <p className="text-sm text-yellow-800">
              💡 请选择正确的连接词（单选）
            </p>
          </div>

          {/* 选项列表 */}
          <div className="grid gap-3 mb-6">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleOptionSelect(option)}
                disabled={result !== null}
                className={`
                  p-4 rounded-xl text-left transition-all duration-200 border-2
                  ${selectedOption === option
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'bg-white border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                  }
                  ${result !== null ? 'cursor-not-allowed' : 'cursor-pointer'}
                  ${result === 'correct' && option === currentQuestion.correctAnswer
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : ''}
                  ${result === 'wrong' && option === selectedOption
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : ''}
                  ${result === 'wrong' && option === currentQuestion.correctAnswer
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : ''}
                `}
              >
                <div className="flex items-center gap-3">
                  <span className={`
                    w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                    ${selectedOption === option
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                    }
                  `}>
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="flex-1 font-medium">{option}</span>
                  {selectedOption === option && (
                    <span className="text-2xl">✓</span>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* 结果反馈 */}
          {result && (
            <div className={`
              rounded-xl p-6 mb-6 text-center animate-in slide-in-from-bottom-4
              ${result === 'correct' ? 'bg-green-100 border-2 border-green-500' : ''}
              ${result === 'wrong' ? 'bg-gray-100 border-2 border-gray-400' : ''}
            `}>
              {result === 'correct' && (
                <>
                  <div className="text-4xl mb-2">✨</div>
                  <h3 className="text-2xl font-bold text-green-700 mb-2">完美升级！</h3>
                  <p className="text-green-600">武器强化 +1</p>
                </>
              )}
              {result === 'wrong' && (
                <>
                  <div className="text-4xl mb-2">💭</div>
                  <h3 className="text-2xl font-bold text-gray-700 mb-2">继续努力</h3>
                  <p className="text-gray-600">答案已记录，将在回顾中查看</p>
                </>
              )}
            </div>
          )}

          {/* 操作按钮 */}
          <div className="flex gap-4">
            {!result ? (
              <button
                onClick={handleSubmit}
                disabled={!selectedOption}
                className="flex-1 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                提交答案
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex-1 py-4 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors"
              >
                {currentQuestionIndex < totalQuestions - 1 ? '下一个' : '完成'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
