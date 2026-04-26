#!/usr/bin/env node
/**
 * One-off / repeatable import from La Saó weekly order Excel → order-catalog.json
 * Usage: node scripts/import-catalog-from-xlsx.mjs [path/to.xlsx] [output.json]
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import XLSX from 'xlsx';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
/** Parent of `saovalles/` (optional reference material: phase-zero, etc.) */
const workspaceExternalRoot = path.resolve(__dirname, '../../..');
const defaultXlsx = path.join(workspaceExternalRoot, 'phase-zero/LaSao_Comanda2504-32cffa9f.xlsx');
const defaultOut = path.join(__dirname, '../data/order-catalog.json');

const xlsxPath = path.resolve(process.argv[2] || defaultXlsx);
const outPath = path.resolve(process.argv[3] || defaultOut);

function slugify(s) {
  return String(s)
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 48);
}

function parsePrice(v) {
  if (v === '' || v === null || v === undefined) return null;
  if (typeof v === 'number' && !Number.isNaN(v)) return v;
  const s = String(v).replace(',', '.').trim();
  const n = parseFloat(s);
  return Number.isFinite(n) ? n : null;
}

function main() {
  if (!fs.existsSync(xlsxPath)) {
    console.error('Missing xlsx:', xlsxPath);
    process.exit(1);
  }
  const wb = XLSX.readFile(xlsxPath);
  const sheetName = wb.SheetNames.includes('CISTELLA') ? 'CISTELLA' : wb.SheetNames[0];
  const data = XLSX.utils.sheet_to_json(wb.Sheets[sheetName], { header: 1, defval: '' });

  let catTitle = 'ALTRES';
  const rows = [];

  for (let i = 3; i < data.length; i++) {
    const r = data[i];
    const c1 = String(r[1] || '').trim();
    if (c1) {
      catTitle = c1.replace(/\r?\n+/g, ' ').replace(/\s+/g, ' ').trim();
    }
    const name = String(r[2] || '').trim();
    if (!name || /^DEMANAR\b/i.test(name)) continue;

    const code = String(r[0] || '').trim();
    const origin = String(r[3] || '').trim();
    const unit = String(r[6] || '').trim();
    const price = parsePrice(r[7]);
    if (price === null && !unit) continue;

    const id = code || `row-${i}`;
    rows.push({
      id,
      categoryTitle: catTitle,
      nameCa: name,
      nameEs: name,
      originCa: origin,
      originEs: origin,
      unitCa: unit,
      unitEs: unit,
      price: price ?? 0,
      notesCa: '',
      notesEs: '',
      sortOrder: rows.length
    });
  }

  const byCat = new Map();
  for (const row of rows) {
    if (!byCat.has(row.categoryTitle)) {
      byCat.set(row.categoryTitle, []);
    }
    const { categoryTitle, ...item } = row;
    byCat.get(categoryTitle).push(item);
  }

  const categories = [];
  let order = 0;
  for (const [titleCa, items] of byCat.entries()) {
    const id = `cat-${slugify(titleCa) || order}`;
    categories.push({
      id,
      titleCa,
      titleEs: titleCa,
      sortOrder: order++,
      items: items.map((it, j) => ({ ...it, sortOrder: j }))
    });
  }

  const catalog = {
    version: 1,
    updatedAt: new Date().toISOString(),
    categories
  };

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(catalog, null, 2), 'utf8');
  console.log('Wrote', outPath, 'categories:', categories.length, 'items:', rows.length);
}

main();
