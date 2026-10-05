/**
 * 头部组件
 * 显示Logo和网站标题
 */
export default function Header() {
  return (
    <header className="bg-white shadow-lg border-b-4 border-blue-500">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col items-center justify-center gap-1 text-center">
          {/* 平台标题 */}
          <h1 className="text-3xl md:text-4xl font-bold text-blue-700">
            英萃英语学习
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            结合优秀材料 · 聚焦高一英语
          </p>
        </div>
      </div>
    </header>
  );
}
