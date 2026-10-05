# 🚀 英萃英语学习 - 部署故障排除指南

> 本文档记录了项目部署过程中遇到的所有问题及解决方案，供后续开发参考。

---

## 📋 目录

- [项目基本信息](#项目基本信息)
- [关键配置文件](#关键配置文件)
- [常见部署错误](#常见部署错误)
- [快速修复清单](#快速修复清单)
- [重要注意事项](#重要注意事项)

---

## 项目基本信息

| 项目 | 值 |
|------|-----|
| 框架 | Next.js 16.1.6 (App Router) |
| React | 19.2.3 |
| UI组件 | shadcn/ui + Tailwind CSS 4 |
| 包管理器 | **pnpm (必须)** |
| 运行端口 | 5000 |
| 部署目录 | `/tmp/workdir` |

---

## 关键配置文件

### 1. `.coze` 配置文件

```toml
[project]
requires = ["nodejs-24"]

[dev]
build = ["bash", "./scripts/prepare.sh"]
run = ["bash", "./scripts/dev.sh"]
deps = ["git"]

[deploy]
build = ["bash","./scripts/build.sh"]
run = ["bash","./scripts/start.sh"]
deps = ["git"]
```

### 2. `next.config.js` 配置

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['*.dev.coze.site'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lf-coze-web-cdn.coze.cn',
        pathname: '/**',
      },
    ],
  },
  // 必须设置！解决 Turbopack 根目录识别问题
  turbopack: {
    root: __dirname,
  },
};

module.exports = nextConfig;
```

### 3. `scripts/build.sh` 构建脚本

```bash
#!/bin/bash
set -e

# 确保在项目根目录运行
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
cd "$PROJECT_ROOT"

echo "Building production version from: $PROJECT_ROOT"
echo "Current directory: $(pwd)"
echo "package.json exists: $(test -f package.json && echo 'yes' || echo 'no')"

# ⚠️ 关键：检查并安装依赖（部署环境没有 node_modules）
if [ ! -d "node_modules" ]; then
  echo "node_modules not found, installing dependencies..."
  pnpm install
fi

echo "node_modules exists: $(test -d node_modules && echo 'yes' || echo 'no')"
echo "next exists: $(test -f node_modules/.bin/next && echo 'yes' || echo 'no')"

# ⚠️ 关键：使用 pnpm exec 而非 npx，确保使用本地安装的 next
pnpm exec next build

echo "Build complete!"
```

---

## 常见部署错误

### ❌ 错误 1: Turbopack 根目录识别失败

**错误信息:**
```
Error: Next.js inferred your workspace root, but it may not be correct.
We couldn't find the Next.js package (next/package.json) from the project directory: /tmp/workdir/src/app
```

**原因:** Turbopack 从 `src/app` 目录向上查找 `node_modules/next`，但找不到。

**解决方案:**
在 `next.config.js` 中添加:
```javascript
turbopack: {
  root: __dirname,
},
```

---

### ❌ 错误 2: node_modules 不存在

**错误信息:**
```
node_modules exists: no
next exists: no
ERR_PNPM_RECURSIVE_EXEC_FIRST_FAIL  Command "next" not found
```

**原因:** 部署环境的工作目录没有 `node_modules`，需要先安装依赖。

**解决方案:**
在构建脚本中添加依赖检查:
```bash
if [ ! -d "node_modules" ]; then
  echo "node_modules not found, installing dependencies..."
  pnpm install
fi
```

---

### ❌ 错误 3: npx 尝试下载包

**错误信息:**
```
npm warn exec The following package was not found and will be installed: next@16.1.6
```

**原因:** 使用 `npx` 时，如果本地没有找到包，会尝试从 npm 下载。

**解决方案:**
使用 `pnpm exec` 替代 `npx`:
```bash
# ❌ 错误
npx next build

# ✅ 正确
pnpm exec next build
```

---

### ❌ 错误 4: 'use client' 与 generateStaticParams 冲突

**错误信息:**
```
Next.js can't recognize the exported `generateStaticParams` field in route. 
App pages cannot use both "use client" and export function "generateStaticParams()".
```

**原因:** 客户端组件不能导出服务端函数。

**解决方案:**
移除 `generateStaticParams`，动态路由页面会自动按需渲染。

---

### ❌ 错误 5: 多个 pnpm-lock.yaml 警告

**错误信息:**
```
Warning: Next.js inferred your workspace root, but it may not be correct.
Detected additional lockfiles:
  * /workspace/projects/pnpm-lock.yaml
  * /workspace/pnpm-lock.yaml
```

**原因:** 项目被复制时产生了重复的 lock 文件。

**解决方案:**
确保项目根目录只有一个 `pnpm-lock.yaml`，并配置 `turbopack.root`。

---

## 快速修复清单

当部署失败时，按以下顺序检查：

### ✅ 检查清单

1. **`.coze` 文件是否存在且格式正确？**
   - 必须包含 `[deploy]` 部分
   - `build` 和 `run` 命令必须正确

2. **`next.config.js` 是否配置 `turbopack.root`？**
   ```javascript
   turbopack: { root: __dirname },
   ```

3. **构建脚本是否包含依赖安装？**
   ```bash
   if [ ! -d "node_modules" ]; then
     pnpm install
   fi
   ```

4. **是否使用 `pnpm exec` 而非 `npx`？**
   - build.sh: `pnpm exec next build`
   - start.sh: `pnpm exec next start --port 5000`
   - dev.sh: `pnpm exec next dev --port 5000`

5. **端口是否为 5000？**
   - 开发环境: `--port 5000`
   - 生产环境: `--port 5000`

6. **脚本是否有执行权限？**
   ```bash
   chmod +x scripts/*.sh
   ```

---

## 重要注意事项

### 🔴 绝对禁止

| 禁止操作 | 原因 |
|----------|------|
| 使用 `npm` 或 `yarn` | 项目配置了 `pnpm`，混用会导致依赖问题 |
| 在客户端组件导出 `generateStaticParams` | Next.js 不支持 |
| 使用 `npx next build` | 会尝试下载包，导致版本不一致 |
| 删除 `.coze` 文件 | 部署的唯一配置依据 |

### 🟡 需要特别注意

| 注意事项 | 说明 |
|----------|------|
| 动态路由页面 | `src/app/culture/level/[id]` 和 `src/app/noun-clause/level/[id]` 是动态页面 |
| 图片资源 | 部署时确保 `public/` 目录下的图片存在 |
| 环境变量 | 如需环境变量，在 `.coze` 中配置 |
| 热更新端口 | 开发环境热更新使用 5000 端口 |

### 🟢 推荐做法

| 推荐 | 说明 |
|------|------|
| 提交前本地构建测试 | `pnpm build` 确保无错误 |
| 检查 TypeScript | `npx tsc --noEmit` |
| 清理未使用的导入 | 避免构建警告 |

---

## 部署成功标志

```
✓ Compiled successfully in X.Xs
✓ Running TypeScript ...
✓ Generating static pages (25/25)
✓ Build complete!

Route (app)
┌ ○ /                    # 首页
├ ○ /attributive-clause  # 静态页面
├ ƒ /culture/level/[id]  # 动态页面
...
```

---

## 联系与更新

本文档随项目更新而维护。如遇到新的部署问题，请及时补充到此文档。

**最后更新:** 2026-02-22
