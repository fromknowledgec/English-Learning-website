// 通用的题目类型定义
export interface BaseQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface BaseLevel {
  id: number;
  worldId: number;
  worldName: string;
  name: string;
  description: string;
  questions: number[];
  learningQuestions: number[];
  practiceQuestions: number[];
}
