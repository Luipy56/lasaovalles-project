import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';

const STORAGE_KEY = 'saovalles.lang';
const SUPPORTED = ['ca', 'es'] as const;
export type AppLang = (typeof SUPPORTED)[number];

@Injectable({ providedIn: 'root' })
export class LanguagePersistenceService {
  private readonly document = inject(DOCUMENT);
  private readonly transloco = inject(TranslocoService);

  constructor() {
    const fromStorage = this.readStoredLang();
    if (fromStorage) {
      this.transloco.setActiveLang(fromStorage);
    }
    this.transloco.langChanges$.subscribe((lang) => {
      this.document.documentElement.setAttribute('lang', lang);
      try {
        this.document.defaultView?.localStorage.setItem(STORAGE_KEY, lang);
      } catch {
        // private mode
      }
    });
  }

  setLanguage(lang: AppLang): void {
    if (SUPPORTED.includes(lang)) {
      this.transloco.setActiveLang(lang);
    }
  }

  isActive(lang: AppLang): boolean {
    return this.transloco.getActiveLang() === lang;
  }

  private readStoredLang(): AppLang | null {
    try {
      const v = this.document.defaultView?.localStorage.getItem(STORAGE_KEY);
      if (v === 'ca' || v === 'es') {
        return v;
      }
    } catch {
      // ignore
    }
    return null;
  }
}
