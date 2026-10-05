export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  type: 'subject' | 'object' | 'predicative' | 'appositive';
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface Level {
  id: number;
  worldId: number;
  worldName: string;
  name: string;
  description: string;
  questions: number[];
  learningQuestions: number[];
  practiceQuestions: number[];
}

export interface KnowledgePoint {
  worldId: number;
  worldName: string;
  description: string;
  keyRules: string[];
  examples: string[];
}

// 60道题目数据
export const questions: Question[] = [
  // World 1: 主语从句 (1-15)
  { id: 1, question: "________ we succeed or fail depends on our effort and perseverance.", options: ["That", "What", "Whether", "If"], correctAnswer: "Whether", type: "subject", difficulty: "easy" },
  { id: 2, question: "________ remains important is that we have an incredible desire to think and create.", options: ["That", "What", "Which", "Who"], correctAnswer: "What", type: "subject", difficulty: "medium" },
  { id: 3, question: "________ has helped to save the drowning girl is worth praising.", options: ["Who", "Whoever", "Whomever", "Which"], correctAnswer: "Whoever", type: "subject", difficulty: "medium" },
  { id: 4, question: "________ he got the first prize in the English Contest surprised all of us.", options: ["That", "What", "Which", "How"], correctAnswer: "That", type: "subject", difficulty: "easy" },
  { id: 5, question: "However, it is likely ________ Native Americans were living in California at least fifteen thousand years ago.", options: ["that", "what", "which", "how"], correctAnswer: "that", type: "subject", difficulty: "medium" },
  { id: 6, question: "________ is well-known to us all is that China is rich in natural resources.", options: ["That", "What", "Which", "Who"], correctAnswer: "What", type: "subject", difficulty: "easy" },
  { id: 7, question: "________ he will come or not is still unknown.", options: ["If", "Whether", "That", "What"], correctAnswer: "Whether", type: "subject", difficulty: "easy" },
  { id: 8, question: "________ makes the book so extraordinary is the creative imagination of the writer.", options: ["That", "What", "Which", "Who"], correctAnswer: "What", type: "subject", difficulty: "medium" },
  { id: 9, question: "________ team will win the match is hard to predict.", options: ["That", "What", "Which", "Who"], correctAnswer: "Which", type: "subject", difficulty: "medium" },
  { id: 10, question: "________ I need is more time.", options: ["That", "What", "Which", "Who"], correctAnswer: "What", type: "subject", difficulty: "easy" },
  { id: 11, question: "________ breaks the law will be punished.", options: ["Who", "Whoever", "Whomever", "Which"], correctAnswer: "Whoever", type: "subject", difficulty: "medium" },
  { id: 12, question: "________ caused the accident is still under investigation.", options: ["That", "What", "Which", "How"], correctAnswer: "What", type: "subject", difficulty: "medium" },
  { id: 13, question: "________ we should do next has not been decided yet.", options: ["That", "What", "Which", "How"], correctAnswer: "What", type: "subject", difficulty: "easy" },
  { id: 14, question: "________ matters most is your attitude.", options: ["That", "What", "Which", "How"], correctAnswer: "What", type: "subject", difficulty: "easy" },
  { id: 15, question: "________ is certain is that the situation will improve.", options: ["That", "What", "Which", "Who"], correctAnswer: "What", type: "subject", difficulty: "medium" },

  // World 2: 宾语从句 (16-30)
  { id: 16, question: "From the bursts of laughter, it was apparent ________ they were having a good time.", options: ["that", "what", "which", "how"], correctAnswer: "that", type: "object", difficulty: "easy" },
  { id: 17, question: "I'm surprised at ________ he said at the meeting.", options: ["that", "what", "which", "how"], correctAnswer: "what", type: "object", difficulty: "easy" },
  { id: 18, question: "One cannot help but wonder ________ the man was holding.", options: ["that", "what", "which", "how"], correctAnswer: "what", type: "object", difficulty: "medium" },
  { id: 19, question: "They are ________ young people and traditional Chinese culture blend (融合).", options: ["that", "what", "where", "how"], correctAnswer: "where", type: "object", difficulty: "medium" },
  { id: 20, question: "There is evidence ________ urban racoons are more intelligent.", options: ["that", "what", "which", "how"], correctAnswer: "that", type: "object", difficulty: "easy" },
  { id: 21, question: "Mental health involves ________ you process things such as stress and anxiety.", options: ["that", "what", "which", "how"], correctAnswer: "how", type: "object", difficulty: "medium" },
  { id: 22, question: "Please return the tool to ________ it belongs to.", options: ["who", "whomever", "whoever", "that"], correctAnswer: "whoever", type: "object", difficulty: "medium" },
  { id: 23, question: "There is some doubt ________ she will come tomorrow.", options: ["that", "what", "whether", "how"], correctAnswer: "whether", type: "object", difficulty: "easy" },
  { id: 24, question: "You can visit a tea plantation in Hangzhou to learn ________ tea is grown and harvested.", options: ["that", "what", "how", "where"], correctAnswer: "how", type: "object", difficulty: "medium" },
  { id: 25, question: "Some teens can appreciate ________ high school is so important.", options: ["that", "what", "why", "how"], correctAnswer: "why", type: "object", difficulty: "medium" },
  { id: 26, question: "I don't know ________ he will agree with the plan.", options: ["that", "whether", "what", "how"], correctAnswer: "whether", type: "object", difficulty: "easy" },
  { id: 27, question: "Could you tell me ________ the nearest post office is?", options: ["that", "what", "where", "how"], correctAnswer: "where", type: "object", difficulty: "easy" },
  { id: 28, question: "She asked me ________ I had finished the work.", options: ["that", "whether", "what", "how"], correctAnswer: "whether", type: "object", difficulty: "easy" },
  { id: 29, question: "I wonder ________ he didn't come to the party.", options: ["that", "what", "why", "how"], correctAnswer: "why", type: "object", difficulty: "easy" },
  { id: 30, question: "He promised ________ he would never tell anyone the secret.", options: ["that", "what", "which", "how"], correctAnswer: "that", type: "object", difficulty: "easy" },

  // World 3: 表语从句 (31-45)
  { id: 31, question: "The idea ________ you can make progress without hard work is quite wrong.", options: ["that", "what", "which", "how"], correctAnswer: "that", type: "predicative", difficulty: "easy" },
  { id: 32, question: "That is ________ it is a comprehensive art.", options: ["that", "what", "why", "how"], correctAnswer: "why", type: "predicative", difficulty: "medium" },
  { id: 33, question: "Perhaps that is ________ makes it such a tasty dish.", options: ["that", "what", "which", "how"], correctAnswer: "what", type: "predicative", difficulty: "medium" },
  { id: 34, question: "This is ________ they need an English trainer.", options: ["that", "what", "why", "how"], correctAnswer: "why", type: "predicative", difficulty: "medium" },
  { id: 35, question: "And this is ________ I disagree.", options: ["that", "what", "where", "how"], correctAnswer: "where", type: "predicative", difficulty: "medium" },
  { id: 36, question: "The question remains ________ we can trust him.", options: ["that", "what", "whether", "how"], correctAnswer: "whether", type: "predicative", difficulty: "easy" },
  { id: 37, question: "He looks as if he were from Mars.", options: ["This is a predicative clause", "This is an object clause", "This is a subject clause", "This is an appositive clause"], correctAnswer: "This is a predicative clause", type: "predicative", difficulty: "medium" },
  { id: 38, question: "That may be because I didn't have a good sleep yesterday evening.", options: ["This is a predicative clause", "This is an object clause", "This is a subject clause", "This is an appositive clause"], correctAnswer: "This is a predicative clause", type: "predicative", difficulty: "medium" },
  { id: 39, question: "The truth is ________ he never called.", options: ["that", "what", "which", "how"], correctAnswer: "that", type: "predicative", difficulty: "easy" },
  { id: 40, question: "My concern is ________ we should do next.", options: ["that", "what", "which", "how"], correctAnswer: "what", type: "predicative", difficulty: "easy" },
  { id: 41, question: "The problem is ________ we don't have enough money.", options: ["that", "what", "which", "how"], correctAnswer: "that", type: "predicative", difficulty: "easy" },
  { id: 42, question: "The fact remains ________ nothing has changed.", options: ["that", "what", "which", "how"], correctAnswer: "that", type: "predicative", difficulty: "easy" },
  { id: 43, question: "What surprised me most was ________ he said.", options: ["that", "what", "which", "how"], correctAnswer: "what", type: "predicative", difficulty: "medium" },
  { id: 44, question: "His explanation is ________ he was ill.", options: ["that", "what", "which", "how"], correctAnswer: "that", type: "predicative", difficulty: "easy" },
  { id: 45, question: "The reason is ________ the traffic was heavy.", options: ["that", "what", "which", "how"], correctAnswer: "that", type: "predicative", difficulty: "easy" },

  // World 4: 同位语从句 (46-60)
  { id: 46, question: "The idea ________ he proposed was brilliant.", options: ["This is an appositive clause", "This is an attributive clause", "This is an object clause", "This is a subject clause"], correctAnswer: "This is an attributive clause", type: "appositive", difficulty: "medium" },
  { id: 47, question: "He made a promise ________ he would return soon.", options: ["This is an appositive clause", "This is an attributive clause", "This is an object clause", "This is a subject clause"], correctAnswer: "This is an appositive clause", type: "appositive", difficulty: "medium" },
  { id: 48, question: "Analysis of cutting marks on some head statues led to the guess ________ they may have been stolen about 30 years ago.", options: ["that", "what", "which", "how"], correctAnswer: "that", type: "appositive", difficulty: "medium" },
  { id: 49, question: "I have no idea ________ she will accept it.", options: ["that", "what", "whether", "how"], correctAnswer: "whether", type: "appositive", difficulty: "easy" },
  { id: 50, question: "The study doesn't note ________ these plant-based alternatives carry similar health risks or not.", options: ["that", "what", "whether", "how"], correctAnswer: "whether", type: "appositive", difficulty: "easy" },
  { id: 51, question: "She also came to the conclusion ________ it is a myth that instrumental music is less disturbing than songs.", options: ["that", "what", "which", "how"], correctAnswer: "that", type: "appositive", difficulty: "medium" },
  { id: 52, question: "News came ________ her son died in the war.", options: ["that", "what", "which", "how"], correctAnswer: "that", type: "appositive", difficulty: "easy" },
  { id: 53, question: "Concerns were raised ________ witnesses might be encouraged to exaggerate their stories in court.", options: ["that", "what", "which", "how"], correctAnswer: "that", type: "appositive", difficulty: "medium" },
  { id: 54, question: "I have no idea ________ has happened recently on my co-worker.", options: ["that", "what", "which", "how"], correctAnswer: "what", type: "appositive", difficulty: "easy" },
  { id: 55, question: "Evidence has been found ________ children's early sleeping problems are likely to continue when they grow up.", options: ["that", "what", "which", "how"], correctAnswer: "that", type: "appositive", difficulty: "medium" },
  { id: 56, question: "She had no idea ________ she could persuade her husband to give up smoking.", options: ["that", "what", "whether", "how"], correctAnswer: "whether", type: "appositive", difficulty: "easy" },
  { id: 57, question: "The reason ________ accounts for their names Galilean Moons is ________ they were discovered by Galileo in 1610.", options: ["why, that", "that, why", "which, what", "what, that"], correctAnswer: "why, that", type: "appositive", difficulty: "hard" },
  { id: 58, question: "Mencius believed that the reason ________ men is different from animals is ________ man is good.", options: ["why, that", "that, why", "which, what", "what, that"], correctAnswer: "why, that", type: "appositive", difficulty: "hard" },
  { id: 59, question: "The teacher said that the sun ________ (rise) from the east.", options: ["rises", "rose", "rising", "has risen"], correctAnswer: "rises", type: "appositive", difficulty: "easy" },
  { id: 60, question: "We all want to know ________ they used to make the sound effects in the movie.", options: ["that", "what", "which", "how"], correctAnswer: "what", type: "appositive", difficulty: "easy" }
];

// 8个关卡（每个World 2个）
export const levels: Level[] = [
  // World 1: 主语从句
  {
    id: 1,
    worldId: 1,
    worldName: "主语从句",
    name: "主语从句基础",
    description: "掌握 that/what/whether 引导的主语从句",
    questions: [1, 2, 3, 4, 5, 6, 7, 8],
    learningQuestions: [1, 2, 3, 4],
    practiceQuestions: [5, 6, 7, 8]
  },
  {
    id: 2,
    worldId: 1,
    worldName: "主语从句",
    name: "主语从句进阶",
    description: "形式主语 it 的使用与 whoever/which 等引导词",
    questions: [9, 10, 11, 12, 13, 14, 15],
    learningQuestions: [9, 10, 11, 12],
    practiceQuestions: [13, 14, 15]
  },
  // World 2: 宾语从句
  {
    id: 3,
    worldId: 2,
    worldName: "宾语从句",
    name: "宾语从句基础",
    description: "动词/介词后接从句；that 省略",
    questions: [16, 17, 18, 19, 20, 21, 22, 23],
    learningQuestions: [16, 17, 18, 19],
    practiceQuestions: [20, 21, 22, 23]
  },
  {
    id: 4,
    worldId: 2,
    worldName: "宾语从句",
    name: "宾语从句进阶",
    description: "whether vs. if 与复杂宾语从句",
    questions: [24, 25, 26, 27, 28, 29, 30],
    learningQuestions: [24, 25, 26, 27],
    practiceQuestions: [28, 29, 30]
  },
  // World 3: 表语从句
  {
    id: 5,
    worldId: 3,
    worldName: "表语从句",
    name: "表语从句基础",
    description: "系动词后接从句；that 引导",
    questions: [31, 32, 33, 34, 35, 36, 37, 38],
    learningQuestions: [31, 32, 33, 34],
    practiceQuestions: [35, 36, 37, 38]
  },
  {
    id: 6,
    worldId: 3,
    worldName: "表语从句",
    name: "表语从句进阶",
    description: "as if/because 引导的特殊表语从句",
    questions: [39, 40, 41, 42, 43, 44, 45],
    learningQuestions: [39, 40, 41, 42],
    practiceQuestions: [43, 44, 45]
  },
  // World 4: 同位语从句
  {
    id: 7,
    worldId: 4,
    worldName: "同位语从句",
    name: "同位语从句基础",
    description: "fact/idea/belief/promise 等名词后接 that 从句",
    questions: [46, 47, 48, 49, 50, 51, 52, 53],
    learningQuestions: [46, 47, 48, 49],
    practiceQuestions: [50, 51, 52, 53]
  },
  {
    id: 8,
    worldId: 4,
    worldName: "同位语从句",
    name: "同位语从句进阶",
    description: "与定语从句区分与复杂同位语从句",
    questions: [54, 55, 56, 57, 58, 59, 60],
    learningQuestions: [54, 55, 56, 57],
    practiceQuestions: [58, 59, 60]
  }
];

// 知识点
export const knowledgePoints: KnowledgePoint[] = [
  {
    worldId: 1,
    worldName: "主语从句",
    description: "主语从句是指在句子中充当主语的从句",
    keyRules: [
      "that：不充当成分，无意义，引导主语从句时不可省略",
      "what：要充当成分（通常是主语或宾语），有具体意义",
      "whether/if：不充当成分，有'是否'的意思",
      "whoever/whatever：表示'无论谁/无论什么'，引导主语从句"
    ],
    examples: [
      "That he is honest is obvious.",
      "What you said is true.",
      "Whether you are right is not clear."
    ]
  },
  {
    worldId: 2,
    worldName: "宾语从句",
    description: "宾语从句用来补充说明或回答动词或介词所要求的信息",
    keyRules: [
      "that：在动词后可省略，介词后不可省略",
      "whether/if：在口语中常可互换，介词后只能用 whether",
      "what/when/how/why：要充当成分，有各自意义",
      "whomever/whoever：表示'无论谁/无论谁'，引导宾语从句"
    ],
    examples: [
      "She knows that he is lying.",
      "I don't know whether it will rain.",
      "She talks about what she is doing."
    ]
  },
  {
    worldId: 3,
    worldName: "表语从句",
    description: "表语从句位于系动词之后，用来补充说明主语的内容或性质",
    keyRules: [
      "that：不充当成分，无意义",
      "whether：不充当成分，有'是否'的意思",
      "as if/as though：表示'好像'，常用于虚拟语气",
      "because：引导表语从句，表示原因"
    ],
    examples: [
      "The truth is that he never called.",
      "The question remains whether we can trust him.",
      "He looks as if he were from the Mars."
    ]
  },
  {
    worldId: 4,
    worldName: "同位语从句",
    description: "同位语从句对名词进行解释或进一步补充说明",
    keyRules: [
      "that：不充当成分，无意义，引导同位语从句时不可省略",
      "先行词：fact, idea, news, hope, belief, promise, suggestion 等抽象名词",
      "与定语从句区别：同位语从句解释内容，定语从句修饰限制",
      "连接词 that 在同位语从句中不充当任何成分"
    ],
    examples: [
      "He made a promise that he would return soon.",
      "The idea that he proposed was brilliant.（定语从句）",
      "The news that our team won the game spread quickly."
    ]
  }
];

export const worlds = [
  { id: 1, name: "主语从句", color: "from-blue-500 to-blue-600", emoji: "📘" },
  { id: 2, name: "宾语从句", color: "from-green-500 to-green-600", emoji: "📗" },
  { id: 3, name: "表语从句", color: "from-purple-500 to-purple-600", emoji: "📙" },
  { id: 4, name: "同位语从句", color: "from-orange-500 to-orange-600", emoji: "📕" }
];
