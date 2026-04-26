import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TranslocoLoader } from '@ngneat/transloco';

@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
  private readonly http = inject(HttpClient);

  getTranslation(lang: string) {
    // Served from /i18n/{lang}.json (public folder in Angular 21+)
    return this.http.get<Record<string, unknown>>(`/i18n/${lang}.json`);
  }
}
