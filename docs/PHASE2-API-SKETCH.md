# Phase 2 — API sketch (superseded)

Implemented code and docs live under **`api/`** (see **`api/README.md`**) and Angular **`features/orders`**, **`features/admin-catalog`**, with **`environment.apiBasePath`** (`/api`) and **`proxy.conf.json`**.

Historical bullets:

- **POST** `/api/orders` — line items, customer contact, delivery address; rate limit + CORS.
- **Notify:** e-mail to owner + copy to client (Nodemailer).
- **Storage:** `api/data/order-catalog.json` (atomic writes on admin save).
