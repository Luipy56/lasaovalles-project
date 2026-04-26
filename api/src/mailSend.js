import nodemailer from 'nodemailer';

function getTransport() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return null;
  const port = Number(process.env.SMTP_PORT || 587);
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;
  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass }
  });
}

export function isMailConfigured() {
  return Boolean(getTransport() && process.env.MAIL_FROM && process.env.OWNER_EMAIL);
}

/**
 * @param {{ to: string; subject: string; text: string; html: string; replyTo?: string }} opts
 */
export async function sendMail(opts) {
  const transport = getTransport();
  const from = process.env.MAIL_FROM;
  const owner = process.env.OWNER_EMAIL;
  if (!transport || !from || !owner) {
    throw new Error('Mail is not configured');
  }
  await transport.sendMail({
    from,
    to: opts.to,
    subject: opts.subject,
    text: opts.text,
    html: opts.html,
    replyTo: opts.replyTo
  });
}
