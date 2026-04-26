/**
 * Express middleware: Bearer token must match ADMIN_API_TOKEN.
 */
export function requireAdmin(req, res, next) {
  const expected = process.env.ADMIN_API_TOKEN;
  if (!expected) {
    res.status(503).json({ error: 'Admin API is not configured (ADMIN_API_TOKEN).' });
    return;
  }
  const h = req.headers.authorization;
  if (!h || !h.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing Authorization Bearer token.' });
    return;
  }
  const token = h.slice(7).trim();
  if (token !== expected) {
    res.status(401).json({ error: 'Invalid token.' });
    return;
  }
  next();
}
