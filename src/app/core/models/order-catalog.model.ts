/** Mirrors `api/data/order-catalog.json` (Phase 2 catalog). */

export interface OrderCatalogItem {
  id: string;
  nameCa: string;
  nameEs: string;
  originCa: string;
  originEs: string;
  unitCa: string;
  unitEs: string;
  price: number;
  notesCa: string;
  notesEs: string;
  sortOrder: number;
}

export interface OrderCatalogCategory {
  id: string;
  titleCa: string;
  titleEs: string;
  sortOrder: number;
  items: OrderCatalogItem[];
}

export interface OrderCatalog {
  version: number;
  updatedAt: string;
  categories: OrderCatalogCategory[];
}

export interface OrderSubmitLine {
  itemId: string;
  quantity: number;
}

export interface OrderSubmitPayload {
  customerEmail: string;
  customerName: string;
  phone?: string;
  shippingAddress: string;
  lang: 'ca' | 'es';
  acceptPolicy: true;
  lines: OrderSubmitLine[];
}
