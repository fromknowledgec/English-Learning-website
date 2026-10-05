// 进度持久化系统类型定义

// 模块类型联合类型
export type ModuleType =
  | 'sSpelling'              // -s的读音及拼写
  | 'edSpelling'             // -ed读音及拼写
  | 'ingSpelling'            // -ing拼写
  | 'britishAmericanDiff'    // 英式英语与美式英语的区别
  | 'sentenceAnalysis'       // 句子成分分析
  | 'irregularVerbs'         // 不规则动词变化考查
  | 'chunks'                 // 词块考查
  | 'tenseVoice'             // 时态语态考查
  | 'attributiveClause'      // 定语从句过关
  | 'britishAmericanCulture' // 英美文化常识
  | 'culture'                // 英美文化（britishAmericanCulture的别名）
  | 'inversion'              // 倒装
  | 'nounClause'             // 名词性从句
  | 'polysemy';              // 一词多义

export interface UserProgress {
  // 用户ID（用于区分不同用户）
  userId?: string;
  // 最后保存时间
  lastSaved: number;
  // 各模块的进度
  modules: ModuleProgress;
}

export interface ModuleProgress {
  // -s的读音及拼写模块
  sSpelling?: ModuleState;
  // -ed读音及拼写模块
  edSpelling?: ModuleState;
  // -ing拼写模块
  ingSpelling?: ModuleState;
  // 英式英语与美式英语的区别模块
  britishAmericanDiff?: ModuleState;
  // 句子成分分析模块
  sentenceAnalysis?: ModuleState;
  // 不规则动词变化考查模块
  irregularVerbs?: ModuleState;
  // 词块考查模块
  chunks?: ModuleState;
  // 时态语态考查模块
  tenseVoice?: ModuleState;
  // 定语从句过关模块
  attributiveClause?: ModuleState;
  // 英美文化常识模块
  britishAmericanCulture?: ModuleState;
  // 英美文化模块（britishAmericanCulture的别名）
  culture?: ModuleState;
  // 倒装模块
  inversion?: ModuleState;
  // 名词性从句模块
  nounClause?: ModuleState;
  // 一词多义模块
  polysemy?: ModuleState;
}

export interface ModuleState {
  // 当前关卡
  currentLevel: number;
  // 已完成关卡
  completedLevels: number[];
  // 已答题目索引
  answeredQuestions: number[];
  // 已答对题目索引
  correctQuestions: number[];
  // 武器等级（一词多义、词块模块使用）
  weaponLevel?: number;
  // 玩家血量
  playerHP?: number;
  // 怪物血量
  monsterHP?: number;
  // 错误记录
  errorRecords?: ErrorRecord[];
}

export interface ErrorRecord {
  // 题目内容/单词
  word: string;
  // 错误时间
  timestamp: number;
  // 错误次数
  errorCount: number;
  // 最后一次错误时用户的选择
  userAnswer?: string | string[];
  // 正确答案
  correctAnswer?: string | string[];
  // 是否已掌握（答对3次后为true）
  mastered: boolean;
  // 模块类型
  moduleType: ModuleType;
}

// 题目类型
export type QuestionType = 'fill' | 'choice' | 'analysis';

// 错词库类型定义
export interface WrongWord {
  // 词汇/题目内容
  word: string;
  // 错误次数
  errorCount: number;
  // 正确次数
  correctCount: number;
  // 复习次数
  reviewCount: number;
  // 最后一次答对时间
  lastCorrectTime?: number;
  // 最后一次答错时间
  lastWrongTime: number;
  // 最后一次复习时间
  lastReviewTime?: number;
  // 是否已掌握（答对3次后从错词库移除）
  mastered: boolean;
  // 所属模块
  moduleType: ModuleType;
  // 题目类型
  questionType?: QuestionType;
  // 选项（选择题时使用）
  options?: string[];
  // 附加信息（如翻译、例句等）
  metadata?: {
    translation?: string[];
    example?: string;
    options?: string[];
    correctAnswer?: string | string[];
    userAnswer?: string | string[];
    explanation?: string;
    questionType?: QuestionType;
  };
}

export interface WrongWordsDB {
  // 错词库
  words: WrongWord[];
  // 最后更新时间
  lastUpdated: number;
}

export type ExerciseStatus = 'in_progress' | 'completed' | 'abandoned';

export interface ExerciseProgress {
  exerciseId: string;
  moduleName: string;
  moduleType: ModuleType;
  answers: Record<number, string[]>;
  currentQuestionIndex: number;
  totalQuestions: number;
  answeredCount: number;
  status: ExerciseStatus;
  createdAt: number;
  updatedAt: number;
  completedAt?: number;
}

export interface ExerciseProgressStorage {
  [key: string]: ExerciseProgress;
}
