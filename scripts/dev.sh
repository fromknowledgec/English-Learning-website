#!/bin/bash
set -e

# 确保在项目根目录运行
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
cd "$PROJECT_ROOT"

echo "Starting development server from: $PROJECT_ROOT"

# 使用 pnpm exec 确保使用本地安装的 next
pnpm exec next dev --port 5000

echo "Development server stopped."
