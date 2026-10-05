'use client';

import { UserProgress, ModuleProgress, WrongWord, WrongWordsDB, ModuleType, ExerciseProgress, ExerciseProgressStorage, ExerciseStatus } from '@/types/progress';

const STORAGE_KEYS = {
  USER_PROGRESS: 'english_learning_progress',
  WRONG_WORDS_DB: 'english_wrong_words_db',
  CURRENT_SESSION: 'current_session',
  EXERCISE_PROGRESS: 'exercise_progress',
};

/**
 * 进度持久化管理器
 */
export class ProgressManager {
  private static instance: ProgressManager;
  private currentProgress: UserProgress | null = null;
  private wrongWordsDB: WrongWordsDB | null = null;

  private constructor() {
    this.loadFromStorage();
  }

  public static getInstance(): ProgressManager {
    if (!ProgressManager.instance) {
      ProgressManager.instance = new ProgressManager();
    }
    return ProgressManager.instance;
  }

  /**
   * 从localStorage加载进度
   */
  private loadFromStorage() {
    // 检查是否在浏览器环境中
    if (typeof window === 'undefined') {
      return;
    }

    try {
      const progressStr = localStorage.getItem(STORAGE_KEYS.USER_PROGRESS);
      if (progressStr) {
        this.currentProgress = JSON.parse(progressStr);
      }

      const wrongWordsStr = localStorage.getItem(STORAGE_KEYS.WRONG_WORDS_DB);
      if (wrongWordsStr) {
        this.wrongWordsDB = JSON.parse(wrongWordsStr);
      }
    } catch (error) {
      console.error('Failed to load progress from storage:', error);
      this.currentProgress = null;
      this.wrongWordsDB = null;
    }
  }

  /**
   * 保存进度到localStorage
   */
  public saveProgress() {
    // 检查是否在浏览器环境中
    if (typeof window === 'undefined') {
      return;
    }

    if (this.currentProgress) {
      this.currentProgress.lastSaved = Date.now();
      localStorage.setItem(STORAGE_KEYS.USER_PROGRESS, JSON.stringify(this.currentProgress));
    }

    if (this.wrongWordsDB) {
      this.wrongWordsDB.lastUpdated = Date.now();
      localStorage.setItem(STORAGE_KEYS.WRONG_WORDS_DB, JSON.stringify(this.wrongWordsDB));
    }
  }

  /**
   * 获取当前进度
   */
  public getProgress(): UserProgress | null {
    return this.currentProgress;
  }

  /**
   * 检查是否有保存的进度
   */
  public hasSavedProgress(): boolean {
    return this.currentProgress !== null && this.currentProgress.modules !== undefined;
  }

  /**
   * 更新模块进度
   */
  public updateModuleProgress(
    moduleType: keyof ModuleProgress,
    updates: Partial<ModuleProgress[keyof ModuleProgress]>
  ) {
    if (!this.currentProgress) {
      this.currentProgress = {
        userId: this.generateUserId(),
        lastSaved: Date.now(),
        modules: {},
      };
    }

    if (!this.currentProgress.modules[moduleType]) {
      this.currentProgress.modules[moduleType] = {
        currentLevel: 1,
        completedLevels: [],
        answeredQuestions: [],
        correctQuestions: [],
        weaponLevel: 0,
        playerHP: 100,
        monsterHP: 100,
        errorRecords: [],
      };
    }

    this.currentProgress.modules[moduleType] = {
      ...this.currentProgress.modules[moduleType],
      ...updates,
    };

    this.saveProgress();
  }

  /**
   * 获取模块进度
   */
  public getModuleProgress(moduleType: keyof ModuleProgress) {
    return this.currentProgress?.modules[moduleType] || null;
  }

  /**
   * 完成关卡
   */
  public completeLevel(moduleType: keyof ModuleProgress, levelId: number) {
    const module = this.currentProgress?.modules[moduleType];
    if (module) {
      if (!module.completedLevels.includes(levelId)) {
        module.completedLevels.push(levelId);
      }
      this.saveProgress();
    }
  }

  /**
   * 记录答对的题目ID
   */
  public recordCorrectQuestion(questionId: number, moduleType: keyof ModuleProgress) {
    if (!this.currentProgress) {
      this.currentProgress = {
        userId: this.generateUserId(),
        lastSaved: Date.now(),
        modules: {},
      };
    }

    const module = this.currentProgress.modules[moduleType];
    if (module) {
      // 初始化correctQuestions数组
      if (!module.correctQuestions) {
        module.correctQuestions = [];
      }

      // 如果题目ID不在已答对列表中，则添加
      if (!module.correctQuestions.includes(questionId)) {
        module.correctQuestions.push(questionId);
        this.saveProgress();
      }
    }
  }

  /**
   * 获取已答对的题目ID列表
   */
  public getCorrectQuestions(moduleType: keyof ModuleProgress): number[] {
    const module = this.currentProgress?.modules[moduleType];
    return module?.correctQuestions || [];
  }

  /**
   * 检查题目是否已答对
   */
  public isQuestionCorrect(questionId: number, moduleType: keyof ModuleProgress): boolean {
    const correctQuestions = this.getCorrectQuestions(moduleType);
    return correctQuestions.includes(questionId);
  }

  /**
   * 记录答题错误（用于错词库）
   */
  public recordError(
    word: string,
    moduleType: ModuleType,
    metadata?: WrongWord['metadata']
  ) {
    if (!this.wrongWordsDB) {
      this.wrongWordsDB = {
        words: [],
        lastUpdated: Date.now(),
      };
    }

    // 查找是否已存在该错词
    let wrongWord = this.wrongWordsDB.words.find(w => w.word === word && w.moduleType === moduleType);

    if (wrongWord) {
      // 更新已有错词
      wrongWord.errorCount++;
      wrongWord.lastWrongTime = Date.now();
      wrongWord.mastered = false;
    } else {
      // 添加新错词
      this.wrongWordsDB.words.push({
        word,
        errorCount: 1,
        correctCount: 0,
        reviewCount: 0,
        lastWrongTime: Date.now(),
        mastered: false,
        moduleType,
        metadata,
      });
    }

    this.saveProgress();
  }

  /**
   * 记录答对（用于错词库）
   */
  public recordCorrect(
    word: string,
    moduleType: ModuleType
  ) {
    if (!this.wrongWordsDB) {
      return;
    }

    const wrongWord = this.wrongWordsDB.words.find(w => w.word === word && w.moduleType === moduleType);

    if (wrongWord && !wrongWord.mastered) {
      wrongWord.correctCount++;
      wrongWord.lastCorrectTime = Date.now();

      // 答对3次后标记为已掌握
      if (wrongWord.correctCount >= 3) {
        wrongWord.mastered = true;
      }

      this.saveProgress();
    }
  }

  /**
   * 删除错词
   */
  public removeWrongWord(
    word: string,
    moduleType: ModuleType
  ) {
    if (!this.wrongWordsDB) {
      return;
    }

    const index = this.wrongWordsDB.words.findIndex(w => w.word === word && w.moduleType === moduleType);
    if (index !== -1) {
      this.wrongWordsDB.words.splice(index, 1);
      this.saveProgress();
    }
  }

  /**
   * 复习错题（核心方法）
   * @param word 题目内容
   * @param moduleType 模块类型
   * @param userAnswer 用户答案
   * @returns 是否答对
   */
  public reviewWrongWord(
    word: string,
    moduleType: ModuleType,
    userAnswer: string | string[]
  ): { isCorrect: boolean; correctAnswer: string | string[] | undefined } {
    if (!this.wrongWordsDB) {
      return { isCorrect: false, correctAnswer: undefined };
    }

    const wrongWord = this.wrongWordsDB.words.find(w => w.word === word && w.moduleType === moduleType);

    if (!wrongWord) {
      return { isCorrect: false, correctAnswer: undefined };
    }

    wrongWord.reviewCount++;
    wrongWord.lastReviewTime = Date.now();

    const correctAnswer = wrongWord.metadata?.correctAnswer || wrongWord.options?.[0];
    let isCorrect = false;

    if (correctAnswer) {
      if (Array.isArray(correctAnswer)) {
        const userAnswerArray = Array.isArray(userAnswer) ? userAnswer : [userAnswer];
        isCorrect = userAnswerArray.length === correctAnswer.length &&
          userAnswerArray.every((ans, idx) =>
            ans.trim().toLowerCase() === correctAnswer[idx].trim().toLowerCase()
          );
      } else {
        const userAnswerStr = Array.isArray(userAnswer) ? userAnswer.join(',') : userAnswer;
        isCorrect = userAnswerStr.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
      }
    }

    if (isCorrect) {
      wrongWord.correctCount++;
      wrongWord.lastCorrectTime = Date.now();

      if (wrongWord.correctCount >= 3) {
        wrongWord.mastered = true;
      }
    } else {
      wrongWord.errorCount++;
      wrongWord.lastWrongTime = Date.now();
    }

    this.saveProgress();
    return { isCorrect, correctAnswer };
  }

  /**
   * 获取待复习的错词（未掌握的）
   */
  public getPendingWrongWords(moduleType?: ModuleType): WrongWord[] {
    if (!this.wrongWordsDB) {
      return [];
    }

    let words = this.wrongWordsDB.words.filter(w => !w.mastered);

    if (moduleType) {
      words = words.filter(w => w.moduleType === moduleType);
    }

    return words.sort((a, b) => b.lastWrongTime - a.lastWrongTime);
  }

  /**
   * 获取已掌握的错词
   */
  public getMasteredWrongWords(moduleType?: ModuleType): WrongWord[] {
    if (!this.wrongWordsDB) {
      return [];
    }

    let words = this.wrongWordsDB.words.filter(w => w.mastered);

    if (moduleType) {
      words = words.filter(w => w.moduleType === moduleType);
    }

    return words.sort((a, b) => (b.lastCorrectTime || 0) - (a.lastCorrectTime || 0));
  }

  /**
   * 获取所有错词
   */
  public getAllWrongWords(): WrongWord[] {
    if (!this.wrongWordsDB) {
      return [];
    }
    return this.wrongWordsDB.words;
  }

  /**
   * 获取模块的错词（优先返回未掌握的）
   */
  public getWrongWords(
    moduleType: ModuleType,
    count?: number
  ): WrongWord[] {
    if (!this.wrongWordsDB) {
      return [];
    }

    // 过滤出该模块的错词，优先返回未掌握的
    const moduleWrongWords = this.wrongWordsDB.words
      .filter(w => w.moduleType === moduleType && !w.mastered)
      .sort((a, b) => b.lastWrongTime - a.lastWrongTime);

    if (count) {
      return moduleWrongWords.slice(0, count);
    }

    return moduleWrongWords;
  }

  /**
   * 获取错词库统计信息
   */
  public getWrongWordsStats() {
    if (!this.wrongWordsDB) {
      return {
        total: 0,
        mastered: 0,
        pending: 0,
      };
    }

    const total = this.wrongWordsDB.words.length;
    const mastered = this.wrongWordsDB.words.filter(w => w.mastered).length;
    const pending = total - mastered;

    return {
      total,
      mastered,
      pending,
    };
  }

  /**
   * 清除所有进度
   */
  public clearAll() {
    this.currentProgress = null;
    this.wrongWordsDB = null;

    // 检查是否在浏览器环境中
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.USER_PROGRESS);
      localStorage.removeItem(STORAGE_KEYS.WRONG_WORDS_DB);
      localStorage.removeItem(STORAGE_KEYS.CURRENT_SESSION);
    }
  }

  /**
   * 生成用户ID
   */
  private generateUserId(): string {
    if (typeof window === 'undefined') {
      return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    let userId = localStorage.getItem('user_id');
    if (!userId) {
      userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('user_id', userId);
    }
    return userId;
  }

  /**
   * 保存当前会话状态
   */
  public saveSession(sessionData: any) {
    if (typeof window === 'undefined') {
      return;
    }
    localStorage.setItem(STORAGE_KEYS.CURRENT_SESSION, JSON.stringify(sessionData));
  }

  /**
   * 获取当前会话状态
   */
  public getSession(): any {
    if (typeof window === 'undefined') {
      return null;
    }

    try {
      const sessionStr = localStorage.getItem(STORAGE_KEYS.CURRENT_SESSION);
      return sessionStr ? JSON.parse(sessionStr) : null;
    } catch {
      return null;
    }
  }

  /**
   * 清除当前会话状态
   */
  public clearSession() {
    if (typeof window === 'undefined') {
      return;
    }
    localStorage.removeItem(STORAGE_KEYS.CURRENT_SESSION);
  }

  private exerciseProgress: ExerciseProgressStorage | null = null;

  private loadExerciseProgress(): void {
    if (typeof window === 'undefined') {
      return;
    }
    try {
      const data = localStorage.getItem(STORAGE_KEYS.EXERCISE_PROGRESS);
      if (data) {
        this.exerciseProgress = JSON.parse(data);
      }
    } catch (error) {
      console.error('Failed to load exercise progress:', error);
      this.exerciseProgress = null;
    }
  }

  public saveExerciseProgress(progress: ExerciseProgress): void {
    if (typeof window === 'undefined') {
      return;
    }
    if (!this.exerciseProgress) {
      this.exerciseProgress = {};
    }
    progress.updatedAt = Date.now();
    this.exerciseProgress[progress.exerciseId] = progress;
    localStorage.setItem(STORAGE_KEYS.EXERCISE_PROGRESS, JSON.stringify(this.exerciseProgress));
  }

  public getExerciseProgress(exerciseId: string): ExerciseProgress | null {
    if (!this.exerciseProgress) {
      this.loadExerciseProgress();
    }
    return this.exerciseProgress?.[exerciseId] || null;
  }

  public hasExerciseProgress(exerciseId: string): boolean {
    if (!this.exerciseProgress) {
      this.loadExerciseProgress();
    }
    const progress = this.exerciseProgress?.[exerciseId];
    return progress !== undefined && progress !== null && progress.status === 'in_progress';
  }

  public updateExerciseAnswer(
    exerciseId: string,
    questionId: number,
    answer: string[],
    currentQuestionIndex: number,
    totalQuestions: number
  ): void {
    const existing = this.getExerciseProgress(exerciseId);
    if (existing) {
      existing.answers[questionId] = answer;
      existing.currentQuestionIndex = currentQuestionIndex;
      existing.answeredCount = Object.keys(existing.answers).length;
      this.saveExerciseProgress(existing);
    }
  }

  public completeExerciseProgress(exerciseId: string): void {
    const progress = this.getExerciseProgress(exerciseId);
    if (progress) {
      progress.status = 'completed';
      progress.completedAt = Date.now();
      progress.updatedAt = Date.now();
      this.saveExerciseProgress(progress);
    }
  }

  public clearExerciseProgress(exerciseId: string): void {
    if (typeof window === 'undefined') {
      return;
    }
    if (!this.exerciseProgress) {
      this.loadExerciseProgress();
    }
    if (this.exerciseProgress && this.exerciseProgress[exerciseId]) {
      delete this.exerciseProgress[exerciseId];
      localStorage.setItem(STORAGE_KEYS.EXERCISE_PROGRESS, JSON.stringify(this.exerciseProgress));
    }
  }

  public createExerciseProgress(
    exerciseId: string,
    moduleName: string,
    moduleType: ModuleType,
    totalQuestions: number
  ): ExerciseProgress {
    const progress: ExerciseProgress = {
      exerciseId,
      moduleName,
      moduleType,
      answers: {},
      currentQuestionIndex: 0,
      totalQuestions,
      answeredCount: 0,
      status: 'in_progress',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    this.saveExerciseProgress(progress);
    return progress;
  }

  public getExerciseProgressStats(exerciseId: string): {
    answeredCount: number;
    totalQuestions: number;
    lastUpdated: Date | null;
    status: ExerciseStatus;
  } | null {
    const progress = this.getExerciseProgress(exerciseId);
    if (!progress) {
      return null;
    }
    return {
      answeredCount: progress.answeredCount,
      totalQuestions: progress.totalQuestions,
      lastUpdated: progress.updatedAt ? new Date(progress.updatedAt) : null,
      status: progress.status,
    };
  }
}

// 导出单例
export const progressManager = ProgressManager.getInstance();
