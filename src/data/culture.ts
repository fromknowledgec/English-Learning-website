import { BaseQuestion, BaseLevel } from '@/types/common';

export interface CultureQuestion extends BaseQuestion {
  type: 'canada' | 'australia' | 'newzealand';
  format: 'choice' | 'truefalse' | 'shortanswer' | 'fillblank';
}

export interface CultureLevel extends BaseLevel {
}

export interface CultureKnowledgePoint {
  worldId: number;
  worldName: string;
  description: string;
  keyFacts: string[];
  examples: string[];
}

// 文化常识题目数据（基于docx文件）
export const cultureQuestions: CultureQuestion[] = [
  // World 1: 加拿大文化 (1-20)
  {
    id: 1,
    question: "加拿大的国旗是什么颜色的？",
    options: ["蓝白", "红白", "红蓝", "红绿"],
    correctAnswer: "红白",
    type: "canada",
    difficulty: "easy",
    format: "choice"
  },
  {
    id: 2,
    question: "加拿大的货币单位是？",
    options: ["美元", "加元", "英镑", "欧元"],
    correctAnswer: "加元",
    type: "canada",
    difficulty: "easy",
    format: "choice"
  },
  {
    id: 3,
    question: "加拿大最大的城市是？",
    options: ["多伦多", "温哥华", "蒙特利尔", "渥太华"],
    correctAnswer: "多伦多",
    type: "canada",
    difficulty: "easy",
    format: "choice"
  },
  {
    id: 4,
    question: "加拿大的首都是？",
    options: ["多伦多", "温哥华", "蒙特利尔", "渥太华"],
    correctAnswer: "渥太华",
    type: "canada",
    difficulty: "easy",
    format: "choice"
  },
  {
    id: 5,
    question: "多伦多以什么著名建筑而闻名？",
    options: ["国会大厦", "CN塔", "皇家山", "卡萨罗马城堡"],
    correctAnswer: "CN塔",
    type: "canada",
    difficulty: "easy",
    format: "choice"
  },
  {
    id: 6,
    question: "温哥华位于加拿大的哪个海岸？",
    options: ["东海岸", "西海岸", "南海岸", "北海岸"],
    correctAnswer: "西海岸",
    type: "canada",
    difficulty: "easy",
    format: "choice"
  },
  {
    id: 7,
    question: "蒙特利尔位于哪个省？",
    options: ["安大略省", "不列颠哥伦比亚省", "魁北克省", "阿尔伯塔省"],
    correctAnswer: "魁北克省",
    type: "canada",
    difficulty: "medium",
    format: "choice"
  },
  {
    id: 8,
    question: "埃德蒙顿是什么产业的中心？",
    options: ["金融业", "石油天然气钻探业", "渔业", "林业"],
    correctAnswer: "石油天然气钻探业",
    type: "canada",
    difficulty: "medium",
    format: "choice"
  },
  {
    id: 9,
    question: "加拿大的国庆日是？",
    options: ["6月1日", "7月1日", "7月4日", "8月1日"],
    correctAnswer: "7月1日",
    type: "canada",
    difficulty: "medium",
    format: "choice"
  },
  {
    id: 10,
    question: "在加拿大俚语中，\"Loonie\"指的是？",
    options: ["一种咖啡", "一元硬币", "一种甜点", "小甜甜圈"],
    correctAnswer: "一元硬币",
    type: "canada",
    difficulty: "medium",
    format: "choice"
  },
  {
    id: 11,
    question: "在加拿大俚语中，\"Double-double\"指的是什么？",
    options: ["双份汉堡", "两份奶油和两份糖的咖啡", "双层床", "双倍分数"],
    correctAnswer: "两份奶油和两份糖的咖啡",
    type: "canada",
    difficulty: "medium",
    format: "choice"
  },
  {
    id: 12,
    question: "在加拿大英语中，在陈述句末尾添加\"eh\"的目的是？",
    options: ["表示惊讶", "将陈述句变成需要友好回复的问题", "表示同意", "表示疑问"],
    correctAnswer: "将陈述句变成需要友好回复的问题",
    type: "canada",
    difficulty: "medium",
    format: "choice"
  },
  {
    id: 13,
    question: "加拿大的国宝动物是？",
    options: ["熊", "野牛", "海狸", "麋鹿"],
    correctAnswer: "海狸",
    type: "canada",
    difficulty: "easy",
    format: "choice"
  },
  {
    id: 14,
    question: "加拿大有几个海岸线临海？",
    options: ["一个", "两个", "三个", "四个"],
    correctAnswer: "三个",
    type: "canada",
    difficulty: "medium",
    format: "choice"
  },
  {
    id: 15,
    question: "加拿大在世界上土地面积排名第几？",
    options: ["第一", "第二", "第三", "第四"],
    correctAnswer: "第二",
    type: "canada",
    difficulty: "easy",
    format: "choice"
  },
  {
    id: 16,
    question: "冰球被认为是加拿大的？",
    options: ["最受欢迎的球类运动", "国球", "冬季运动", "奥运项目"],
    correctAnswer: "国球",
    type: "canada",
    difficulty: "easy",
    format: "choice"
  },
  {
    id: 17,
    question: "加拿大官方使用的语言有几种？",
    options: ["一种", "两种", "三种", "四种"],
    correctAnswer: "两种",
    type: "canada",
    difficulty: "easy",
    format: "choice"
  },
  {
    id: 18,
    question: "温哥华的气候特点是？",
    options: ["寒冷干燥", "温和多雨的冬季和温暖晴朗的夏季", "热带雨林气候", "沙漠气候"],
    correctAnswer: "温和多雨的冬季和温暖晴朗的夏季",
    type: "canada",
    difficulty: "medium",
    format: "choice"
  },
  {
    id: 19,
    question: "海狸在加拿大的象征意义是？",
    options: ["勇气", "勤劳和创造力", "友谊", "和平"],
    correctAnswer: "勤劳和创造力",
    type: "canada",
    difficulty: "medium",
    format: "choice"
  },
  {
    id: 20,
    question: "加拿大国庆日人们会参与哪些活动？",
    options: ["在家休息", "游行、乐队表演、美食和烟花", "购物", "看电影"],
    correctAnswer: "游行、乐队表演、美食和烟花",
    type: "canada",
    difficulty: "easy",
    format: "choice"
  },

  // World 2: 澳大利亚文化 (21-40)
  {
    id: 21,
    question: "澳大利亚在世界上的面积排名是？",
    options: ["第五", "第六", "第七", "第八"],
    correctAnswer: "第六",
    type: "australia",
    difficulty: "easy",
    format: "choice"
  },
  {
    id: 22,
    question: "澳大利亚常被称为什么？",
    options: ["南方大陆", "Down Under", "幸运之国", "黄金海岸"],
    correctAnswer: "Down Under",
    type: "australia",
    difficulty: "easy",
    format: "choice"
  },
  {
    id: 23,
    question: "澳大利亚的首都是？",
    options: ["悉尼", "墨尔本", "堪培拉", "布里斯班"],
    correctAnswer: "堪培拉",
    type: "australia",
    difficulty: "easy",
    format: "choice"
  },
  {
    id: 24,
    question: "悉尼以什么建筑而闻名世界？",
    options: ["海港大桥", "悉尼歌剧院", "悉尼塔", "皇家植物园"],
    correctAnswer: "悉尼歌剧院",
    type: "australia",
    difficulty: "easy",
    format: "choice"
  },
  {
    id: 25,
    question: "墨尔本被称为澳大利亚的？",
    options: ["经济中心", "文化之都", "旅游胜地", "科技中心"],
    correctAnswer: "文化之都",
    type: "australia",
    difficulty: "easy",
    format: "choice"
  },
  {
    id: 26,
    question: "袋鼠和考拉的共同特征是？",
    options: ["都会飞", "都是哺乳动物", "都是有袋类动物，将宝宝放在腹部的育儿袋中", "都是食肉动物"],
    correctAnswer: "都是有袋类动物，将宝宝放在腹部的育儿袋中",
    type: "australia",
    difficulty: "easy",
    format: "choice"
  },
  {
    id: 27,
    question: "大堡礁是什么？",
    options: ["澳大利亚最大的沙漠", "世界上最大的珊瑚礁系统", "澳大利亚最高的山脉", "一个著名的主题公园"],
    correctAnswer: "世界上最大的珊瑚礁系统",
    type: "australia",
    difficulty: "easy",
    format: "choice"
  },
  {
    id: 28,
    question: "鸭嘴兽的特点是？",
    options: ["会飞的哺乳动物", "有鸭子嘴的产卵哺乳动物，大部分时间在水中生活", "像鸭子的爬行动物", "像鸭子的鸟类"],
    correctAnswer: "有鸭子嘴的产卵哺乳动物，大部分时间在水中生活",
    type: "australia",
    difficulty: "medium",
    format: "choice"
  },
  {
    id: 29,
    question: "迪吉里杜管是哪个群体的传统乐器？",
    options: ["澳大利亚原住民", "新西兰毛利人", "欧洲移民", "亚洲移民"],
    correctAnswer: "澳大利亚原住民",
    type: "australia",
    difficulty: "medium",
    format: "choice"
  },
  {
    id: 30,
    question: "在澳大利亚俚语中，\"brekkie\"是什么意思？",
    options: ["午餐", "晚餐", "早餐", "零食"],
    correctAnswer: "早餐",
    type: "australia",
    difficulty: "medium",
    format: "choice"
  },
  {
    id: 31,
    question: "在澳大利亚俚语中，\"bizzo\"是什么的简称？",
    options: ["商务", "篮球", "银行", "饼干"],
    correctAnswer: "商务",
    type: "australia",
    difficulty: "medium",
    format: "choice"
  },
  {
    id: 32,
    question: "\"Not my bowl of rice\"在澳大利亚俚语中的意思是？",
    options: ["不是我的饭", "不是我喜欢的东西", "不是我的稻米", "不是我的碗"],
    correctAnswer: "不是我喜欢的东西",
    type: "australia",
    difficulty: "medium",
    format: "choice"
  },
  {
    id: 33,
    question: "澳大利亚原住民的两个主要群体是？",
    options: ["毛利人和托雷斯海峡岛民", "原住民和托雷斯海峡岛民", "土著人和欧洲移民", "亚洲移民和原住民"],
    correctAnswer: "原住民和托雷斯海峡岛民",
    type: "australia",
    difficulty: "medium",
    format: "choice"
  },
  {
    id: 34,
    question: "迪吉里杜管演奏者如何改变音高？",
    options: ["按音孔", "改变嘴巴形状", "改变吹气力度", "按压按钮"],
    correctAnswer: "改变嘴巴形状",
    type: "australia",
    difficulty: "hard",
    format: "choice"
  },
  {
    id: 35,
    question: "迪吉里杜管有几个手指孔？",
    options: ["有多个手指孔", "没有手指孔", "两个手指孔", "六个手指孔"],
    correctAnswer: "没有手指孔",
    type: "australia",
    difficulty: "medium",
    format: "choice"
  },
  {
    id: 36,
    question: "澳大利亚北部是什么气候？",
    options: ["寒冷气候", "热带雨林气候", "温带气候", "沙漠气候"],
    correctAnswer: "热带雨林气候",
    type: "australia",
    difficulty: "medium",
    format: "choice"
  },
  {
    id: 37,
    question: "澳大利亚南部和东南部是什么气候？",
    options: ["热带雨林气候", "温带气候", "沙漠气候", "极地气候"],
    correctAnswer: "温带气候",
    type: "australia",
    difficulty: "medium",
    format: "choice"
  },
  {
    id: 38,
    question: "澳大利亚是世界上气候最的国家之一？",
    options: ["单一", "多样性", "干燥", "潮湿"],
    correctAnswer: "多样性",
    type: "australia",
    difficulty: "easy",
    format: "choice"
  },
  {
    id: 39,
    question: "迪吉里杜管在澳大利亚原住民文化中的意义是？",
    options: ["娱乐工具", "神圣乐器，象征原住民与环境的永恒联系", "军事工具", "劳动工具"],
    correctAnswer: "神圣乐器，象征原住民与环境的永恒联系",
    type: "australia",
    difficulty: "hard",
    format: "choice"
  },
  {
    id: 40,
    question: "澳大利亚人倾向于缩短英语单词，这体现了什么？",
    options: ["懒惰", "澳大利亚英语的特色", "英语不好", "速度快"],
    correctAnswer: "澳大利亚英语的特色",
    type: "australia",
    difficulty: "medium",
    format: "choice"
  },

  // World 3: 新西兰文化 (41-60)
  {
    id: 41,
    question: "新西兰最大的城市是？",
    options: ["惠灵顿", "基督城", "奥克兰", "但尼丁"],
    correctAnswer: "奥克兰",
    type: "newzealand",
    difficulty: "easy",
    format: "choice"
  },
  {
    id: 42,
    question: "新西兰的首都是？",
    options: ["奥克兰", "惠灵顿", "基督城", "但尼丁"],
    correctAnswer: "惠灵顿",
    type: "newzealand",
    difficulty: "easy",
    format: "choice"
  },
  {
    id: 43,
    question: "新西兰有几个主要岛屿？",
    options: ["一个", "两个", "三个", "四个"],
    correctAnswer: "两个",
    type: "newzealand",
    difficulty: "easy",
    format: "choice"
  },
  {
    id: 44,
    question: "新西兰的主要岛屿是？",
    options: ["东岛和西岛", "北岛和南岛", "大岛和小岛", "红岛和白岛"],
    correctAnswer: "北岛和南岛",
    type: "newzealand",
    difficulty: "easy",
    format: "choice"
  },
  {
    id: 45,
    question: "新西兰有多少种官方语言？",
    options: ["一种", "两种", "三种", "四种"],
    correctAnswer: "两种",
    type: "newzealand",
    difficulty: "medium",
    format: "choice"
  },
  {
    id: 46,
    question: "新西兰的官方语言是？",
    options: ["英语和毛利语", "英语和法语", "英语和德语", "毛利语和法语"],
    correctAnswer: "英语和毛利语",
    type: "newzealand",
    difficulty: "medium",
    format: "choice"
  },
  {
    id: 47,
    question: "新西兰的气候特点是？",
    options: ["热带湿润", "干燥", "温带海洋性气候，气温温和", "极地寒冷"],
    correctAnswer: "温带海洋性气候，气温温和",
    type: "newzealand",
    difficulty: "medium",
    format: "choice"
  },
  {
    id: 48,
    question: "基督城冬季的平均气温通常？",
    options: ["低于0°C", "5°C到10°C", "15°C到20°C", "25°C以上"],
    correctAnswer: "5°C到10°C",
    type: "newzealand",
    difficulty: "medium",
    format: "choice"
  },
  {
    id: 49,
    question: "新西兰的毛利文化在国家身份中扮演什么角色？",
    options: ["不重要", "非常重要", "一般", "未知"],
    correctAnswer: "非常重要",
    type: "newzealand",
    difficulty: "easy",
    format: "choice"
  },
  {
    id: 50,
    question: "\"哈卡\"是什么？",
    options: ["一种食物", "一种舞蹈仪式", "一种乐器", "一种节日"],
    correctAnswer: "一种舞蹈仪式",
    type: "newzealand",
    difficulty: "medium",
    format: "choice"
  },
  {
    id: 51,
    question: "新西兰被称为？",
    options: ["风城", "世界尽头", "长白云之乡", "绿宝石岛"],
    correctAnswer: "长白云之乡",
    type: "newzealand",
    difficulty: "medium",
    format: "choice"
  },
  {
    id: 52,
    question: "但尼丁以什么著名？",
    options: ["毛利文化", "苏格兰遗产和维多利亚式建筑", "葡萄酒", "海滩"],
    correctAnswer: "苏格兰遗产和维多利亚式建筑",
    type: "newzealand",
    difficulty: "medium",
    format: "choice"
  },
  {
    id: 53,
    question: "惠灵顿以什么著名？",
    options: ["煤矿", "艺术场景和咖啡文化", "葡萄园", "海滩"],
    correctAnswer: "艺术场景和咖啡文化",
    type: "newzealand",
    difficulty: "medium",
    format: "choice"
  },
  {
    id: 54,
    question: "基督城常被称为？",
    options: ["风城", "花园城市", "文化之都", "冒险之都"],
    correctAnswer: "花园城市",
    type: "newzealand",
    difficulty: "easy",
    format: "choice"
  },
  {
    id: 55,
    question: "新西兰俚语\"She'll be right\"的意思是？",
    options: ["她是正确的", "一切都会好的", "她是右撇子", "她没事"],
    correctAnswer: "一切都会好的",
    type: "newzealand",
    difficulty: "medium",
    format: "choice"
  },
  {
    id: 56,
    question: "新西兰俚语\"No worries\"的意思是？",
    options: ["没有担心", "不客气", "没问题", "不客气"],
    correctAnswer: "不客气",
    type: "newzealand",
    difficulty: "easy",
    format: "choice"
  },
  {
    id: 57,
    question: "新西兰以什么活动闻名世界？",
    options: ["赛马", "冒险活动（如蹦极、跳伞）", "歌剧", "电影"],
    correctAnswer: "冒险活动（如蹦极、跳伞）",
    type: "newzealand",
    difficulty: "easy",
    format: "choice"
  },
  {
    id: 58,
    question: "哪个新西兰城市以地热活动和强大的毛利文化影响而著名？",
    options: ["奥克兰", "惠灵顿", "罗托鲁瓦", "但尼丁"],
    correctAnswer: "罗托鲁瓦",
    type: "newzealand",
    difficulty: "medium",
    format: "choice"
  },
  {
    id: 59,
    question: "新西兰人如何面对挑战？",
    options: ["恐惧", "乐观的态度，认为一切都会好的", "逃避", "抱怨"],
    correctAnswer: "乐观的态度，认为一切都会好的",
    type: "newzealand",
    difficulty: "medium",
    format: "choice"
  },
  {
    id: 60,
    question: "新西兰葡萄酒产区以什么闻名？",
    options: ["红葡萄酒", "白葡萄酒（如长相思）", "起泡酒", "甜酒"],
    correctAnswer: "白葡萄酒（如长相思）",
    type: "newzealand",
    difficulty: "medium",
    format: "choice"
  }
];

// 文化关卡（每个World 2个）
export const cultureLevels: CultureLevel[] = [
  // World 1: 加拿大文化
  {
    id: 1,
    worldId: 1,
    worldName: "加拿大文化",
    name: "加拿大基础知识",
    description: "了解加拿大的地理位置、城市、国旗和货币等基本常识",
    questions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    learningQuestions: [1, 2, 3, 4, 5],
    practiceQuestions: [6, 7, 8, 9, 10]
  },
  {
    id: 2,
    worldId: 1,
    worldName: "加拿大文化",
    name: "加拿大文化与习俗",
    description: "深入了解加拿大的俚语、国宝动物和文化传统",
    questions: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
    learningQuestions: [11, 12, 13, 14, 15],
    practiceQuestions: [16, 17, 18, 19, 20]
  },
  // World 2: 澳大利亚文化
  {
    id: 3,
    worldId: 2,
    worldName: "澳大利亚文化",
    name: "澳大利亚基础知识",
    description: "了解澳大利亚的地理位置、城市和独特动物",
    questions: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
    learningQuestions: [21, 22, 23, 24, 25],
    practiceQuestions: [26, 27, 28, 29, 30]
  },
  {
    id: 4,
    worldId: 2,
    worldName: "澳大利亚文化",
    name: "澳大利亚原住民文化",
    description: "深入了解澳大利亚原住民文化、俚语和传统乐器",
    questions: [31, 32, 33, 34, 35, 36, 37, 38, 39, 40],
    learningQuestions: [31, 32, 33, 34, 35],
    practiceQuestions: [36, 37, 38, 39, 40]
  },
  // World 3: 新西兰文化
  {
    id: 5,
    worldId: 3,
    worldName: "新西兰文化",
    name: "新西兰基础知识",
    description: "了解新西兰的地理位置、城市和气候特点",
    questions: [41, 42, 43, 44, 45, 46, 47, 48, 49, 50],
    learningQuestions: [41, 42, 43, 44, 45],
    practiceQuestions: [46, 47, 48, 49, 50]
  },
  {
    id: 6,
    worldId: 3,
    worldName: "新西兰文化",
    name: "新西兰毛利文化",
    description: "深入了解新西兰毛利文化、俚语和特色活动",
    questions: [51, 52, 53, 54, 55, 56, 57, 58, 59, 60],
    learningQuestions: [51, 52, 53, 54, 55],
    practiceQuestions: [56, 57, 58, 59, 60]
  }
];

// 文化知识世界
export const cultureWorlds = [
  { id: 1, name: "加拿大文化", color: "from-red-500 to-white-500", emoji: "🍁" },
  { id: 2, name: "澳大利亚文化", color: "from-blue-500 to-green-500", emoji: "🦘" },
  { id: 3, name: "新西兰文化", color: "from-green-600 to-green-800", emoji: "🥝" }
];

// 文化知识点
export const cultureKnowledgePoints: CultureKnowledgePoint[] = [
  {
    worldId: 1,
    worldName: "加拿大文化",
    description: "加拿大是世界第二大国，拥有广阔的自然景观和多元文化",
    keyFacts: [
      "首都：渥太华",
      "最大城市：多伦多（以CN塔闻名）",
      "官方语言：英语和法语",
      "货币：加拿大元",
      "国旗：红白枫叶旗",
      "国宝动物：海狸（象征勤劳和创造力）",
      "国庆日：7月1日（Canada Day）"
    ],
    examples: [
      "Loonie：一元硬币",
      "Double-double：两份奶油和两份糖的咖啡",
      "在句尾加\"eh\"可以变成需要友好回复的问题",
      "冰球被认为是加拿大的国球"
    ]
  },
  {
    worldId: 2,
    worldName: "澳大利亚文化",
    description: "澳大利亚是世界第六大国，被称为\"Down Under\"，拥有独特的动植物和原住民文化",
    keyFacts: [
      "首都：堪培拉",
      "最大城市：悉尼（以歌剧院闻名）",
      "文化之都：墨尔本",
      "大堡礁：世界上最大的珊瑚礁系统",
      "独特的有袋类动物：袋鼠、考拉",
      "原住民群体：原住民和托雷斯海峡岛民"
    ],
    examples: [
      "Brekkie：早餐",
      "Bizzo：商务（business的简称）",
      "Not my bowl of rice：不是我喜欢的东西",
      "迪吉里杜管：原住民传统乐器，没有手指孔"
    ]
  },
  {
    worldId: 3,
    worldName: "新西兰文化",
    description: "新西兰由北岛和南岛组成，拥有美丽的自然风光和深厚的毛利文化",
    keyFacts: [
      "首都：惠灵顿（以艺术场景和咖啡文化著名）",
      "最大城市：奥克兰",
      "花园城市：基督城",
      "官方语言：英语和毛利语",
      "气候：温带海洋性气候",
      "毛利文化：哈卡舞（一种舞蹈仪式）"
    ],
    examples: [
      "She'll be right：一切都会好的",
      "No worries：不客气",
      "长白云之乡：新西兰的美称",
      "以冒险活动闻名，如蹦极和跳伞"
    ]
  }
];
