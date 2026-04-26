/**
 * Production: Nginx should proxy `/api` to the Node process on the same host.
 */
export const environment = {
  production: true,
  apiBasePath: '/api'
};
