import { randomUUID } from 'node:crypto';
import { ZodError } from 'zod';

import { catalogItemIndex, readCatalog } from './catalogStore.js';
import { getOrderEmailLogoAttachment } from './emailAssets.js';
import { buildCustomerMail, buildOwnerMail } from './orderEmails.js';
import { getMailConfigGaps, isMailConfigured, sendMail } from './mailSend.js';
import { submitOrderBodySchema } from './ordersSchema.js';

function roundMoney(n) {
  return Math.round(n * 100) / 100;
}

const isProd = String(process.env.NODE_ENV || '').toLowerCase() === 'production';

export async function handlePostOrder(req, res) {
  if (!isMailConfigured()) {
    const body = {
      error:
        'Order email is not configured. Set SMTP_HOST, SMTP_USER, SMTP_PASS, MAIL_FROM, OWNER_EMAIL in api/.env (see api/.env.example).'
    };
    if (!isProd) {
      body.missingEnv = getMailConfigGaps();
    }
    res.status(503).json(body);
    return;
  }

  let body;
  try {
    body = submitOrderBodySchema.parse(req.body);
  } catch (e) {
    if (e instanceof ZodError) {
      res.status(400).json({ error: 'Invalid order payload', details: e.errors });
      return;
    }
    throw e;
  }

  const activeLines = body.lines.filter((l) => l.quantity > 0);
  if (activeLines.length === 0) {
    res.status(400).json({ error: 'At least one line with quantity greater than 0 is required.' });
    return;
  }

  let catalog;
  try {
    catalog = readCatalog();
  } catch {
    res.status(500).json({ error: 'Catalog unavailable.' });
    return;
  }

  const index = catalogItemIndex(catalog);
  const lang = body.lang;
  const nameKey = lang === 'es' ? 'nameEs' : 'nameCa';
  const unitKey = lang === 'es' ? 'unitEs' : 'unitCa';

  /** @type {Array<{ name: string; unit: string; unitPrice: number; quantity: number; lineTotal: number }>} */
  const rows = [];
  let grandTotal = 0;

  for (const line of activeLines) {
    const hit = index.get(line.itemId);
    if (!hit) {
      res.status(400).json({ error: `Unknown item id: ${line.itemId}` });
      return;
    }
    const { item } = hit;
    const unitPrice = item.price;
    const lineTotal = roundMoney(unitPrice * line.quantity);
    grandTotal += lineTotal;
    rows.push({
      name: item[nameKey] || item.nameCa,
      unit: item[unitKey] || item.unitCa,
      unitPrice,
      quantity: line.quantity,
      lineTotal
    });
  }

  grandTotal = roundMoney(grandTotal);
  const orderId = randomUUID().slice(0, 8);
  const ownerContact = process.env.OWNER_EMAIL;

  const logoAtt = getOrderEmailLogoAttachment();
  const hasLogo = Boolean(logoAtt);

  const ownerPayload = buildOwnerMail({
    orderId,
    lang,
    hasLogo,
    customer: {
      customerName: body.customerName,
      customerEmail: body.customerEmail,
      phone: body.phone,
      shippingAddress: body.shippingAddress
    },
    rows,
    grandTotal
  });

  const customerPayload = buildCustomerMail({
    orderId,
    lang,
    hasLogo,
    ownerContactEmail: ownerContact,
    customer: {
      customerName: body.customerName,
      customerEmail: body.customerEmail,
      phone: body.phone,
      shippingAddress: body.shippingAddress
    },
    rows,
    grandTotal
  });

  try {
    const mailAttachments = logoAtt ? [logoAtt] : undefined;
    await sendMail({
      to: ownerContact,
      subject: ownerPayload.subject,
      text: ownerPayload.text,
      html: ownerPayload.html,
      replyTo: body.customerEmail,
      attachments: mailAttachments
    });
    await sendMail({
      to: body.customerEmail,
      subject: customerPayload.subject,
      text: customerPayload.text,
      html: customerPayload.html,
      replyTo: ownerContact,
      attachments: mailAttachments
    });
  } catch (e) {
    console.error('sendMail failed', e);
    res.status(502).json({ error: 'Could not send email. Try again later.' });
    return;
  }

  res.status(201).json({ ok: true, orderId });
}
