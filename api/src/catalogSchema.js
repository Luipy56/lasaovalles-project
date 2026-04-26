import { z } from 'zod';

export const catalogItemSchema = z.object({
  id: z.string().min(1).max(80),
  nameCa: z.string(),
  nameEs: z.string(),
  originCa: z.string(),
  originEs: z.string(),
  unitCa: z.string(),
  unitEs: z.string(),
  price: z.number().finite().nonnegative(),
  notesCa: z.string(),
  notesEs: z.string(),
  sortOrder: z.number().int().nonnegative()
});

export const catalogCategorySchema = z.object({
  id: z.string().min(1).max(80),
  titleCa: z.string(),
  titleEs: z.string(),
  sortOrder: z.number().int().nonnegative(),
  items: z.array(catalogItemSchema)
});

export const catalogSchema = z.object({
  version: z.number().int().positive(),
  updatedAt: z.string().min(10),
  categories: z.array(catalogCategorySchema).min(1)
});

/** @param {unknown} body */
export function parseAndValidateCatalog(body) {
  return catalogSchema.parse(body);
}
