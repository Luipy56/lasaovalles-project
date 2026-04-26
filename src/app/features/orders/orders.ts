import { DecimalPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { TranslocoPipe, TranslocoService } from '@ngneat/transloco';
import { firstValueFrom } from 'rxjs';

import type { OrderCatalog, OrderCatalogCategory, OrderCatalogItem } from '@app/core/models/order-catalog.model';
import { OrdersApiService } from '@app/core/services/orders-api.service';
import { SeoService } from '@app/core/services/seo.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [FormsModule, TranslocoPipe, DecimalPipe],
  templateUrl: './orders.html',
  styleUrl: './orders.scss'
})
export class OrdersComponent {
  private readonly api = inject(OrdersApiService);
  private readonly transloco = inject(TranslocoService);
  private readonly destroyRef = inject(DestroyRef);

  readonly catalog = signal<OrderCatalog | null>(null);
  readonly loadError = signal(false);
  readonly submitting = signal(false);
  readonly submitError = signal<string | null>(null);
  readonly submitSuccess = signal(false);

  readonly customerName = signal('');
  readonly customerEmail = signal('');
  readonly phone = signal('');
  readonly shippingAddress = signal('');
  readonly acceptPolicy = signal(false);

  /** quantity per item id */
  readonly qtyById = signal<Record<string, number>>({});

  readonly catNavIndex = signal(0);

  constructor() {
    const seo = inject(SeoService);
    seo.bindPageToTranslations(this.destroyRef, 'meta.orders.title', 'meta.orders.description');

    this.api
      .getCatalog()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (c) => {
          this.catalog.set(c);
          const init: Record<string, number> = {};
          for (const cat of c.categories) {
            for (const it of cat.items) {
              init[it.id] = 0;
            }
          }
          this.qtyById.set(init);
        },
        error: () => this.loadError.set(true)
      });
  }

  catTitle(cat: OrderCatalogCategory): string {
    return this.transloco.getActiveLang() === 'es' ? cat.titleEs : cat.titleCa;
  }

  itemName(it: OrderCatalogItem): string {
    return this.transloco.getActiveLang() === 'es' ? it.nameEs : it.nameCa;
  }

  itemOrigin(it: OrderCatalogItem): string {
    return this.transloco.getActiveLang() === 'es' ? it.originEs : it.originCa;
  }

  itemUnit(it: OrderCatalogItem): string {
    return this.transloco.getActiveLang() === 'es' ? it.unitEs : it.unitCa;
  }

  qty(id: string): number {
    return this.qtyById()[id] ?? 0;
  }

  setQty(id: string, raw: string | number): void {
    const n = typeof raw === 'number' ? raw : parseFloat(String(raw).replace(',', '.'));
    const v = Number.isFinite(n) && n >= 0 ? Math.round(n * 10) / 10 : 0;
    this.qtyById.update((m) => ({ ...m, [id]: v }));
  }

  lineSubtotal(it: OrderCatalogItem): number {
    return Math.round(it.price * this.qty(it.id) * 100) / 100;
  }

  readonly grandTotal = computed(() => {
    const c = this.catalog();
    if (!c) return 0;
    let t = 0;
    for (const cat of c.categories) {
      for (const it of cat.items) {
        t += it.price * this.qty(it.id);
      }
    }
    return Math.round(t * 100) / 100;
  });

  scrollFirst(): void {
    this.scrollToIndex(0);
  }

  scrollPrev(): void {
    const c = this.catalog();
    if (!c?.categories.length) return;
    const i = Math.max(0, this.catNavIndex() - 1);
    this.scrollToIndex(i);
  }

  scrollNext(): void {
    const c = this.catalog();
    if (!c?.categories.length) return;
    const i = Math.min(c.categories.length - 1, this.catNavIndex() + 1);
    this.scrollToIndex(i);
  }

  scrollToDades(): void {
    const el = document.getElementById('orders-dades');
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    queueMicrotask(() => el?.focus({ preventScroll: true }));
  }

  private scrollToIndex(i: number): void {
    const c = this.catalog();
    if (!c) return;
    this.catNavIndex.set(i);
    const id = c.categories[i]?.id;
    if (!id) return;
    document.getElementById(`cat-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  async submit(): Promise<void> {
    this.submitError.set(null);
    this.submitSuccess.set(false);
    const c = this.catalog();
    if (!c) return;
    if (!this.acceptPolicy()) {
      this.submitError.set('accept');
      return;
    }
    const lines = [];
    for (const cat of c.categories) {
      for (const it of cat.items) {
        const q = this.qty(it.id);
        if (q > 0) lines.push({ itemId: it.id, quantity: q });
      }
    }
    if (lines.length === 0) {
      this.submitError.set('lines');
      return;
    }
    const lang = this.transloco.getActiveLang() === 'es' ? 'es' : 'ca';
    this.submitting.set(true);
    try {
      await firstValueFrom(
        this.api.submitOrder({
          customerEmail: this.customerEmail().trim(),
          customerName: this.customerName().trim(),
          phone: this.phone().trim(),
          shippingAddress: this.shippingAddress().trim(),
          lang,
          acceptPolicy: true,
          lines
        })
      );
      this.submitSuccess.set(true);
    } catch (e) {
      const err = e as HttpErrorResponse;
      if (err?.status === 503) {
        this.submitError.set('mail');
      } else {
        this.submitError.set('generic');
      }
    } finally {
      this.submitting.set(false);
    }
  }
}
