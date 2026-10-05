#!/bin/bash
set -e

# 确保在项目根目录运行
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
cd "$PROJECT_ROOT"

echo "Starting production server from: $PROJECT_ROOT"

# 确保依赖存在
if [ ! -d "node_modules" ]; then
  echo "node_modules not found, installing dependencies..."
  pnpm install
fi

# 使用 pnpm exec 确保使用本地安装的 next
pnpm exec next start --port 5000

echo "Production server stopped."
