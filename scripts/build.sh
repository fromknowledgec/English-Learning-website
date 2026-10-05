#!/bin/bash
set -e

# 确保在项目根目录运行
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
cd "$PROJECT_ROOT"

echo "Building production version from: $PROJECT_ROOT"
echo "Current directory: $(pwd)"
echo "package.json exists: $(test -f package.json && echo 'yes' || echo 'no')"

# 检查并安装依赖
if [ ! -d "node_modules" ]; then
  echo "node_modules not found, installing dependencies..."
  pnpm install
fi

echo "node_modules exists: $(test -d node_modules && echo 'yes' || echo 'no')"
echo "next exists: $(test -f node_modules/.bin/next && echo 'yes' || echo 'no')"

# 使用 pnpm exec 确保使用本地安装的 next
pnpm exec next build

echo "Build complete!"
