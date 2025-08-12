# 万花筒智能体后端API接口规范

## 业务背景
万花筒智能体是一个专注于产品方案可视化设计和呈现的AI智能体，主要用于根据用户输入的产品需求生成视觉化方案、设计用户界面、制定设计规范等。

## 核心功能需求
1. 接收用户产品需求文本输入
2. 生成视觉化设计方案
3. 提供设计建议和最佳实践
4. 支持流式响应展示设计过程
5. 返回结构化的设计方案数据

## API接口定义

### 1. 万花筒智能体对话接口

#### 请求类型：POST
#### 接口路径：`/ai/agents/kaleidoscope/chat`

#### 请求参数
```json
{
  "message": "用户输入的产品需求描述",
  "conversationId": "会话ID（可选）",
  "designType": "设计类型：ui, prototype, wireframe, visual",
  "outputFormat": "输出格式：structured, markdown, json",
  "context": {
    "projectName": "项目名称",
    "targetPlatform": "目标平台：web, mobile, desktop",
    "designStyle": "设计风格：modern, minimalist, corporate",
    "colorScheme": "色彩方案偏好"
  }
}
```

#### 响应格式
```json
{
  "success": true,
  "data": {
    "conversationId": "会话ID",
    "response": "设计方案描述",
    "designSuggestions": [
      {
        "category": "建议分类",
        "title": "建议标题",
        "description": "详细描述",
        "priority": "high|medium|low"
      }
    ],
    "visualElements": [
      {
        "elementType": "元素类型：layout, color, typography, icon",
        "recommendation": "推荐内容",
        "rationale": "推荐理由"
      }
    ],
    "prototypeStructure": {
      "pages": [
        {
          "name": "页面名称",
          "components": ["组件列表"],
          "wireframe": "线框图描述"
        }
      ]
    },
    "designSpecs": {
      "colorPalette": ["建议色板"],
      "typography": {
        "primaryFont": "主字体",
        "secondaryFont": "辅助字体",
        "fontSizes": {}
      },
      "spacing": {},
      "components": []
    }
  },
  "timestamp": "时间戳"
}
```

### 2. 万花筒智能体流式对话接口

#### 请求类型：POST
#### 接口路径：`/ai/agents/kaleidoscope/chat/stream`

#### 请求参数（同普通接口）

#### 响应格式（SSE流式）
```
data: {"type":"start","conversationId":"xxx"}

data: {"type":"thinking","content":"正在分析您的产品需求..."}

data: {"type":"design_analysis","content":"基于您的需求，我建议采用现代简约风格..."}

data: {"type":"visual_suggestion","content":{"elementType":"layout","recommendation":"响应式栅格布局"}}

data: {"type":"color_palette","content":{"colors":["#3B82F6","#EF4444","#10B981"],"description":"专业且友好的配色方案"}}

data: {"type":"component_structure","content":{"components":["Header","Navigation","ContentArea","Footer"]}}

data: {"type":"done","fullResponse":"完整的设计方案...","designSpecs":{...}}
```

## CURL示例

### 普通对话请求
```bash
curl -X POST "http://localhost:10255/api/ai/agents/kaleidoscope/chat" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "message": "帮我设计一个现代化的电商网站首页，要求简洁美观，突出产品展示",
    "designType": "ui",
    "outputFormat": "structured",
    "context": {
      "projectName": "时尚电商平台",
      "targetPlatform": "web",
      "designStyle": "modern",
      "colorScheme": "warm"
    }
  }'
```

### 流式对话请求
```bash
curl -X POST "http://localhost:10255/api/ai/agents/kaleidoscope/chat/stream" \
  -H "Content-Type: application/json" \
  -H "Accept: text/event-stream" \
  -d '{
    "message": "设计一个移动端的任务管理应用界面",
    "designType": "prototype",
    "outputFormat": "json",
    "context": {
      "targetPlatform": "mobile",
      "designStyle": "minimalist"
    }
  }'
```

## 后端实现提示词

### AI模型配置建议
- 使用支持结构化输出的大语言模型（如GPT-4、Claude-3.5等）
- 设置合适的温度值（0.7-0.8）以平衡创意和准确性
- 配置足够的上下文窗口以处理复杂的设计需求

### 系统提示词
```
你是万花筒智能体，专注于产品方案的可视化设计和呈现。

核心能力：
1. 根据产品需求生成视觉化方案
2. 设计用户界面和交互流程  
3. 提供设计建议和最佳实践
4. 生成产品原型和效果图
5. 制定视觉设计规范

响应要求：
- 始终以用户需求为中心
- 提供具体可操作的设计建议
- 考虑用户体验和可用性
- 遵循现代设计趋势和最佳实践
- 输出结构化的设计方案数据

当用户提出设计需求时：
1. 首先分析需求的核心目标和约束条件
2. 提出多个设计方向和选择理由
3. 详细说明视觉元素的选择依据
4. 提供完整的设计规范和组件结构
5. 给出实现建议和优化方案

请以创意、美观、实用的方式帮助用户实现产品可视化需求。
```

### 错误处理
API应当处理以下错误情况：
- 无效的设计类型参数
- 空的或过短的用户输入
- 模型响应超时
- 结构化数据解析失败

### 响应时间要求
- 普通模式：< 10秒
- 流式模式：首次响应 < 2秒，持续输出
- 设计方案生成：< 30秒（复杂需求）

### 数据验证
- message字段：最少10个字符，最多2000个字符
- designType：枚举值验证
- context参数：可选但需要格式验证
- conversationId：UUID格式验证

## 业务场景示例

### 场景1：电商网站设计
输入："设计一个卖家居用品的电商网站"
期望输出：包含首页布局、商品展示、购物车、用户中心等页面的设计方案

### 场景2：移动应用界面
输入："设计一个健身打卡的手机应用界面"
期望输出：包含登录、首页、运动记录、数据统计等界面的原型设计

### 场景3：企业官网改版
输入："重新设计我们公司的官网，体现科技感和专业性"
期望输出：包含色彩方案、字体选择、页面布局、交互设计的完整方案