const jwt = require('jsonwebtoken');

// JWT认证中间件
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      error: '访问令牌缺失',
      code: 'TOKEN_MISSING'
    });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'default_secret', (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        error: '访问令牌无效',
        code: 'TOKEN_INVALID'
      });
    }

    req.user = user;
    next();
  });
};

// 可选认证中间件（不强制要求token）
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET || 'default_secret', (err, user) => {
      if (!err) {
        req.user = user;
      }
    });
  }

  next();
};

// 角色权限检查中间件
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: '需要登录',
        code: 'AUTHENTICATION_REQUIRED'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: '权限不足',
        code: 'INSUFFICIENT_PERMISSIONS'
      });
    }

    next();
  };
};

module.exports = {
  authenticateToken,
  optionalAuth,
  requireRole
}; 