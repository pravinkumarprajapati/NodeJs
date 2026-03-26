const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config');

function auth(req, res, next) {
  const header = req.header('Authorization');

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const token = header.slice('Bearer '.length);

  try {
    const payload = jwt.verify(token, jwtSecret);
    req.user = { id: payload.sub };
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

module.exports = auth;
