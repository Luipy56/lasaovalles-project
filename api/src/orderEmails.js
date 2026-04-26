function escHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function eur(n) {
  return new Intl.NumberFormat('ca-ES', { style: 'currency', currency: 'EUR' }).format(n);
}

const COPY = {
  ca: {
    ownerSubject: (id) => `[La Saó] Nou pedid ${id}`,
    customerSubject: (id) => `[La Saó] Hem rebut el teu pedid ${id}`,
    customerIntro:
      'Hem rebut el teu pedid. A continuació tens un resum. Conserva aquest correu com a comprovant.',
    customerSteps: `Passos següents:
1) El titular revisarà el pedid i et respondrà amb un correu de confirmació (import final, disponibilitat i dia de repartament).
2) Per canvis o dubtes pots escriure directament a l’adreça de contacte indicada més avall (no respondre a aquest missatge automàtic si no reps resposta).
3) El pagament i el lliurament es concretaran segons el que s’hagi acordat (sovint en efectiu o transferència al repartidor; ho confirmaran per correu).`,
    contactLabel: 'Correu de contacte (titular)'
  },
  es: {
    ownerSubject: (id) => `[La Saó] Nuevo pedido ${id}`,
    customerSubject: (id) => `[La Saó] Hemos recibido tu pedido ${id}`,
    customerIntro:
      'Hemos recibido tu pedido. A continuación tienes un resumen. Conserva este correo como comprobante.',
    customerSteps: `Próximos pasos:
1) El titular revisará el pedido y te enviará un correo de confirmación (importe final, disponibilidad y día de reparto).
2) Para cambios o dudas puedes escribir directamente al correo de contacto indicado abajo.
3) El pago y la entrega se concretarán según lo acordado (a menudo en efectivo o transferencia al repartidor; lo confirmarán por correo).`,
    contactLabel: 'Correo de contacto (titular)'
  }
};

/**
 * @param {object} p
 * @param {string} p.orderId
 * @param {'ca'|'es'} p.lang
 * @param {{ customerName: string; customerEmail: string; phone: string; shippingAddress: string }} p.customer
 * @param {Array<{ name: string; unit: string; unitPrice: number; quantity: number; lineTotal: number }>} p.rows
 * @param {number} p.grandTotal
 */
export function buildOwnerMail({ orderId, lang, customer, rows, grandTotal }) {
  const t = COPY[lang] || COPY.ca;
  const textRows = rows
    .map(
      (r) =>
        `${r.name} | ${r.unit} | ${eur(r.unitPrice)} x ${r.quantity} = ${eur(r.lineTotal)}`
    )
    .join('\n');
  const text = `Nou pedid / Pedido: ${orderId}
Idioma / idioma: ${lang}

Client / Cliente:
- Nom / Nombre: ${customer.customerName}
- Email: ${customer.customerEmail}
- Telèfon / Teléfono: ${customer.phone || '—'}
- Adreça d’enviament / Dirección de envío:
${customer.shippingAddress}

Línies / Líneas:
${textRows}

TOTAL: ${eur(grandTotal)}
`;

  const htmlRows = rows
    .map(
      (r) =>
        `<tr><td>${escHtml(r.name)}</td><td>${escHtml(r.unit)}</td><td style="text-align:right">${eur(r.unitPrice)}</td><td style="text-align:right">${r.quantity}</td><td style="text-align:right">${eur(r.lineTotal)}</td></tr>`
    )
    .join('');

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/></head><body style="font-family:system-ui,sans-serif">
  <h2>${escHtml(t.ownerSubject(orderId))}</h2>
  <p><strong>ID:</strong> ${escHtml(orderId)}</p>
  <h3>Client</h3>
  <ul>
    <li><strong>Nom:</strong> ${escHtml(customer.customerName)}</li>
    <li><strong>Email:</strong> ${escHtml(customer.customerEmail)}</li>
    <li><strong>Telèfon:</strong> ${escHtml(customer.phone || '—')}</li>
  </ul>
  <h3>Adreça d’enviament</h3>
  <pre style="white-space:pre-wrap;font-family:inherit">${escHtml(customer.shippingAddress)}</pre>
  <h3>Línies</h3>
  <table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse;width:100%;max-width:720px">
    <thead><tr><th>Producte</th><th>Unitat</th><th>Preu</th><th>Quantitat</th><th>Subtotal</th></tr></thead>
    <tbody>${htmlRows}</tbody>
    <tfoot><tr><th colspan="4" style="text-align:right">TOTAL</th><th style="text-align:right">${eur(grandTotal)}</th></tr></tfoot>
  </table>
  </body></html>`;

  return { subject: t.ownerSubject(orderId), text, html };
}

/**
 * @param {object} p
 * @param {string} p.orderId
 * @param {'ca'|'es'} p.lang
 * @param {string} p.ownerContactEmail
 * @param {{ customerName: string; customerEmail: string; phone: string; shippingAddress: string }} p.customer
 * @param {Array<{ name: string; unit: string; unitPrice: number; quantity: number; lineTotal: number }>} p.rows
 * @param {number} p.grandTotal
 */
export function buildCustomerMail({ orderId, lang, ownerContactEmail, customer, rows, grandTotal }) {
  const t = COPY[lang] || COPY.ca;
  const textRows = rows
    .map(
      (r) =>
        `${r.name} | ${r.unit} | ${eur(r.unitPrice)} x ${r.quantity} = ${eur(r.lineTotal)}`
    )
    .join('\n');
  const text = `${t.customerSubject(orderId)}

${t.customerIntro}

${textRows}

TOTAL: ${eur(grandTotal)}

${t.contactLabel}: ${ownerContactEmail}

${t.customerSteps}
`;

  const htmlRows = rows
    .map(
      (r) =>
        `<tr><td>${escHtml(r.name)}</td><td>${escHtml(r.unit)}</td><td style="text-align:right">${eur(r.unitPrice)}</td><td style="text-align:right">${r.quantity}</td><td style="text-align:right">${eur(r.lineTotal)}</td></tr>`
    )
    .join('');

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/></head><body style="font-family:system-ui,sans-serif">
  <h2>${escHtml(t.customerSubject(orderId))}</h2>
  <p>${escHtml(t.customerIntro)}</p>
  <table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse;width:100%;max-width:720px">
    <thead><tr><th>Producte</th><th>Unitat</th><th>Preu</th><th>Quantitat</th><th>Subtotal</th></tr></thead>
    <tbody>${htmlRows}</tbody>
    <tfoot><tr><th colspan="4" style="text-align:right">TOTAL</th><th style="text-align:right">${eur(grandTotal)}</th></tr></tfoot>
  </table>
  <p><strong>${escHtml(t.contactLabel)}:</strong> <a href="mailto:${escHtml(ownerContactEmail)}">${escHtml(ownerContactEmail)}</a></p>
  <pre style="white-space:pre-wrap;font-family:inherit">${escHtml(t.customerSteps)}</pre>
  </body></html>`;

  return { subject: t.customerSubject(orderId), text, html };
}
