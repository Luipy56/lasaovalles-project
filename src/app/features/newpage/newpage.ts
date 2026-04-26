import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { TranslocoModule, TranslocoPipe } from '@ngneat/transloco';
import { PARTNER_LOGOS } from '@app/core/data/partner-logos';
import { SeoService } from '@app/core/services/seo.service';

@Component({
  selector: 'app-newpage',
  standalone: true,
  imports: [TranslocoModule, TranslocoPipe, NgOptimizedImage],
  templateUrl: './newpage.html',
  styleUrl: './newpage.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewpageComponent {
  protected readonly partners = PARTNER_LOGOS.map(([src, w, h]) => ({ src, w, h }));

  constructor() {
    const seo = inject(SeoService);
    const dr = inject(DestroyRef);
    seo.bindPageToTranslations(dr, 'meta.newpage.title', 'meta.newpage.description');
  }
}
