import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { ORDER_EMAIL_LOGO_CID } from './emailAssets.js';

const _apiDir = dirname(fileURLToPath(import.meta.url));
const API_VERSION = (() => {
  try {
    return JSON.parse(readFileSync(join(_apiDir, '../package.json'), 'utf8'))?.version ?? '0.0.0';
  } catch {
    return '0.0.0';
  }
})();

const BRAND_HEADER_BG = '#2a5434';
const BRAND_MUTED = '#4a5c4a';
const BREAD_BG = '#e8f0e6';
const PANEL_BG = '#fbfcf9';
const BORDER = '#c5d4c0';

function escHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** @param {'ca'|'es'} lang */
function eur(n, lang) {
  return new Intl.NumberFormat(lang === 'es' ? 'es-ES' : 'ca-ES', { style: 'currency', currency: 'EUR' }).format(n);
}

function getWebUrl() {
  return (process.env.PUBLIC_WEB_URL || 'https://www.lasaovalles.cat').replace(/\/$/, '');
}

const COPY = {
  ca: {
    ownerSubject: (id) => `[La Saó] Nou comanda #${id}`,
    customerSubject: (id) => `[La Saó] Hem rebut el teu comanda #${id}`,
    preheaderOwner: (id) => `Nou comanda #${id} des de la pàgina de La Saó Vallès.`,
    preheaderCustomer: (id) => `Hem rebut bé’l comanda #${id}. Resum a continuació, conserva’l com a comprovant.`,
    h1Owner: 'Nou comanda rebut al formulari en línia',
    subtitleOwner: (id) => `A continuació el resum amb referència <strong style="color:${BRAND_HEADER_BG}">#${escHtml(String(id))}</strong> : dades de la persona que envia, adreça i línies demanades.`,
    h1Customer: 'Gràcies per comandar amb La Saó Vallès',
    subtitleCustomer: (id) =>
      `Hem rebut bé’l comanda. La referència és <strong style="color:${BRAND_HEADER_BG}">#${escHtml(String(id))}</strong>. Sota tens el resum i, més avall, com seguim a partir d’ara.`,
    trustLine: 'Agraïm la teva confiança: des del Vallès, de l’hort a la taula, producte de qualitat de proximitat en família que fa anys se’n encarrega.',
    customerIntro:
      "Aquest missatge és un comprovant. Qualsevol canvi o confirmació d’import i repart t’arribarà d’un altre correu, directament des del titular.",
    customerSteps: `Passos següents
1) El titular repassa el comanda i t’escriu al correu per confirmar l’import final, la disponibilitat i el dia de repartiment.
2) Canvis o dubtes: adreça de contacte, més avall (més còmode que no pas respondre a aquesta adreça automàtica).
3) El pagament i l’entrega, segons s’hagi concretat (sovint en efectiu o per transferència: ho confirmen per mail).`,

    sectionClient: 'Dades de contacte',
    sectionAddress: 'Adreça d’entrega',
    sectionLines: 'Línies del comanda',
    colProduct: 'Producte',
    colUnit: 'Unitat',
    colPrice: 'Preu',
    colQty: 'Quant.',
    colSubtotal: 'Subtotal',
    total: 'Total',
    orderIdLabel: 'Núm. de comanda',
    phoneMissing: '—',
    brandTextFallback: 'La Saó Vallès',
    footerVisit: 'Lloc web',
    footerTagline: 'Fruita i verdura al Vallès — de l’hort a la taula',
    autoNote:
      "Aquest missatge s'ha generat de manera automàtica. Per dubtes, escriu a l'adreça de contacte que figure a la web, no a aquesta adreça de l'enviament.",
    contactLabel: 'Correu de contacte (titular)',
    ownerLabelName: 'Nom',
    ownerLabelEmail: 'Correu',
    ownerLabelPhone: 'Telèfon',
    ownerTextIntro: (id) =>
      `La Saó — comanda pendent (titular) — referència #${id} —\n${'—'.repeat(50)}`,
    customerTextHeader: (id) =>
      `Hola —\nComanda rebut, referència #${id}.\n${'—'.repeat(50)}`
  },
  es: {
    ownerSubject: (id) => `[La Saó] Nuevo pedido #${id}`,
    customerSubject: (id) => `[La Saó] Hemos recibido tu pedido #${id}`,
    preheaderOwner: (id) => `Nuevo pedido #${id} recibido desde el formulario de La Saó Vallès.`,
    preheaderCustomer: (id) => `Hemos recibido el pedido #${id}. Aquí el resumen; consérvalo como comprobante.`,
    h1Owner: 'Nuevo pedido en el formulario en línea',
    subtitleOwner: (id) =>
      `Resumen con la referencia <strong style="color:${BRAND_HEADER_BG}">#${escHtml(String(id))}</strong> : contacto, dirección de entrega e ítems solicitados.`,
    h1Customer: 'Gracias por pedir con La Saó Vallès',
    subtitleCustomer: (id) =>
      `Hemos recibido tu pedido. La referencia es <strong style="color:${BRAND_HEADER_BG}">#${escHtml(String(id))}</strong> . A continuación el resumen; más abajo, qué pasa a partir de ahora.`,
    trustLine: 'Agradecemos la confianza: desde el Vallès, de la huerta a la mesa, producto de calidad y cercanía, con un equipo de familia detrás de cada semana de reparto.',
    customerIntro: 'Si recibes otra notificación, será con la confirmación o ajuste desde el titular, en un correo aparte.',
    customerSteps: `Próximos pasos
1) El titular revisa el pedido y te responde con el importe final, disponibilidad y día de reparto.
2) Dudas o cambios: correo de contacto, más abajo (más adecuado que responder a esta dirección automática).
3) Pago y entrega, según lo acordado (a menudo en efectivo o transferencia; te lo concretan por mail).`,

    sectionClient: 'Datos de contacto',
    sectionAddress: 'Dirección de entrega',
    sectionLines: 'Líneas del pedido',
    colProduct: 'Producto',
    colUnit: 'Unidad',
    colPrice: 'Precio',
    colQty: 'Cdad.',
    colSubtotal: 'Subtotal',
    total: 'Total',
    orderIdLabel: 'N.º de pedido',
    phoneMissing: '—',
    brandTextFallback: 'La Saó Vallès',
    footerVisit: 'Visitar el sitio web',
    footerTagline: 'Frutas y verdura en el Vallès — de la huerta a la mesa',
    autoNote:
      'Mensaje generado automáticamente. Si tienes dudas, escribe al contacto de la web, no a esta dirección de envío.',
    contactLabel: 'Correo de contacto (titular)',
    ownerLabelName: 'Nombre',
    ownerLabelEmail: 'Email',
    ownerLabelPhone: 'Teléfono',
    ownerTextIntro: (id) =>
      `La Saó — pedido para titular — ref. #${id} —\n${'—'.repeat(50)}`,
    customerTextHeader: (id) => `Hola —\nPedido recibido, ref. #${id}.\n${'—'.repeat(50)}`
  }
};

/**
 * @param {object} p
 * @param {'ca'|'es'} p.lang
 * @param {string} p.preheader
 * @param {string} p.title
 * @param {string} p.subtitle
 * @param {string} p.innerHtml
 * @param {boolean} p.hasLogo
 */
function wrapOrderEmail(p) {
  const { lang, preheader, title, subtitle, innerHtml, hasLogo } = p;
  const L = COPY[lang] || COPY.ca;
  const web = getWebUrl();
  const preheaderHidden = escHtml(preheader);
  const logoOrBrand = hasLogo
    ? `<img src="cid:${ORDER_EMAIL_LOGO_CID}" alt="${escHtml(L.brandTextFallback)}" width="200" style="max-width:200px;height:auto;display:block;margin:0 auto 8px auto;border:0" />`
    : `<h1 style="margin:0;font-family:Georgia,serif;font-size:1.4rem;font-weight:700;color:#f3f6f0;letter-spacing:0.02em;">${escHtml(
        L.brandTextFallback
      )}</h1>`;
  return `<!DOCTYPE html>
<html lang="${lang === 'es' ? 'es' : 'ca'}">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<meta http-equiv="x-ua-compatible" content="ie=edge"/>
<title>${escHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background-color:${BREAD_BG};-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">
<span style="display:none!important;visibility:hidden;mso-hide:all;font-size:0;max-height:0;line-height:0;overflow:hidden;opacity:0;">${preheaderHidden}</span>
<span style="display:none!important;max-height:0;overflow:hidden;mso-hide:all;">${'&nbsp;&zwnj;'.repeat(4)}</span>
<table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:${BREAD_BG};">
<tr><td align="center" style="padding:24px 12px 32px 12px;">
  <table width="600" border="0" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;font-family:system-ui,Segoe UI,Helvetica,Arial,sans-serif;">
    <tr>
      <td style="background-color:${BRAND_HEADER_BG};border-radius:8px 8px 0 0;padding:22px 20px 18px 20px;text-align:center;" align="center">
        ${logoOrBrand}
      </td>
    </tr>
    <tr>
      <td style="background-color:${PANEL_BG};border:1px solid ${BORDER};border-top:0;border-radius:0 0 8px 8px;overflow:hidden;">
        <div style="padding:22px 22px 8px 22px;border-bottom:1px solid #e0ebe0;">
          <h1 style="margin:0 0 8px 0;font-size:1.2rem;font-weight:700;color:${BRAND_HEADER_BG};line-height:1.3;">${escHtml(title)}</h1>
          <p style="margin:0;font-size:0.9rem;color:${BRAND_MUTED};line-height:1.5;">${subtitle}</p>
        </div>
        <div style="padding:20px 22px 8px 22px;font-size:0.95rem;color:#1f2a1f;line-height:1.5;">
        ${innerHtml}
        </div>
        <div style="padding:0 22px 22px 22px;font-size:0.8rem;color:${BRAND_MUTED};line-height:1.5;border-top:1px solid #edf4ed;">
          <p style="margin:12px 0 6px 0;"><a href="${escHtml(web)}" style="color:${BRAND_HEADER_BG};font-weight:600;">${escHtml(L.footerVisit)}</a> · ${escHtml(
            L.footerTagline
          )}</p>
          <p style="margin:0 0 4px 0;">${escHtml(L.autoNote)}</p>
          <p style="margin:0;padding-top:8px;border-top:1px solid #e0ebe0;font-size:0.7rem;color:#8a9a8a;letter-spacing:0.02em;">${escHtml(
            `API La Saó · v${API_VERSION}`
          )}</p>
        </div>
      </td>
    </tr>
  </table>
</td></tr>
</table>
</body>
</html>`;
}

function buildLinesTableHtml(rows, t, eurF, grandTotal) {
  const rowHtml = rows
    .map(
      (r) => `<tr>
<td style="border-bottom:1px solid #e0ebe0;padding:10px 8px;vertical-align:top;">${escHtml(r.name)}</td>
<td style="border-bottom:1px solid #e0ebe0;padding:10px 6px;vertical-align:top;color:#3a453a;">${escHtml(r.unit)}</td>
<td style="border-bottom:1px solid #e0ebe0;padding:10px 8px;vertical-align:top;text-align:right;white-space:nowrap;">${eurF(r.unitPrice)}</td>
<td style="border-bottom:1px solid #e0ebe0;padding:10px 8px;vertical-align:top;text-align:right;">${escHtml(
        String(r.quantity)
      )}</td>
<td style="border-bottom:1px solid #e0ebe0;padding:10px 8px;vertical-align:top;text-align:right;white-space:nowrap;font-weight:600;">${eurF(
        r.lineTotal
      )}</td>
</tr>`
    )
    .join('');

  return `<table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse:collapse;max-width:100%;">
<thead>
<tr>
<th scope="col" style="background-color:${BRAND_HEADER_BG};color:#f3f6f0;font-size:0.75rem;text-transform:uppercase;letter-spacing:0.04em;padding:10px 8px;text-align:left;">${escHtml(
    t.colProduct
  )}</th>
<th scope="col" style="background-color:${BRAND_HEADER_BG};color:#f3f6f0;font-size:0.75rem;text-transform:uppercase;letter-spacing:0.04em;padding:10px 6px;text-align:left;">${escHtml(
    t.colUnit
  )}</th>
<th scope="col" style="background-color:${BRAND_HEADER_BG};color:#f3f6f0;font-size:0.75rem;text-transform:uppercase;letter-spacing:0.04em;padding:10px 8px;text-align:right;">${escHtml(
    t.colPrice
  )}</th>
<th scope="col" style="background-color:${BRAND_HEADER_BG};color:#f3f6f0;font-size:0.75rem;text-transform:uppercase;letter-spacing:0.04em;padding:10px 8px;text-align:right;">${escHtml(
    t.colQty
  )}</th>
<th scope="col" style="background-color:${BRAND_HEADER_BG};color:#f3f6f0;font-size:0.75rem;text-transform:uppercase;letter-spacing:0.04em;padding:10px 8px;text-align:right;">${escHtml(
    t.colSubtotal
  )}</th>
</tr>
</thead>
<tbody>${rowHtml}</tbody>
<tfoot>
<tr>
<td colspan="4" style="padding:12px 8px 10px 8px;text-align:right;font-weight:700;">${escHtml(t.total)}</td>
<td style="padding:12px 8px 10px 8px;text-align:right;font-size:1.1rem;font-weight:700;color:${BRAND_HEADER_BG};">${eurF(
    grandTotal
  )}</td>
</tr>
</tfoot>
</table>`;
}

/**
 * @param {object} p
 * @param {string} p.orderId
 * @param {'ca'|'es'} p.lang
 * @param {boolean} p.hasLogo
 * @param {{ customerName: string; customerEmail: string; phone: string; shippingAddress: string }} p.customer
 * @param {Array<{ name: string; unit: string; unitPrice: number; quantity: number; lineTotal: number }>} p.rows
 * @param {number} p.grandTotal
 */
export function buildOwnerMail(p) {
  const { orderId, lang, hasLogo, customer, rows, grandTotal } = p;
  const t = COPY[lang] || COPY.ca;
  const eurF = (n) => eur(n, lang);

  const textRows = rows
    .map((r) => `${r.name} | ${r.unit} | ${eurF(r.unitPrice)} x ${r.quantity} = ${eurF(r.lineTotal)}`)
    .join('\n');

  const text = `${t.ownerTextIntro(orderId)}
${t.orderIdLabel}: #${orderId}
Idioma: ${lang}
${'—'.repeat(50)}

[ ${t.sectionClient} ]
  ${t.ownerLabelName}: ${customer.customerName}
  ${t.ownerLabelEmail}: ${customer.customerEmail}
  ${t.ownerLabelPhone}: ${customer.phone || t.phoneMissing}

[ ${t.sectionAddress} ]
${customer.shippingAddress}

${'—'.repeat(50)}
${t.sectionLines}:
${textRows}

${t.total}: ${eurF(grandTotal)}

—
${t.footerTagline} · ${getWebUrl()}

API La Saó · v${API_VERSION}
`;

  const h2 = (label) =>
    `<h2 style="font-size:0.9rem;margin:20px 0 10px 0;padding:0;color:${BRAND_HEADER_BG};text-transform:uppercase;letter-spacing:0.05em;">${escHtml(
      label
    )}</h2>`;

  const inner = `<p style="margin:0 0 8px 0;">
<span style="color:${BRAND_MUTED};font-size:0.8rem;">${escHtml(t.orderIdLabel)}</span><br/>
<span style="font-size:1.15rem;font-weight:700;color:${BRAND_HEADER_BG};">#${escHtml(orderId)}</span>
</p>
${h2(t.sectionClient)}
<p style="margin:0 0 10px 0;line-height:1.5;">
<strong>${escHtml(t.ownerLabelName)}</strong> ${escHtml(customer.customerName)}<br/>
<strong>${escHtml(t.ownerLabelEmail)}</strong> <a href="mailto:${escHtml(
    customer.customerEmail
  )}" style="color:${BRAND_HEADER_BG};">${escHtml(customer.customerEmail)}</a><br/>
<strong>${escHtml(t.ownerLabelPhone)}</strong> ${escHtml(customer.phone || t.phoneMissing)}
</p>
${h2(t.sectionAddress)}
<p style="margin:0;white-space:pre-wrap;">${escHtml(customer.shippingAddress)}</p>
${h2(t.sectionLines)}
<div style="margin-top:6px;">${buildLinesTableHtml(rows, t, eurF, grandTotal)}</div>
`;

  const html = wrapOrderEmail({
    lang,
    preheader: t.preheaderOwner(orderId),
    title: t.h1Owner,
    subtitle: t.subtitleOwner(orderId),
    innerHtml: inner,
    hasLogo
  });

  return { subject: t.ownerSubject(orderId), text, html };
}

/**
 * @param {object} p
 * @param {string} p.orderId
 * @param {'ca'|'es'} p.lang
 * @param {boolean} p.hasLogo
 * @param {string} p.ownerContactEmail
 * @param {{ customerName: string; customerEmail: string; phone: string; shippingAddress: string }} p.customer
 * @param {Array<{ name: string; unit: string; unitPrice: number; quantity: number; lineTotal: number }>} p.rows
 * @param {number} p.grandTotal
 */
export function buildCustomerMail(p) {
  const { orderId, lang, hasLogo, ownerContactEmail, rows, grandTotal } = p;
  const t = COPY[lang] || COPY.ca;
  const eurF = (n) => eur(n, lang);

  const textRows = rows
    .map((r) => `${r.name} | ${r.unit} | ${eurF(r.unitPrice)} x ${r.quantity} = ${eurF(r.lineTotal)}`)
    .join('\n');

  const text = `${t.customerTextHeader(orderId)}

${t.trustLine}

${t.customerIntro}

${'—'.repeat(30)}

${t.sectionLines}:
${textRows}

${t.total}: ${eurF(grandTotal)}

${t.contactLabel}:
${ownerContactEmail}

${'—'.repeat(30)}

${t.customerSteps}

—
${t.footerTagline} · ${getWebUrl()}

API La Saó · v${API_VERSION}
`;

  const inner = `<p style="margin:0 0 14px 0;font-size:0.95rem;">${escHtml(t.trustLine)}</p>
<p style="margin:0 0 18px 0;font-size:0.9rem;">${escHtml(t.customerIntro)}</p>
<h2 style="font-size:0.9rem;margin:0 0 8px 0;padding:0;color:${BRAND_HEADER_BG};text-transform:uppercase;letter-spacing:0.05em;">${escHtml(
    t.sectionLines
  )}</h2>
<div style="margin-bottom:18px;">${buildLinesTableHtml(rows, t, eurF, grandTotal)}</div>
<p style="margin:0 0 6px 0;">
<strong style="color:${BRAND_MUTED}">${escHtml(t.contactLabel)}</strong><br/>
<a href="mailto:${escHtml(ownerContactEmail)}" style="color:${BRAND_HEADER_BG};font-size:1rem;font-weight:600;">${escHtml(
    ownerContactEmail
  )}</a>
</p>
<div style="font-size:0.88rem;line-height:1.55;white-space:pre-line;color:#3a453a;padding:12px 0 0 0;border-top:1px solid #e0ebe0;">${escHtml(
    t.customerSteps
  )}</div>
`;

  const html = wrapOrderEmail({
    lang,
    preheader: t.preheaderCustomer(orderId),
    title: t.h1Customer,
    subtitle: t.subtitleCustomer(orderId),
    innerHtml: inner,
    hasLogo
  });

  return { subject: t.customerSubject(orderId), text, html };
}
