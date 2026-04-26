/**
 * Dev: `ng serve` uses proxy.conf.json so `/api/*` → localhost:3000.
 */
export const environment = {
  production: false,
  /** Base path for order API (no trailing slash). */
  apiBasePath: '/api'
};
