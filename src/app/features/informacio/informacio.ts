import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { TranslocoModule, TranslocoPipe, TranslocoService } from '@ngneat/transloco';
import { SeoService } from '@app/core/services/seo.service';
import type { DeliveryDay } from './informacio-delivery.model';

@Component({
  selector: 'app-informacio',
  standalone: true,
  imports: [TranslocoModule, TranslocoPipe, RouterLink],
  templateUrl: './informacio.html',
  styleUrl: './informacio.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InformacioComponent {
  private readonly transloco = inject(TranslocoService);
  protected readonly delivery = toSignal(
    this.transloco.selectTranslateObject<DeliveryDay[]>('informacio.delivery'),
    { initialValue: [] as DeliveryDay[] }
  );

  constructor() {
    const dr = inject(DestroyRef);
    const seo = inject(SeoService);
    seo.bindPageToTranslations(dr, 'meta.informacio.title', 'meta.informacio.description');
  }
}
