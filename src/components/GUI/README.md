# GUI 组件库

这是一套为高二英语学习游戏设计的可复用UI组件库。

## 📁 目录结构

```
GUI/
├── templates/      # 模板组件
│   ├── PageTemplate.tsx    # 通用页面模板
│   ├── Container.tsx       # 通用容器
│   └── Card.tsx            # 通用卡片
├── layouts/        # 布局组件
│   ├── Header.tsx          # 页头
│   └── Footer.tsx          # 页脚
├── forms/          # 表单组件
│   ├── Button.tsx          # 按钮
│   ├── ProgressBar.tsx     # 进度条
│   └── OptionCard.tsx      # 选项卡片
├── displays/       # 显示组件
│   ├── HPBar.tsx           # 生命值条
│   ├── WeaponDisplay.tsx   # 武器显示
│   └── CharacterCard.tsx   # 角色卡片
├── feedback/       # 反馈组件
│   ├── SuccessMessage.tsx  # 成功消息
│   ├── ErrorMessage.tsx    # 错误消息
│   ├── WarningMessage.tsx  # 警告消息
│   └── InfoMessage.tsx     # 提示消息
└── index.ts        # 导出所有组件
```

## 🎨 使用方法

### 导入组件

```typescript
// 导入单个组件
import { Button } from '@/components/GUI';

// 或导入所有组件
import * as GUI from '@/components/GUI';
```

### 组件示例

#### PageTemplate - 页面模板

```typescript
<GUI.PageTemplate gradient="blue-green">
  <GUI.Header />
  <GUI.Container>
    <GUI.Card>
      <h1>内容</h1>
    </GUI.Card>
  </GUI.Container>
  <GUI.Footer />
</GUI.PageTemplate>
```

#### Button - 按钮

```typescript
<GUI.Button 
  variant="primary" 
  size="lg"
  onClick={handleClick}
  disabled={false}
>
  点击我
</GUI.Button>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'ghost'
- `size`: 'sm' | 'md' | 'lg' | 'xl'
- `disabled`: boolean
- `fullWidth`: boolean

#### Card - 卡片

```typescript
<GUI.Card variant="success" shadow="xl" padding="lg">
  <h2>卡片标题</h2>
  <p>卡片内容</p>
</GUI.Card>
```

**Props:**
- `variant`: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'battle'
- `shadow`: 'none' | 'sm' | 'md' | 'lg' | 'xl'
- `padding`: 'sm' | 'md' | 'lg' | 'xl'
- `rounded`: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'

#### ProgressBar - 进度条

```typescript
<GUI.ProgressBar 
  progress={75} 
  color="green"
  showPercentage={true}
  label="学习进度"
/>
```

#### CharacterCard - 角色卡片

```typescript
<GUI.CharacterCard
  name="玩家"
  image="/solider.png"
  hp={80}
  maxHp={100}
  badge="⚔️"
  animate={true}
/>
```

#### 反馈消息

```typescript
<GUI.SuccessMessage 
  title="恭喜过关！" 
  message="你已成功击败怪物！" 
  icon="🎉"
/>

<GUI.ErrorMessage 
  title="挑战失败" 
  message="不要灰心，再试一次！" 
  icon="😢"
/>

<GUI.WarningMessage 
  title="遗憾升级…" 
  message="只选择了部分正确释义" 
  icon="😔"
/>

<GUI.InfoMessage 
  message="请选择所有正确的中文释义" 
  icon="💡"
/>
```

## 🎯 设计原则

1. **一致性**：所有组件遵循统一的设计风格
2. **可复用性**：组件参数化，支持多种使用场景
3. **可扩展性**：易于添加新组件和功能
4. **响应式**：所有组件支持移动端和桌面端

## 📝 组件列表

### 模板组件（Templates）
- **PageTemplate**: 页面布局模板，支持不同渐变背景
- **Container**: 内容容器，统一宽度和间距
- **Card**: 卡片容器，支持多种样式

### 布局组件（Layouts）
- **Header**: 页面头部，显示Logo和标题
- **Footer**: 页面底部，显示版权信息

### 表单组件（Forms）
- **Button**: 通用按钮，支持多种变体
- **ProgressBar**: 进度条，显示百分比
- **OptionCard**: 选项卡片，用于选择题

### 显示组件（Displays）
- **HPBar**: 生命值条，战斗系统专用
- **WeaponDisplay**: 武器信息显示
- **CharacterCard**: 角色卡片，显示HP和图片

### 反馈组件（Feedback）
- **SuccessMessage**: 成功消息提示
- **ErrorMessage**: 错误消息提示
- **WarningMessage**: 警告消息提示
- **InfoMessage**: 一般信息提示

## 🔧 自定义样式

所有组件都支持 `className` 属性，可以添加自定义样式：

```typescript
<GUI.Button className="my-custom-button" variant="primary">
  自定义按钮
</GUI.Button>
```

## 📖 迁移指南

如果要将现有组件迁移到GUI库：

1. 提取通用逻辑和样式
2. 参数化可配置项
3. 在GUI文件夹中创建新组件
4. 更新现有代码使用新组件
5. 删除旧代码

## 🚀 未来扩展

- [ ] 添加更多表单组件（Input, Select等）
- [ ] 添加动画组件库
- [ ] 添加主题切换功能
- [ ] 添加国际化支持
