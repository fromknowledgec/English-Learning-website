import { BaseQuestion, BaseLevel } from '@/types/common';
import { progressManager } from './progress-manager';

/**
 * 关卡生成器 - 用于生成包含错词复习的关卡题目
 */
export class LevelGenerator {
  /**
   * 为关卡生成练习题目（优先包含错词复习）
   * @param level 关卡信息
   * @param allQuestions 所有题目库
   * @param moduleType 模块类型
   * @returns 生成的题目列表
   */
  static generatePracticeQuestions(
    level: BaseLevel,
    allQuestions: BaseQuestion[],
    moduleType: 'polysemy' | 'chunks' | 'inversion' | 'nounClause' | 'culture'
  ): BaseQuestion[] {
    // 获取该模块的错词
    const wrongWords = progressManager.getWrongWords(moduleType);
    
    // 从关卡原始题目中排除错词
    const levelQuestionIds = new Set(level.practiceQuestions);
    const levelQuestions = allQuestions.filter(q => levelQuestionIds.has(q.id));
    
    // 将错词转换为题目
    const wrongWordQuestions: BaseQuestion[] = wrongWords
      .filter(w => w.metadata && w.metadata.correctAnswer)
      .map(w => ({
        id: 0, // 临时ID
        question: w.word,
        options: w.metadata?.options || [],
        correctAnswer: Array.isArray(w.metadata?.correctAnswer)
          ? w.metadata.correctAnswer.join(', ')
          : (w.metadata?.correctAnswer || ''),
        difficulty: 'medium' as const,
      }));

    // 优先使用错词，不足时补充关卡原始题目
    const targetCount = level.practiceQuestions.length;
    const wrongWordsCount = Math.min(wrongWordQuestions.length, Math.floor(targetCount * 0.7)); // 最多70%错词
    
    const selectedWrongWords = wrongWordQuestions.slice(0, wrongWordsCount);
    const remainingCount = targetCount - wrongWordsCount;
    
    // 随机选择关卡原始题目
    const originalQuestions = levelQuestions
      .sort(() => Math.random() - 0.5)
      .slice(0, remainingCount);

    // 混合错词和原始题目，错词优先
    const finalQuestions: BaseQuestion[] = [];
    const wrongWordIterator = selectedWrongWords[Symbol.iterator]();
    const originalIterator = originalQuestions[Symbol.iterator]();
    
    for (let i = 0; i < targetCount; i++) {
      const wrongWordResult = wrongWordIterator.next();
      const originalResult = originalIterator.next();
      
      if (i < wrongWordsCount && !wrongWordResult.done) {
        finalQuestions.push(wrongWordResult.value);
      } else if (!originalResult.done) {
        finalQuestions.push(originalResult.value);
      } else {
        // 如果还不够，从错词库继续取
        const extraWrongWord = wrongWordIterator.next();
        if (!extraWrongWord.done) {
          finalQuestions.push(extraWrongWord.value);
        }
      }
    }

    return finalQuestions;
  }

  /**
   * 生成学习阶段的题目（从错词库排除，确保新题优先）
   * @param level 关卡信息
   * @param allQuestions 所有题目库
   * @param moduleType 模块类型
   * @returns 生成的题目列表
   */
  static generateLearningQuestions(
    level: BaseLevel,
    allQuestions: BaseQuestion[],
    moduleType: 'polysemy' | 'chunks' | 'inversion' | 'nounClause' | 'culture'
  ): BaseQuestion[] {
    // 学习阶段优先使用新题，避免重复
    const levelQuestionIds = new Set(level.learningQuestions);
    const levelQuestions = allQuestions.filter(q => levelQuestionIds.has(q.id));
    
    // 获取错词题目ID
    const wrongWords = progressManager.getWrongWords(moduleType);
    const wrongQuestionIds = new Set(
      wrongWords
        .map(w => {
          // 尝试找到对应题目的ID
          const matchedQuestion = levelQuestions.find(q => q.question === w.word);
          return matchedQuestion?.id;
        })
        .filter((id): id is number => id !== undefined)
    );

    // 排除错词，优先使用新题
    const newQuestions = levelQuestions.filter(q => !wrongQuestionIds.has(q.id));
    
    // 如果新题不足，补充错词
    const targetCount = level.learningQuestions.length;
    const newQuestionsCount = Math.min(newQuestions.length, Math.floor(targetCount * 0.8)); // 80%新题
    
    const selectedNewQuestions = newQuestions.slice(0, newQuestionsCount);
    const remainingCount = targetCount - newQuestionsCount;
    
    // 补充错词
    const wrongWordQuestions = levelQuestions.filter(q => wrongQuestionIds.has(q.id));
    const additionalWrongWords = wrongWordQuestions.sort(() => Math.random() - 0.5).slice(0, remainingCount);

    return [...selectedNewQuestions, ...additionalWrongWords];
  }

  /**
   * 处理答题结果，更新错词库
   * @param question 题目
   * @param userAnswer 用户答案
   * @param isCorrect 是否正确
   * @param moduleType 模块类型
   */
  static handleAnswer(
    question: BaseQuestion,
    userAnswer: string,
    isCorrect: boolean,
    moduleType: 'polysemy' | 'chunks' | 'inversion' | 'nounClause' | 'culture'
  ) {
    if (isCorrect) {
      // 答对了，记录正确次数
      progressManager.recordCorrect(question.question, moduleType);
    } else {
      // 答错了，记录错误
      progressManager.recordError(
        question.question,
        moduleType,
        {
          translation: question.options,
          correctAnswer: question.correctAnswer,
        }
      );
    }
  }

  /**
   * 获取错词库统计信息
   * @param moduleType 模块类型
   * @returns 统计信息
   */
  static getWrongWordsStats(moduleType: 'polysemy' | 'chunks' | 'inversion' | 'nounClause' | 'culture') {
    const wrongWords = progressManager.getWrongWords(moduleType);
    const stats = progressManager.getWrongWordsStats();

    return {
      ...stats,
      wrongWords, // 详细列表
      moduleType,
    };
  }

  /**
   * 检查是否需要错词复习（关卡2及以后）
   * @param levelId 关卡ID
   * @returns 是否需要错词复习
   */
  static shouldIncludeWrongWords(levelId: number): boolean {
    // 关卡2及以后需要包含错词复习
    return levelId >= 2;
  }
}
