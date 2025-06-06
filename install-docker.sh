#!/bin/bash

# 🐳 Docker安装脚本 (macOS)
echo "🐳 Docker安装助手"
echo "=================="

# 检查系统类型
if [[ "$OSTYPE" != "darwin"* ]]; then
    echo "❌ 此脚本仅适用于macOS系统"
    exit 1
fi

# 检查是否已安装Docker
if command -v docker &> /dev/null; then
    echo "✅ Docker已安装: $(docker --version)"
    exit 0
fi

echo "📋 Docker安装选项："
echo "1) 使用Homebrew安装 (推荐)"
echo "2) 手动下载Docker Desktop"

read -p "请选择安装方式 (1-2): " choice

case $choice in
    1)
        echo "🍺 使用Homebrew安装Docker Desktop..."
        brew install --cask docker
        ;;
    2)
        echo "🌐 请访问 https://www.docker.com/products/docker-desktop 手动下载"
        ;;
    *)
        echo "❌ 无效选择"
        exit 1
        ;;
esac 