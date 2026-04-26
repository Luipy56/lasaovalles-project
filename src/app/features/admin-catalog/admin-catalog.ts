import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { TranslocoPipe } from '@ngneat/transloco';
import { firstValueFrom } from 'rxjs';

import type { OrderCatalog } from '@app/core/models/order-catalog.model';
import { OrdersApiService } from '@app/core/services/orders-api.service';

const TOKEN_KEY = 'adminCatalogToken';

@Component({
  selector: 'app-admin-catalog',
  standalone: true,
  imports: [FormsModule, TranslocoPipe],
  templateUrl: './admin-catalog.html',
  styleUrl: './admin-catalog.scss'
})
export class AdminCatalogComponent {
  private readonly api = inject(OrdersApiService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);

  readonly tokenInput = signal('');
  readonly token = signal(typeof sessionStorage !== 'undefined' ? sessionStorage.getItem(TOKEN_KEY) || '' : '');
  readonly catalog = signal<OrderCatalog | null>(null);
  readonly loadError = signal(false);
  readonly saving = signal(false);
  readonly saveOk = signal(false);
  readonly saveErr = signal(false);
  /** view = read-only dense table; edit = inputs */
  readonly mode = signal<'view' | 'edit'>('view');

  constructor() {
    this.title.setTitle('Admin catàleg');
    this.meta.updateTag({ name: 'robots', content: 'noindex, nofollow' });
    const t = this.token();
    if (t) {
      this.fetchCatalog(t);
    }
  }

  connect(): void {
    const v = this.tokenInput().trim();
    if (!v) return;
    sessionStorage.setItem(TOKEN_KEY, v);
    this.token.set(v);
    this.fetchCatalog(v);
  }

  disconnect(): void {
    sessionStorage.removeItem(TOKEN_KEY);
    this.token.set('');
    this.catalog.set(null);
    this.loadError.set(false);
  }

  setMode(m: 'view' | 'edit'): void {
    this.mode.set(m);
  }

  private fetchCatalog(t: string): void {
    this.loadError.set(false);
    this.api
      .getCatalogAdmin(t)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (c) => this.catalog.set(c),
        error: () => {
          this.loadError.set(true);
          this.catalog.set(null);
        }
      });
  }

  updateItemPrice(catIndex: number, itemIndex: number, raw: string): void {
    const c = this.catalog();
    if (!c) return;
    const n = parseFloat(String(raw).replace(',', '.'));
    const price = Number.isFinite(n) && n >= 0 ? n : 0;
    const next = structuredClone(c);
    next.categories[catIndex].items[itemIndex].price = price;
    this.catalog.set(next);
  }

  updateItemName(catIndex: number, itemIndex: number, field: 'nameCa' | 'nameEs', value: string): void {
    const c = this.catalog();
    if (!c) return;
    const next = structuredClone(c);
    next.categories[catIndex].items[itemIndex][field] = value;
    this.catalog.set(next);
  }

  async save(): Promise<void> {
    const t = this.token();
    const c = this.catalog();
    if (!t || !c) return;
    this.saving.set(true);
    this.saveOk.set(false);
    this.saveErr.set(false);
    try {
      const saved = await firstValueFrom(this.api.putCatalogAdmin(t, c));
      this.catalog.set(saved);
      this.saveOk.set(true);
    } catch (e) {
      const err = e as HttpErrorResponse;
      if (err?.status === 401) {
        this.disconnect();
      }
      this.saveErr.set(true);
    } finally {
      this.saving.set(false);
    }
  }

  downloadJson(): void {
    const c = this.catalog();
    if (!c) return;
    const blob = new Blob([JSON.stringify(c, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'order-catalog.json';
    a.click();
    URL.revokeObjectURL(a.href);
  }
}
