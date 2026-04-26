import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoModule, TranslocoPipe } from '@ngneat/transloco';
import { PARTNER_LOGOS } from '@app/core/data/partner-logos';
import { SeoService } from '@app/core/services/seo.service';

@Component({
  selector: 'app-servei-empreses',
  standalone: true,
  imports: [TranslocoModule, TranslocoPipe, NgOptimizedImage, RouterLink],
  templateUrl: './servei-empreses.html',
  styleUrl: './servei-empreses.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServeiEmpresesComponent {
  protected readonly partners = PARTNER_LOGOS.map(([src, w, h]) => ({ src, w, h }));

  constructor() {
    const seo = inject(SeoService);
    const dr = inject(DestroyRef);
    seo.bindPageToTranslations(dr, 'meta.servei.title', 'meta.servei.description');
  }
}
