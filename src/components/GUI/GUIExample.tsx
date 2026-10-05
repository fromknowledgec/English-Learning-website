'use client';

import * as GUI from '@/components/GUI';

/**
 * GUI组件库示例页面
 * 展示所有可用组件的使用方法
 */
export default function GUIExample() {
  return (
    <GUI.PageTemplate gradient="blue-green">
      <GUI.Header />
      
      <GUI.Container size="2xl">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          GUI 组件库示例
        </h1>

        {/* 卡片示例 */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">卡片组件</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <GUI.Card variant="default">
              <h3 className="font-bold">默认卡片</h3>
              <p>这是一个默认样式的卡片</p>
            </GUI.Card>
            <GUI.Card variant="success">
              <h3 className="font-bold">成功卡片</h3>
              <p>这是一个成功状态的卡片</p>
            </GUI.Card>
            <GUI.Card variant="warning">
              <h3 className="font-bold">警告卡片</h3>
              <p>这是一个警告状态的卡片</p>
            </GUI.Card>
            <GUI.Card variant="battle">
              <h3 className="font-bold">战斗卡片</h3>
              <p>这是一个战斗场景的卡片</p>
            </GUI.Card>
          </div>
        </div>

        {/* 按钮示例 */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">按钮组件</h2>
          <div className="flex flex-wrap gap-4">
            <GUI.Button variant="primary">主要按钮</GUI.Button>
            <GUI.Button variant="secondary">次要按钮</GUI.Button>
            <GUI.Button variant="success">成功按钮</GUI.Button>
            <GUI.Button variant="danger">危险按钮</GUI.Button>
            <GUI.Button variant="warning">警告按钮</GUI.Button>
            <GUI.Button variant="ghost">幽灵按钮</GUI.Button>
          </div>
        </div>

        {/* 进度条示例 */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">进度条组件</h2>
          <div className="space-y-4">
            <GUI.ProgressBar progress={25} color="green" label="学习进度" showPercentage />
            <GUI.ProgressBar progress={50} color="blue" label="任务进度" />
            <GUI.ProgressBar progress={75} color="purple" label="总进度" showPercentage />
            <GUI.ProgressBar progress={90} color="yellow" label="完成度" showPercentage />
          </div>
        </div>

        {/* 反馈消息示例 */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">反馈消息</h2>
          <div className="space-y-4">
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
          </div>
        </div>

        {/* 角色卡片示例 */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">角色卡片</h2>
          <div className="grid grid-cols-2 gap-8">
            <GUI.CharacterCard
              name="玩家"
              image="/solider.png"
              hp={80}
              maxHp={100}
              badge="⚔️"
            />
            <GUI.CharacterCard
              name="怪物"
              image="/fantasy_berserker.png"
              hp={60}
              maxHp={100}
            />
          </div>
        </div>

        {/* 武器显示示例 */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">武器显示</h2>
          <div className="grid grid-cols-5 gap-4">
            <GUI.WeaponDisplay name="木剑" emoji="🪵" damage={15} />
            <GUI.WeaponDisplay name="铁剑" emoji="⚔️" damage={20} />
            <GUI.WeaponDisplay name="钢剑" emoji="🗡️" damage={25} />
            <GUI.WeaponDisplay name="精钢剑" emoji="⚡" damage={30} />
            <GUI.WeaponDisplay name="光剑" emoji="✨" damage={40} />
          </div>
        </div>

        {/* 选项卡片示例 */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">选项卡片</h2>
          <div className="space-y-3">
            <GUI.OptionCard keyLabel="A" selected>选项A - 已选择</GUI.OptionCard>
            <GUI.OptionCard keyLabel="B" correct>选项B - 正确</GUI.OptionCard>
            <GUI.OptionCard keyLabel="C" wrong>选项C - 错误</GUI.OptionCard>
            <GUI.OptionCard keyLabel="D">选项D - 未选择</GUI.OptionCard>
          </div>
        </div>

      </GUI.Container>

      <GUI.Footer />
    </GUI.PageTemplate>
  );
}
