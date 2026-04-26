import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { catalogSchema } from './catalogSchema.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function getCatalogPath() {
  const p = process.env.CATALOG_PATH;
  if (p) return path.resolve(p);
  return path.join(__dirname, '../data/order-catalog.json');
}

export function readCatalog() {
  const file = getCatalogPath();
  const raw = fs.readFileSync(file, 'utf8');
  const data = JSON.parse(raw);
  return catalogSchema.parse(data);
}

/**
 * @param {import('zod').infer<typeof catalogSchema>} catalog
 */
export function writeCatalogAtomic(catalog) {
  const validated = catalogSchema.parse(catalog);
  validated.updatedAt = new Date().toISOString();
  const file = getCatalogPath();
  const dir = path.dirname(file);
  fs.mkdirSync(dir, { recursive: true });
  const tmp = `${file}.${process.pid}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(validated, null, 2), 'utf8');
  fs.renameSync(tmp, file);
  return validated;
}

/**
 * Build item id → item with category titles for pricing.
 * @param {import('zod').infer<typeof catalogSchema>} catalog
 */
export function catalogItemIndex(catalog) {
  /** @type {Map<string, { item: import('zod').infer<typeof catalogSchema>['categories'][0]['items'][0], categoryId: string, titleCa: string, titleEs: string }>} */
  const map = new Map();
  for (const cat of catalog.categories) {
    for (const item of cat.items) {
      map.set(item.id, { item, categoryId: cat.id, titleCa: cat.titleCa, titleEs: cat.titleEs });
    }
  }
  return map;
}
