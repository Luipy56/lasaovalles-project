import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Camí al logotip blanc pels correus; mateix vèrtex que a `api/assets/email/README.md`. */
export const ORDER_EMAIL_LOGO_PATH = path.join(__dirname, '../assets/email/logo-white.png');

export const ORDER_EMAIL_LOGO_CID = 'lasaologo';

/**
 * @returns {import('nodemailer').Attachment | null}
 */
export function getOrderEmailLogoAttachment() {
  if (!fs.existsSync(ORDER_EMAIL_LOGO_PATH)) {
    return null;
  }
  return {
    filename: 'logo-white.png',
    path: ORDER_EMAIL_LOGO_PATH,
    cid: ORDER_EMAIL_LOGO_CID
  };
}
