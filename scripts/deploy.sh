#!/bin/bash
# ============================================================
# 米多智库 - 一键发布脚本
# 用法:
#   ./scripts/deploy.sh              # 默认 patch 版本发布
#   ./scripts/deploy.sh minor        # minor 版本发布
#   ./scripts/deploy.sh major        # major 版本发布
#   ./scripts/deploy.sh --skip-merge # 仅构建检查，不合并推送
# ============================================================

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # 无颜色

# 配置
DEPLOY_BRANCH="master"
REPO_URL="https://github.com/inernoro/kc"

# 参数解析
VERSION_TYPE="${1:-patch}"
SKIP_MERGE=false

for arg in "$@"; do
  case $arg in
    --skip-merge) SKIP_MERGE=true; shift ;;
    patch|minor|major) VERSION_TYPE="$arg"; shift ;;
  esac
done

echo ""
echo -e "${CYAN}================================================${NC}"
echo -e "${CYAN}     米多智库 - 一键发布流程${NC}"
echo -e "${CYAN}================================================${NC}"
echo ""

# ----------------------------------------------------------
# Step 1: 环境检查
# ----------------------------------------------------------
echo -e "${BLUE}[1/6] 环境检查...${NC}"

if ! git diff --quiet HEAD 2>/dev/null; then
  echo -e "${RED}  [!] 工作目录有未提交的更改，请先 commit${NC}"
  git status --short
  exit 1
fi

CURRENT_BRANCH=$(git branch --show-current)
echo -e "${GREEN}  当前分支: ${CURRENT_BRANCH}${NC}"
echo -e "${GREEN}  发布类型: ${VERSION_TYPE}${NC}"
echo -e "${GREEN}  目标分支: ${DEPLOY_BRANCH}${NC}"

# ----------------------------------------------------------
# Step 2: 安装依赖
# ----------------------------------------------------------
echo ""
echo -e "${BLUE}[2/6] 安装依赖...${NC}"
npm ci --silent 2>/dev/null || npm install --silent
echo -e "${GREEN}  依赖安装完成${NC}"

# ----------------------------------------------------------
# Step 3: 构建检查
# ----------------------------------------------------------
echo ""
echo -e "${BLUE}[3/6] 构建检查...${NC}"
CI=false npm run build > /dev/null 2>&1
if [ $? -ne 0 ]; then
  echo -e "${RED}  [!] 构建失败，请修复错误后重试${NC}"
  CI=false npm run build
  exit 1
fi

BUILD_SIZE=$(du -sh build/ | cut -f1)
echo -e "${GREEN}  构建成功! 产物大小: ${BUILD_SIZE}${NC}"

# ----------------------------------------------------------
# Step 4: 版本号递增
# ----------------------------------------------------------
echo ""
echo -e "${BLUE}[4/6] 版本管理...${NC}"

OLD_VERSION=$(node -p "require('./package.json').version")

# 手动计算新版本号（兼容无 npm version 的环境）
IFS='.' read -r MAJOR MINOR PATCH <<< "$OLD_VERSION"
case $VERSION_TYPE in
  major) MAJOR=$((MAJOR + 1)); MINOR=0; PATCH=0 ;;
  minor) MINOR=$((MINOR + 1)); PATCH=0 ;;
  patch) PATCH=$((PATCH + 1)) ;;
esac
NEW_VERSION="${MAJOR}.${MINOR}.${PATCH}"

# 更新 package.json 中的版本号
node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
pkg.version = '${NEW_VERSION}';
fs.writeFileSync('./package.json', JSON.stringify(pkg, null, 2) + '\n');
"

echo -e "${GREEN}  版本: ${OLD_VERSION} -> ${NEW_VERSION}${NC}"

# 提交版本变更
git add package.json
git commit -m "release: v${NEW_VERSION}" --quiet

# 创建 git tag
git tag -a "v${NEW_VERSION}" -m "Release v${NEW_VERSION}"
echo -e "${GREEN}  Git tag: v${NEW_VERSION}${NC}"

if [ "$SKIP_MERGE" = true ]; then
  echo ""
  echo -e "${YELLOW}[--skip-merge] 已跳过合并和推送${NC}"
  echo -e "${GREEN}  版本 v${NEW_VERSION} 已在本地准备完毕${NC}"
  echo -e "${YELLOW}  手动发布: git push origin ${DEPLOY_BRANCH} --tags${NC}"
  exit 0
fi

# ----------------------------------------------------------
# Step 5: 合并到发布分支
# ----------------------------------------------------------
echo ""
echo -e "${BLUE}[5/6] 合并到 ${DEPLOY_BRANCH}...${NC}"

git checkout "${DEPLOY_BRANCH}" --quiet
git merge "${CURRENT_BRANCH}" --no-edit --quiet
echo -e "${GREEN}  合并完成: ${CURRENT_BRANCH} -> ${DEPLOY_BRANCH}${NC}"

# ----------------------------------------------------------
# Step 6: 推送并触发部署
# ----------------------------------------------------------
echo ""
echo -e "${BLUE}[6/6] 推送到远程仓库...${NC}"

PUSH_SUCCESS=false
for i in 1 2 3 4; do
  if git push origin "${DEPLOY_BRANCH}" --tags 2>/dev/null; then
    PUSH_SUCCESS=true
    break
  fi
  WAIT=$((2 ** i))
  echo -e "${YELLOW}  推送失败，${WAIT}秒后重试 (${i}/4)...${NC}"
  sleep $WAIT
done

if [ "$PUSH_SUCCESS" = false ]; then
  echo -e "${RED}  [!] 推送失败，请手动执行: git push origin ${DEPLOY_BRANCH} --tags${NC}"
  git checkout "${CURRENT_BRANCH}" --quiet
  exit 1
fi

# 切回工作分支
git checkout "${CURRENT_BRANCH}" --quiet

echo ""
echo -e "${CYAN}================================================${NC}"
echo -e "${GREEN}  发布成功! v${NEW_VERSION}${NC}"
echo -e "${CYAN}================================================${NC}"
echo ""
echo -e "  Git Tag:     v${NEW_VERSION}"
echo -e "  发布分支:    ${DEPLOY_BRANCH}"
echo -e "  GitHub Actions 正在自动部署..."
echo -e "  查看部署状态: ${REPO_URL}/actions"
echo -e "  访问地址:     https://inernoro.github.io/kc/"
echo ""
