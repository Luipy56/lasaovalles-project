import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { TranslocoModule, TranslocoPipe } from '@ngneat/transloco';
import { SeoService } from '@app/core/services/seo.service';

@Component({
  selector: 'app-avis-legal',
  standalone: true,
  imports: [TranslocoModule, TranslocoPipe],
  templateUrl: './avis-legal.html',
  styleUrl: './avis-legal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AvisLegalComponent {
  constructor() {
    const seo = inject(SeoService);
    const dr = inject(DestroyRef);
    seo.bindPageToTranslations(dr, 'meta.aviso.title', 'meta.aviso.description');
  }
}
