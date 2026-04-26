/**
 * i18n keys for main nav (labels translated via Transloco).
 */
export interface MainNavItem {
  readonly path: string;
  readonly labelKey: string;
}

export const MAIN_NAV: readonly MainNavItem[] = [
  { path: '/', labelKey: 'nav.inici' },
  { path: '/informacio', labelKey: 'nav.informacio' },
  { path: '/orders', labelKey: 'nav.ordersOnline' },
  { path: '/punt-de-venda', labelKey: 'nav.puntVenda' },
  { path: '/contacto', labelKey: 'nav.contacte' },
  { path: '/servei-empreses', labelKey: 'nav.serveiEmpreses' },
  { path: '/newpage', labelKey: 'nav.quiSom' },
  { path: '/galeria', labelKey: 'nav.galeria' },
  { path: '/aviso-legal', labelKey: 'nav.avisLegal' }
] as const;
