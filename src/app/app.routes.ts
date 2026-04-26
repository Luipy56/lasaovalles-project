import { Routes } from '@angular/router';
import { MainLayoutComponent } from '@app/core/layout/main-layout/main-layout';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', pathMatch: 'full', loadComponent: () => import('./features/home/home').then((m) => m.HomeComponent) },
      {
        path: 'newpage',
        loadComponent: () => import('./features/newpage/newpage').then((m) => m.NewpageComponent)
      },
      {
        path: 'galeria',
        loadComponent: () => import('./features/galeria/galeria').then((m) => m.GaleriaComponent)
      },
      {
        path: 'informacio',
        loadComponent: () => import('./features/informacio/informacio').then((m) => m.InformacioComponent)
      },
      {
        path: 'orders',
        loadComponent: () => import('./features/orders/orders').then((m) => m.OrdersComponent)
      },
      {
        path: 'admin/catalogo',
        loadComponent: () => import('./features/admin-catalog/admin-catalog').then((m) => m.AdminCatalogComponent)
      },
      {
        path: 'punt-de-venda',
        loadComponent: () => import('./features/punt-venda/punt-venda').then((m) => m.PuntVendaComponent)
      },
      {
        path: 'contacto',
        loadComponent: () => import('./features/contacte/contacte').then((m) => m.ContacteComponent)
      },
      {
        path: 'aviso-legal',
        loadComponent: () => import('./features/avis-legal/avis-legal').then((m) => m.AvisLegalComponent)
      },
      {
        path: 'servei-empreses',
        loadComponent: () => import('./features/servei-empreses/servei-empreses').then((m) => m.ServeiEmpresesComponent)
      },
      { path: '**', loadComponent: () => import('./features/not-found/not-found').then((m) => m.NotFoundComponent) }
    ]
  }
];
