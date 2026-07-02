require('dotenv').config();

const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = Number(process.env.API_PORT || process.env.PORT || 10255);
const HOST = process.env.HOST || '0.0.0.0';
const isProduction = process.env.NODE_ENV === 'production';

if (isProduction && !process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET must be set in production.');
}

const JWT_SECRET = process.env.JWT_SECRET || 'dev-only-jwt-secret';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin';

if (!process.env.JWT_SECRET || !process.env.ADMIN_PASSWORD) {
  console.warn('[kc] Using development auth defaults. Set JWT_SECRET and ADMIN_PASSWORD before production use.');
}

const productDemands = [
  {
    id: 'demand-001',
    title: 'Customer renewal risk dashboard',
    status: 'in-progress',
    priority: 'high',
    urgency: 'high',
    importance: 'high',
    owner: 'Customer Success',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'demand-002',
    title: 'Wine distributor visit report automation',
    status: 'planned',
    priority: 'medium',
    urgency: 'medium',
    importance: 'high',
    owner: 'Market',
    createdAt: new Date().toISOString(),
  },
];

const productProjects = [
  {
    id: 'project-001',
    name: 'Miduo knowledge cockpit',
    status: 'active',
    currentStage: 'prototype',
    manager: 'Product Team',
    progress: 68,
  },
];

const technicalStandards = [
  {
    id: 'std-001',
    title: 'REST API response envelope',
    category: 'backend-api',
    status: 'active',
    priority: 'high',
  },
];

const technicalTasks = [
  {
    id: 'task-001',
    title: 'Normalize frontend API configuration',
    type: 'platform',
    status: 'done',
    priority: 'high',
    assignee: 'Codex',
  },
];

const customers = [
  {
    id: 'customer-001',
    name: 'Demo Wine Group',
    status: 'active',
    level: 'A',
    priority: 'high',
    healthScore: 86,
  },
];

const conversations = new Map();

app.use(helmet({ contentSecurityPolicy: false }));
app.use(compression());
app.use(cors({ origin: process.env.CORS_ORIGIN || true, credentials: true }));
app.use(express.json({ limit: '2mb' }));
app.use(morgan(process.env.LOG_FORMAT || 'dev'));
app.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: Number(process.env.RATE_LIMIT_PER_MINUTE || 240),
  })
);

function ok(data = {}, meta = undefined) {
  return { success: true, data, ...(meta ? { meta } : {}) };
}

function notFound(res, message = 'Not found') {
  return res.status(404).json({ success: false, error: message });
}

function filterList(items, query, keys) {
  return items.filter((item) =>
    keys.every((key) => !query[key] || String(item[key] || '').toLowerCase() === String(query[key]).toLowerCase())
  );
}

app.get('/api/health', (_req, res) => {
  res.json(ok({ service: 'kc-api', status: 'ok', time: new Date().toISOString() }));
});

app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body || {};
  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ success: false, error: 'Invalid admin credentials' });
  }

  const token = jwt.sign({ sub: username, role: 'admin' }, JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '12h' });
  res.json(ok({ token, user: { username, role: 'admin' } }));
});

app.get('/api/products/demands', (req, res) => {
  res.json(ok(filterList(productDemands, req.query, ['status', 'priority', 'urgency', 'importance'])));
});

app.get('/api/products/demands/stats/quadrant', (_req, res) => {
  res.json(
    ok({
      highUrgencyHighImportance: productDemands.filter((item) => item.urgency === 'high' && item.importance === 'high').length,
      highUrgencyLowImportance: 0,
      lowUrgencyHighImportance: productDemands.filter((item) => item.urgency !== 'high' && item.importance === 'high').length,
      lowUrgencyLowImportance: 0,
    })
  );
});

app.get('/api/products/demands/:id', (req, res) => {
  const item = productDemands.find((demand) => demand.id === req.params.id);
  return item ? res.json(ok(item)) : notFound(res, 'Demand not found');
});

app.get('/api/products/projects', (req, res) => {
  res.json(ok(filterList(productProjects, req.query, ['status', 'currentStage', 'manager'])));
});

app.get('/api/products/projects/:id', (req, res) => {
  const item = productProjects.find((project) => project.id === req.params.id);
  return item ? res.json(ok(item)) : notFound(res, 'Project not found');
});

app.get('/api/technical/standards', (req, res) => {
  res.json(ok(filterList(technicalStandards, req.query, ['category', 'status', 'priority'])));
});

app.get('/api/technical/standards/:id', (req, res) => {
  const item = technicalStandards.find((standard) => standard.id === req.params.id);
  return item ? res.json(ok(item)) : notFound(res, 'Standard not found');
});

app.get('/api/technical/tasks', (req, res) => {
  res.json(ok(filterList(technicalTasks, req.query, ['type', 'status', 'priority', 'assignee'])));
});

app.get('/api/technical/reports', (_req, res) => {
  res.json(ok([]));
});

app.get('/api/customers', (req, res) => {
  const search = String(req.query.search || '').toLowerCase();
  const filtered = filterList(customers, req.query, ['status', 'level', 'priority']).filter(
    (customer) => !search || customer.name.toLowerCase().includes(search)
  );
  res.json(ok(filtered));
});

app.get('/api/customers/:id', (req, res) => {
  const item = customers.find((customer) => customer.id === req.params.id);
  return item ? res.json(ok(item)) : notFound(res, 'Customer not found');
});

app.get('/api/analytics', (_req, res) => {
  res.json(
    ok({
      customers: customers.length,
      activeProjects: productProjects.filter((project) => project.status === 'active').length,
      openDemands: productDemands.filter((demand) => demand.status !== 'done').length,
      averageHealthScore: 86,
    })
  );
});

function buildAiResponse(message) {
  return {
    response: `Local KC assistant received: ${message || 'empty message'}. Configure a real AI provider behind /api/ai/chat when ready.`,
    suggestions: ['Review customer health score', 'Create renewal action', 'Summarize account context'],
  };
}

app.post('/api/ai/chat', (req, res) => {
  const conversationId = req.body.conversationId || uuidv4();
  const data = buildAiResponse(req.body.message);
  conversations.set(conversationId, [...(conversations.get(conversationId) || []), { role: 'assistant', ...data }]);
  res.json(ok({ conversationId, ...data }));
});

app.post('/api/ai/chat/stream', async (req, res) => {
  const conversationId = req.body.conversationId || uuidv4();
  const data = buildAiResponse(req.body.message);
  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.write(`data: ${JSON.stringify({ type: 'start', conversationId })}\n\n`);
  for (const char of data.response) {
    res.write(`data: ${JSON.stringify({ type: 'delta', content: char, timestamp: new Date().toISOString() })}\n\n`);
  }
  res.write(`data: ${JSON.stringify({ type: 'done', fullResponse: data.response, suggestions: data.suggestions })}\n\n`);
  res.end();
});

app.get('/api/ai/models', (_req, res) => {
  res.json(ok([{ id: 'local-mock', name: 'Local Mock', provider: 'kc' }]));
});

app.get('/api/ai/conversations/:id', (req, res) => {
  res.json(ok({ id: req.params.id, messages: conversations.get(req.params.id) || [] }));
});

app.delete('/api/ai/conversations/:id', (req, res) => {
  conversations.delete(req.params.id);
  res.json(ok({ id: req.params.id, deleted: true }));
});

app.get('/api/ai/knowledge', (_req, res) => {
  res.json(ok([{ id: 'kb-001', category: 'customer-success', title: 'Renewal playbook' }]));
});

app.post('/api/ai/knowledge/search', (req, res) => {
  res.json(ok([{ id: 'kb-001', title: 'Renewal playbook', snippet: `Matched query: ${req.body.query || ''}` }]));
});

app.get('/api/ai/knowledge/stats', (_req, res) => {
  res.json(ok({ total: 1, categories: ['customer-success'] }));
});

app.post('/api/ai/knowledge/faq', (req, res) => {
  res.json(ok({ answer: `FAQ placeholder for: ${req.body.question || ''}` }));
});

app.get('/api/ai/health', (_req, res) => {
  res.json(ok({ status: 'ok', model: 'local-mock' }));
});

const buildDir = path.join(__dirname, 'build');
app.use(express.static(buildDir));
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) return next();
  res.sendFile(path.join(buildDir, 'index.html'), (error) => {
    if (error) res.status(404).json({ success: false, error: 'Build output not found. Run npm run build first.' });
  });
});

app.listen(PORT, HOST, () => {
  const displayHost = HOST === '0.0.0.0' ? 'localhost' : HOST;
  console.log(`KC API listening on http://${displayHost}:${PORT}`);
});
