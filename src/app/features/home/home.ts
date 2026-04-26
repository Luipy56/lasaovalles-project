import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoModule, TranslocoPipe } from '@ngneat/transloco';
import { SeoService } from '@app/core/services/seo.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [TranslocoModule, TranslocoPipe, RouterLink, NgOptimizedImage],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  constructor() {
    const seo = inject(SeoService);
    const dr = inject(DestroyRef);
    seo.bindPageToTranslations(dr, 'meta.home.title', 'meta.home.description');
  }
}
