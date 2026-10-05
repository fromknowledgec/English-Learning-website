#!/bin/bash
set -e

# 确保在项目根目录运行
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
cd "$PROJECT_ROOT"

echo "Installing dependencies from: $PROJECT_ROOT"
pnpm install

echo "Preparation complete!"
