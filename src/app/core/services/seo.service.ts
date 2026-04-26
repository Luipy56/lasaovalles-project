import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Meta, Title } from '@angular/platform-browser';
import { TranslocoService } from '@ngneat/transloco';
import { combineLatest, merge, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

/**
 * Binds page title and meta description to Transloco keys. Call once per routable view.
 * Comments in English per project convention.
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly transloco = inject(TranslocoService);

  bindPageToTranslations(destroyRef: DestroyRef, titleKey: string, descriptionKey: string): void {
    merge(of(this.transloco.getActiveLang()), this.transloco.langChanges$)
      .pipe(
        takeUntilDestroyed(destroyRef),
        switchMap(() =>
          combineLatest([
            this.transloco.selectTranslate(titleKey),
            this.transloco.selectTranslate(descriptionKey)
          ])
        )
      )
      .subscribe(([pageTitle, description]) => {
        this.title.setTitle(pageTitle);
        this.meta.updateTag({ name: 'description', content: description });
      });
  }
}
