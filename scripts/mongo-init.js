// 🍃 MongoDB初始化脚本
// 初始化米多智库数据库和基础数据

// 切换到米多智库数据库
db = db.getSiblingDB('mido-knowledge-base');

// 创建用户
db.createUser({
  user: 'admin',
  pwd: 'midopassword123',
  roles: [
    { role: 'readWrite', db: 'mido-knowledge-base' },
    { role: 'dbAdmin', db: 'mido-knowledge-base' }
  ]
});

print('✅ 数据库用户创建成功');

// 创建客户集合并插入示例数据
db.customers.insertMany([
  {
    _id: ObjectId(),
    id: "1",
    name: "张伟",
    company: "北京酒业有限公司",
    email: "zhangwei@beijingjiu.com",
    phone: "+86 138-0013-8001",
    level: "S",
    status: "active",
    priority: "high",
    region: "华北",
    totalRevenue: 1200000,
    lastContact: new Date("2024-01-20"),
    riskLevel: "low",
    tags: ["VIP客户", "重点关注", "长期合作"],
    avatar: "/avatars/zhang.jpg",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    id: "2", 
    name: "李娜",
    company: "上海品酒集团",
    email: "lina@shanghaipinjiu.com",
    phone: "+86 139-0013-8002",
    level: "A",
    status: "active",
    priority: "medium",
    region: "华东",
    totalRevenue: 800000,
    lastContact: new Date("2024-01-18"),
    riskLevel: "medium",
    tags: ["潜力客户", "增长快速"],
    avatar: "/avatars/li.jpg",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

print('✅ 客户数据初始化完成');

// 创建对话历史集合
db.conversations.createIndex({ "conversationId": 1 });
db.conversations.createIndex({ "customerId": 1 });
db.conversations.createIndex({ "timestamp": -1 });

print('✅ 对话集合索引创建完成');

// 创建知识库集合并插入基础数据
db.knowledge.insertMany([
  {
    _id: ObjectId(),
    category: "products",
    type: "白酒",
    content: {
      brands: ["茅台", "五粮液", "剑南春", "泸州老窖", "郎酒", "水井坊"],
      description: "高端白酒品牌，适合商务场合和节日赠礼"
    },
    tags: ["白酒", "高端", "礼品"],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    category: "salesStrategies",
    type: "高端白酒",
    content: {
      target: "S级、A级客户",
      approach: "礼品包装、限量版、品牌故事营销",
      seasonality: "春节、中秋节重点推广",
      profit_margin: "30-50%"
    },
    tags: ["销售策略", "高端", "白酒"],
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

print('✅ 知识库数据初始化完成');

// 创建分析数据集合
db.analytics.insertOne({
  _id: ObjectId(),
  type: "global_metrics",
  data: {
    totalCustomers: 150,
    activeCustomers: 120,
    totalRevenue: 15600000,
    monthlyGrowth: 12.5,
    lastUpdated: new Date()
  },
  createdAt: new Date(),
  updatedAt: new Date()
});

print('✅ 分析数据初始化完成');

// 创建产品需求集合
db.productDemands.createIndex({ "priority": 1, "urgency": 1 });
db.productDemands.createIndex({ "status": 1 });

print('✅ 产品需求集合索引创建完成');

// 创建技术规范集合
db.technicalStandards.createIndex({ "category": 1, "status": 1 });

print('✅ 技术规范集合索引创建完成');

print('�� 米多智库数据库初始化完成！'); 