#!/bin/bash

# 🚀 米多智库Docker启动脚本
# 快速部署前后端服务和MongoDB数据库

set -e

echo "🐳 米多智库 - Docker部署脚本"
echo "=================================="

# 检查Docker是否安装
if ! command -v docker &> /dev/null; then
    echo "❌ Docker未安装，请先安装Docker"
    exit 1
fi

if ! command -v docker-compose &> /dev/null && ! command -v docker compose &> /dev/null; then
    echo "❌ Docker Compose未安装，请先安装Docker Compose"
    exit 1
fi

# 设置环境变量文件
if [ ! -f .env ]; then
    echo "📝 创建环境变量文件..."
    cp docker.env .env
    echo "✅ 环境变量文件创建完成，请根据需要修改 .env 文件"
fi

# 选择启动模式
echo ""
echo "请选择启动模式："
echo "1) 基础模式 (后端 + 前端 + MongoDB)"
echo "2) 完整模式 (包含 Nginx + Mongo管理界面)"
echo "3) 仅启动MongoDB"
echo "4) 停止所有服务"
echo "5) 重新构建并启动"

read -p "请输入选择 (1-5): " choice

case $choice in
    1)
        echo "🚀 启动基础模式..."
        docker-compose up -d mongodb backend
        ;;
    2)
        echo "🚀 启动完整模式..."
        docker-compose --profile nginx --profile admin up -d
        ;;
    3)
        echo "🚀 仅启动MongoDB..."
        docker-compose up -d mongodb
        ;;
    4)
        echo "🛑 停止所有服务..."
        docker-compose --profile nginx --profile admin down
        exit 0
        ;;
    5)
        echo "🔨 重新构建并启动..."
        docker-compose down
        docker-compose build --no-cache
        docker-compose up -d mongodb backend
        ;;
    *)
        echo "❌ 无效选择"
        exit 1
        ;;
esac

echo ""
echo "⏳ 等待服务启动..."
sleep 10

echo ""
echo "🎉 部署完成！"
echo "=================================="
echo "📱 访问地址:"
echo "   前端界面: http://localhost:10255"
echo "   API文档: http://localhost:10255/health"
echo "   MongoDB: localhost:27017"

echo ""
echo "📋 常用命令:"
echo "   查看日志: docker-compose logs -f"
echo "   停止服务: docker-compose down"
echo "   重启服务: docker-compose restart"
echo "   查看状态: docker-compose ps" 