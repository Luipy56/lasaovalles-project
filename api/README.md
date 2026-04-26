# La Saó Vallès — order API (Phase 2)

Express service colocated with the Angular app under **`saovalles/api/`**.

- `GET /api/catalog` — public product catalog (JSON file on disk).
- `POST /api/orders` — validated order payload; sends **two e-mails** (owner + customer) via **Nodemailer**.
- `GET|PUT /api/admin/catalog` — read/update catalog; requires `Authorization: Bearer <ADMIN_API_TOKEN>`.

Catalog file: **`api/data/order-catalog.json`**. Regenerate from Excel:

```bash
cd saovalles   # project root for git
npm run import-catalog --prefix api
```

By default the import script looks for the spreadsheet at **`../../phase-zero/LaSao_Comanda2504-32cffa9f.xlsx`** (folder **next to** `saovalles/`, optional reference material). Override with explicit paths:  
`node api/scripts/import-catalog-from-xlsx.mjs /path/to.xlsx /path/to/order-catalog.json`

## Local development

1. Copy `api/.env.example` to **`api/.env`** and fill SMTP + `OWNER_EMAIL` + `ADMIN_API_TOKEN`.
2. From **`saovalles/`** (this repo root for development):

```bash
npm install
npm run dev
```

That runs **`npm start` in `api/`** and **`ng serve`** together (`concurrently` in the parent `package.json`).

3. Or run separately: `npm run start --prefix api` and `ng serve` (proxy: `proxy.conf.json` → port 3000).

Angular calls `/api/...` on port 4200; the dev server proxies to `http://127.0.0.1:3000`.

## E-mail (Gmail)

1. Enable **2-Step Verification** on the Google account.
2. Create an **App password** (Security → App passwords) and put it in `SMTP_PASS`.
3. `MAIL_FROM` must be an address your SMTP user is allowed to send as (often the same Gmail).

For production, consider a transactional provider (Resend, Brevo, SendGrid) instead of Gmail SMTP.

## Same VPS + Nginx

Example (adjust paths and upstream port):

```nginx
location /api/ {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

Serve Angular static files from `/` with `try_files $uri $uri/ /index.html;`.

## Process manager

From **`saovalles/`**:

```bash
pm2 start api/src/server.js --name lasaovalles-api
pm2 save
```

## Security notes

- Never commit **`api/.env`**.
- Keep `ADMIN_API_TOKEN` long and secret; the admin UI stores it only in `sessionStorage`.
- `POST /api/orders` is rate-limited per IP (see `src/server.js`).
