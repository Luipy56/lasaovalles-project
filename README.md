# La Saó Vallès — website

Informatory Angular app: **Catalan (default)** and **Spanish**, same shell on every route (header, nav, footer), lazy-loaded features, and **Transloco** for runtime i18n (`public/i18n/ca.json`, `public/i18n/es.json`).

**Phase 2 — online order + API:** the Angular app calls `**/api/*`** (see `src/environments/environment*.ts` and `proxy.conf.json`). The Node service lives in `**api/**` next to this app (catalog JSON, admin token, Nodemailer). Run it on port **3000** while using `ng serve` so the dev proxy forwards `**/api/*`**. Optional reference dump outside this tree: `../phase-zero/` (not part of this repo for Git purposes unless you add it).

## Toolchain (reproducibility)

Pinned Angular packages are aligned to **21.2.x**. After `npm install`, confirm with:

```bash
npx ng version
```

Example output (abridged):

- **Angular CLI:** 21.2.8
- **Angular (core, etc.):** 21.2.10
- **Node.js:** ^20.19 or ^22.12 per [Angular version compatibility](https://angular.dev/reference/versions) (e.g. 22.22.x)
- **TypeScript:** ~5.9.2
- **Unit tests:** Vitest (`ng test`)

Repository code, comments, and this README’s **developer** sections are in **English**. User-visible strings live in the i18n JSON files (Catalan and Spanish). Product images are stored under `public/images/` (sourced from the public site CDN for this project).

## Development

**Repository root = this folder (`saovalles/`).** Clone GitHub into a directory that becomes this project root.

```bash
npm install
npm start
```

- `postinstall` runs `npm install` inside `api/` so the API has its own dependencies.
- **`npm start`** (alias: `npm run dev`) runs the **API** on port **3000** (`node --watch` for API hot-reload) and **Angular** on **4200**; `proxy.conf.json` forwards `/api/*` to the API. `concurrently` uses **`-k`** so when one process exits, the other is stopped.
- **Frontend only:** `npm run start:web` or `npm run dev:web`. **API only:** `npm run dev:api` (watch) or `npm run start:api` (no watch).

Open `http://localhost:4200/`. Default language is **Catalan**; preference is stored in `localStorage` (`saovalles.lang`).

Configure `**api/.env`** from `**api/.env.example**` so `POST /api/orders` can send mail (otherwise the UI shows the “mail not configured” message).

## Git / GitHub

This directory is the **Git repository root** (`git init` is already done; default branch `**main`**).

Add your remote and push when ready:

```bash
git remote add origin <your-github-repo-url>
git add -A
git status
git commit -m "Initial import: La Saó Vallès site + order API"
git push -u origin main
```

## Production build

```bash
npx ng build
```

Artifacts: `dist/saovalles/browser/`. Serve that folder with any static host (configure SPA fallback to `index.html` for direct URL loads). In production, **Nginx** (or similar) should proxy `**/api/`** to the Node process documented in `**api/README.md**`.

## Tests

```bash
npx ng test
```

## Mobile / narrow viewport checks (acceptance)

Verify at **320px** and **375px** width (portrait), and once in landscape on pages with map or wide tables:

- Main nav opens and closes; focus moves sensibly; tap targets feel comfortable.
- Language toggle updates UI and `document.documentElement.lang` without breaking the current route.
- No unintended horizontal scroll on core pages; wide tables use horizontal scroll where implemented.
- `tel:` and `mailto:` actions work from Contact.
- No blocking console errors on navigation and back/forward.

## Project layout (short)

- `src/app/core/` — layout shell, navigation model, language persistence, SEO, Transloco loader.
- `api/` — Express order API (catalog JSON, mail, admin).
- `src/app/features/` — lazy routes: home, newpage, galeria, informacio, **orders**, **admin-catalog**, punt-venda, contacte, servei-empreses, avis-legal, not-found.
- `src/styles/` — tokens, typography, global SCSS.
- `src/environments/` — `apiBasePath` (`/api`); dev server uses `proxy.conf.json` to reach the Node API.
- `public/` — static assets including `i18n/` and `images/`.

## API reference

See **[api/README.md](api/README.md)** for environment variables, Nginx, and e-mail setup.

---

For Angular CLI help: [https://angular.dev/tools/cli](https://angular.dev/tools/cli).