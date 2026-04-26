import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { TranslocoModule, TranslocoPipe } from '@ngneat/transloco';
import { SeoService } from '@app/core/services/seo.service';

const GALLERY: ReadonlyArray<readonly [string, number, number]> = [
  ['/images/galeria/photo-111.jpg', 800, 600],
  ['/images/galeria/photo-112.jpg', 800, 600],
  ['/images/galeria/photo-113.jpg', 800, 600],
  ['/images/galeria/photo-114.jpg', 800, 600],
  ['/images/galeria/photo-115.jpg', 800, 600],
  ['/images/galeria/photo-116.jpg', 800, 600],
  ['/images/galeria/photo-trac.jpg', 800, 600],
  ['/images/galeria/qui-som.jpg', 800, 600],
  ['/images/galeria/img-0030.jpg', 800, 600],
  ['/images/hero-cistelles.jpg', 800, 600]
] as const;

@Component({
  selector: 'app-galeria',
  standalone: true,
  imports: [TranslocoModule, TranslocoPipe, NgOptimizedImage],
  templateUrl: './galeria.html',
  styleUrl: './galeria.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GaleriaComponent {
  protected readonly images = GALLERY.map(([src, w, h]) => ({ src, w, h }));

  constructor() {
    const seo = inject(SeoService);
    const dr = inject(DestroyRef);
    seo.bindPageToTranslations(dr, 'meta.galeria.title', 'meta.galeria.description');
  }
}
