import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { TranslocoModule, TranslocoPipe } from '@ngneat/transloco';
import { SeoService } from '@app/core/services/seo.service';

@Component({
  selector: 'app-contacte',
  standalone: true,
  imports: [TranslocoModule, TranslocoPipe],
  templateUrl: './contacte.html',
  styleUrl: './contacte.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContacteComponent {
  constructor() {
    const seo = inject(SeoService);
    const dr = inject(DestroyRef);
    seo.bindPageToTranslations(dr, 'meta.contacto.title', 'meta.contacto.description');
  }
}
