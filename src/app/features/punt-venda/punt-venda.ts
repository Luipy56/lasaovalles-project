import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { TranslocoModule, TranslocoPipe } from '@ngneat/transloco';
import { SeoService } from '@app/core/services/seo.service';

@Component({
  selector: 'app-punt-venda',
  standalone: true,
  imports: [TranslocoModule, TranslocoPipe],
  templateUrl: './punt-venda.html',
  styleUrl: './punt-venda.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PuntVendaComponent {
  constructor() {
    const seo = inject(SeoService);
    const dr = inject(DestroyRef);
    seo.bindPageToTranslations(dr, 'meta.puntVenda.title', 'meta.puntVenda.description');
  }
}
