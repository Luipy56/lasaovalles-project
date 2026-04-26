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

/** @returns {string[]} Env var names that are missing or blank (for diagnostics). */
export function getMailConfigGaps() {
  const gaps = [];
  if (!process.env.SMTP_HOST?.trim()) gaps.push('SMTP_HOST');
  if (!process.env.SMTP_USER?.trim()) gaps.push('SMTP_USER');
  if (!process.env.SMTP_PASS?.trim()) gaps.push('SMTP_PASS');
  if (!process.env.MAIL_FROM?.trim()) gaps.push('MAIL_FROM');
  if (!process.env.OWNER_EMAIL?.trim()) gaps.push('OWNER_EMAIL');
  return gaps;
}

export function isMailConfigured() {
  return getMailConfigGaps().length === 0;
}

/**
 * @param {{ to: string; subject: string; text: string; html: string; replyTo?: string; attachments?: import('nodemailer').SendMailOptions['attachments'] }} opts
 */
export async function sendMail(opts) {
  const transport = getTransport();
  const from = process.env.MAIL_FROM;
  const owner = process.env.OWNER_EMAIL;
  if (!transport || !from || !owner) {
    throw new Error('Mail is not configured');
  }
  const payload = {
    from,
    to: opts.to,
    subject: opts.subject,
    text: opts.text,
    html: opts.html,
    replyTo: opts.replyTo
  };
  if (opts.attachments?.length) {
    payload.attachments = opts.attachments;
  }
  await transport.sendMail(payload);
}
