// 游戏核心类型定义

export interface Word {
  word: string;
  meanings: string[];
  options: Array<{ key: string; meaning: string }>;
  examples: Array<{ number: string; content: string }>;
}

export interface GroupData {
  id: number;
  name: string;
  words: Word[];
}

export type GameMode = 'home' | 'learning' | 'practice' | 'victory' | 'defeat';

// 错误记录类型（学习模式使用）
export interface ErrorRecord {
  word: string;
  selectedWrong: string[];
  missedCorrect: string[];
}

// 练习模式错误记录类型
export interface PracticeErrorRecord {
  word: string;
  example: string;
  selectedWrong: string;
  correctAnswer: string;
}

export interface GameState {
  currentGroup: number;
  currentWordIndex: number;
  weaponLevel: number;
  playerHP: number;
  monsterHP: number;
  unlockedLevels: number[];
}
