# API 接口文档

> 本文档记录所有后端API接口规范，为AI生成后端代码提供准确指导

## HR简历智能体模块

### 1. 简历文件上传接口

**接口名称**: 简历文件上传  
**HTTP方法**: POST  
**接口路径**: `/api/hr/resume/upload`  
**接口用途**: 上传简历文件并进行智能解析

#### 请求参数
- **Content-Type**: `multipart/form-data`
- **参数列表**:

| 参数名 | 类型 | 必填 | 说明 | 示例 |
|--------|------|------|------|------|
| files | File[] | 是 | 简历文件数组，支持PDF/DOC/DOCX | - |
| jobId | string | 否 | 关联的职位ID | "job_001" |
| category | string | 否 | 简历分类 | "frontend" |

#### 响应信息
**成功响应** (200):
```json
{
  "code": 200,
  "message": "上传成功",
  "data": {
    "uploadId": "upload_123456",
    "files": [
      {
        "fileId": "file_001",
        "fileName": "张伟_前端工程师.pdf",
        "fileSize": 1024000,
        "uploadTime": "2024-01-20T10:30:00Z",
        "parseStatus": "parsing"
      }
    ],
    "totalCount": 1
  }
}
```

**错误响应** (400/500):
```json
{
  "code": 400,
  "message": "文件格式不支持",
  "error": "UNSUPPORTED_FILE_TYPE"
}
```

---

### 2. 招聘信息上传接口

**接口名称**: 招聘信息上传  
**HTTP方法**: POST  
**接口路径**: `/api/hr/job/upload`  
**接口用途**: 上传招聘JD文件或直接提交招聘信息

#### 请求参数
```json
{
  "jobInfo": {
    "title": "高级前端工程师",
    "company": "XX科技有限公司",
    "location": "北京",
    "salaryRange": "25-35K",
    "experienceRequired": "3-5年",
    "education": "本科及以上",
    "requiredSkills": ["React", "TypeScript", "Node.js"],
    "preferredSkills": ["Vue.js", "Python"],
    "jobDescription": "负责前端架构设计和开发...",
    "requirements": "熟练掌握React技术栈..."
  },
  "files": "招聘JD文件(可选)"
}
```

#### 响应信息
```json
{
  "code": 200,
  "message": "招聘信息保存成功",
  "data": {
    "jobId": "job_123456",
    "parsedInfo": {
      "extractedSkills": ["React", "TypeScript"],
      "experienceLevel": "高级",
      "priority": "急招"
    }
  }
}
```

---

### 3. 智能体管理接口

**接口名称**: 自定义智能体创建/编辑  
**HTTP方法**: POST/PUT  
**接口路径**: `/api/hr/agent/manage`  
**接口用途**: 创建或编辑自定义智能体

#### 请求参数
```json
{
  "agentId": "custom_agent_001",
  "agentInfo": {
    "name": "技术面试专家",
    "avatar": "🤖",
    "speciality": "技术面试评估",
    "description": "专门针对技术岗位的面试评估专家",
    "systemPrompt": "你是一位经验丰富的技术面试官...",
    "capabilities": ["技术深度评估", "代码能力分析"],
    "category": "面试评估"
  }
}
```

---

### 4. 候选人匹配度分析接口

**接口名称**: 候选人与招聘信息匹配分析  
**HTTP方法**: POST  
**接口路径**: `/api/hr/matching/analyze`  
**接口用途**: 分析候选人与特定招聘信息的匹配程度

#### 请求参数
```json
{
  "jobId": "job_123456",
  "candidates": ["candidate_001", "candidate_002"],
  "analysisType": "detailed"
}
```

#### 响应信息
```json
{
  "code": 200,
  "message": "分析完成",
  "data": {
    "jobInfo": {
      "title": "高级前端工程师",
      "requiredSkills": ["React", "TypeScript"]
    },
    "matchingResults": [
      {
        "candidateId": "candidate_001",
        "name": "张伟",
        "overallMatch": 95,
        "skillsMatch": {
          "matched": ["React", "TypeScript"],
          "missing": ["Vue.js"],
          "bonus": ["Node.js", "Python"],
          "score": 90
        },
        "experienceMatch": {
          "required": "3-5年",
          "actual": "5年",
          "score": 100
        },
        "recommendationReason": "技能匹配度高，经验符合要求"
      }
    ]
  }
}
```

---

## 通用错误码

| 错误码 | HTTP状态码 | 说明 |
|--------|------------|------|
| 400001 | 400 | 请求参数错误 |
| 400002 | 400 | 文件格式不支持 |
| 401001 | 401 | 未授权访问 |
| 500001 | 500 | 服务器内部错误 |

## 环境配置

```bash
# AI服务配置
OPENAI_API_KEY=your_openai_api_key

# 数据库配置
MONGODB_URI=mongodb://localhost:27017/hr_system

# 文件存储配置
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760
```