'use client';

import { useState, useEffect } from 'react';
import { WrongWord } from '@/types/progress';
import { progressManager } from '@/lib/progress-manager';

interface Question {
  id: string;
  word: string;
  options?: string[];
  correctAnswer: string | string[];
  metadata?: {
    translation?: string[];
    example?: string;
  };
  isFromWrongWords: boolean; // 标记是否来自错词库
}

interface UseWrongWordsReviewOptions {
  moduleType: 'polysemy' | 'chunks' | 'inversion' | 'nounClause' | 'culture';
  allQuestions: Question[];
  level?: number; // 关卡编号（用于判断是否是关卡2，优先错词复习）
}

interface UseWrongWordsReviewReturn {
  reviewQuestions: Question[];
  wrongWordsStats: {
    total: number;
    mastered: number;
    pending: number;
  };
  handleAnswer: (question: Question, isCorrect: boolean, userAnswer?: string | string[]) => void;
}

/**
 * 错词复习系统Hook
 *
 * 逻辑说明：
 * 1. 关卡1：答错的词汇自动存入错词库
 * 2. 关卡2：优先从错词库中抽取词汇进行测试
 * 3. 答对3次后从错词库移除，答错则保留并增加计数
 * 4. 错词库不足时补充新词汇
 */
export function useWrongWordsReview({
  moduleType,
  allQuestions,
  level = 1,
}: UseWrongWordsReviewOptions): UseWrongWordsReviewReturn {
  const [reviewQuestions, setReviewQuestions] = useState<Question[]>([]);

  // 获取错词库统计信息
  const wrongWordsStats = progressManager.getWrongWordsStats();

  useEffect(() => {
    generateQuestions();
  }, [moduleType, allQuestions, level]);

  /**
   * 生成题目（根据关卡决定策略）
   */
  const generateQuestions = () => {
    let questions: Question[] = [];

    if (level === 2) {
      // 关卡2：优先从错词库中抽取词汇
      const wrongWords = progressManager.getWrongWords(moduleType);

      if (wrongWords.length > 0) {
        // 从错词库生成题目
        questions = wrongWords.map(word => ({
          id: `wrong_${word.word}`,
          word: word.word,
          options: word.metadata?.options,
          correctAnswer: word.metadata?.translation || [],
          metadata: word.metadata,
          isFromWrongWords: true,
        }));

        // 如果错词库不足，补充新词汇
        if (questions.length < allQuestions.length) {
          const additionalCount = allQuestions.length - questions.length;
          const usedWords = new Set(questions.map(q => q.word));

          const additionalQuestions = allQuestions
            .filter(q => !usedWords.has(q.word))
            .slice(0, additionalCount)
            .map(q => ({
              ...q,
              isFromWrongWords: false,
            }));

          questions = [...questions, ...additionalQuestions];
        }
      } else {
        // 错词库为空，使用新词汇
        questions = allQuestions.map(q => ({
          ...q,
          isFromWrongWords: false,
        }));
      }
    } else {
      // 关卡1：使用新词汇
      questions = allQuestions.map(q => ({
        ...q,
        isFromWrongWords: false,
      }));
    }

    setReviewQuestions(questions);
  };

  /**
   * 处理答题
   */
  const handleAnswer = (
    question: Question,
    isCorrect: boolean,
    userAnswer?: string | string[]
  ) => {
    if (question.isFromWrongWords) {
      // 如果是错词库的题目
      if (isCorrect) {
        progressManager.recordCorrect(question.word, moduleType);

        // 检查是否已掌握（答对3次）
        const wrongWord = progressManager
          .getWrongWords(moduleType)
          .find(w => w.word === question.word);

        if (wrongWord && wrongWord.mastered) {
          // 从当前题目列表中移除已掌握的词汇
          setReviewQuestions(prev => prev.filter(q => q.id !== question.id));
        }
      } else {
        // 答错，增加错误计数
        progressManager.recordError(
          question.word,
          moduleType,
          question.metadata
        );
      }
    } else {
      // 如果是新词汇
      if (!isCorrect) {
        // 答错，加入错词库
        progressManager.recordError(
          question.word,
          moduleType,
          question.metadata
        );
      }
    }
  };

  return {
    reviewQuestions,
    wrongWordsStats,
    handleAnswer,
  };
}

/**
 * 辅助函数：获取词汇来源标签
 */
export function getQuestionSourceLabel(isFromWrongWords: boolean): string {
  return isFromWrongWords ? '🔄 复习词' : '🆕 新词';
}

/**
 * 辅助函数：显示错词库统计
 */
export function formatWrongWordsStats(stats: { total: number; mastered: number; pending: number }): string {
  if (stats.total === 0) {
    return '错词库为空';
  }
  return `错词库: ${stats.pending}个待复习 / ${stats.mastered}个已掌握`;
}
