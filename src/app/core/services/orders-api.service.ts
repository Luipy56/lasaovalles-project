import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import type { OrderCatalog, OrderSubmitPayload } from '@app/core/models/order-catalog.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class OrdersApiService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiBasePath;

  getCatalog(): Observable<OrderCatalog> {
    return this.http.get<OrderCatalog>(`${this.base}/catalog`);
  }

  submitOrder(body: OrderSubmitPayload): Observable<{ ok: boolean; orderId: string }> {
    return this.http.post<{ ok: boolean; orderId: string }>(`${this.base}/orders`, body);
  }

  getCatalogAdmin(token: string): Observable<OrderCatalog> {
    return this.http.get<OrderCatalog>(`${this.base}/admin/catalog`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  putCatalogAdmin(token: string, catalog: OrderCatalog): Observable<OrderCatalog> {
    return this.http.put<OrderCatalog>(`${this.base}/admin/catalog`, catalog, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
}
