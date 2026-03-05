const jwt = require('jsonwebtoken');

function authMiddleware(roles = []) {
  return (req, res, next) => {
    const header = req.headers['authorization'] || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ message: 'Non authentifié' });

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret');
      if (roles.length && !roles.includes(payload.role)) {
        return res.status(403).json({ message: 'Accès refusé' });
      }
      req.user = payload;
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Token invalide' });
    }
  };
}

module.exports = authMiddleware;
