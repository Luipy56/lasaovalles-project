import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { ZodError } from 'zod';
import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';

import { requireAdmin } from './adminAuth.js';
import { getCatalogPath, readCatalog, writeCatalogAtomic } from './catalogStore.js';
import { parseAndValidateCatalog } from './catalogSchema.js';
import { handlePostOrder } from './ordersHandler.js';
import { isMailConfigured } from './mailSend.js';

const __apiDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
dotenv.config({ path: path.join(__apiDir, '.env') });

const devCatalogErrors =
  String(process.env.NODE_ENV || '').toLowerCase() !== 'production' || process.env.API_DEBUG_CATALOG === '1';

const PORT = Number(process.env.PORT || 3000);
const app = express();

const corsOrigin = process.env.CORS_ORIGIN;
app.use(
  cors(
    corsOrigin
      ? { origin: corsOrigin.split(',').map((s) => s.trim()), credentials: false }
      : { origin: true }
  )
);
app.use(express.json({ limit: '1mb' }));

const api = express.Router();

/**
 * @param {import('express').Response} res
 * @param {unknown} e
 */
function sendCatalogReadError(res, e) {
  console.error(e);
  if (e && typeof e === 'object' && 'code' in e && e.code === 'ENOENT') {
    res.status(500).json({
      error: 'Catalog file not found. Check CATALOG_PATH or api/data/order-catalog.json.',
      ...(devCatalogErrors && { catalogPath: getCatalogPath() })
    });
    return;
  }
  if (e instanceof ZodError) {
    res.status(500).json({
      error: 'Catalog JSON is invalid (schema).',
      ...(devCatalogErrors && { details: e.flatten(), issues: e.issues })
    });
    return;
  }
  if (e instanceof SyntaxError) {
    res.status(500).json({
      error: 'Catalog file is not valid JSON.',
      ...(devCatalogErrors && { message: e.message })
    });
    return;
  }
  res.status(500).json({ error: 'Could not read catalog.' });
}

api.get('/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'lasaovalles-api',
    mailConfigured: isMailConfigured()
  });
});

api.get('/catalog', (_req, res) => {
  try {
    res.json(readCatalog());
  } catch (e) {
    sendCatalogReadError(res, e);
  }
});

api.get('/admin/catalog', requireAdmin, (_req, res) => {
  try {
    res.json(readCatalog());
  } catch (e) {
    sendCatalogReadError(res, e);
  }
});

api.put('/admin/catalog', requireAdmin, (req, res) => {
  try {
    const body = parseAndValidateCatalog(req.body);
    const saved = writeCatalogAtomic(body);
    res.json(saved);
  } catch (e) {
    if (e.name === 'ZodError') {
      res.status(400).json({ error: 'Invalid catalog JSON', details: e.errors });
      return;
    }
    console.error(e);
    res.status(500).json({ error: 'Could not save catalog.' });
  }
});

const orderLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: Number(process.env.ORDER_RATE_MAX || 30),
  standardHeaders: true,
  legacyHeaders: false
});

api.post('/orders', orderLimiter, handlePostOrder);

app.use('/api', api);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal error.' });
});

app.listen(PORT, () => {
  console.log(`lasaovalles-api listening on http://127.0.0.1:${PORT}`);
});
