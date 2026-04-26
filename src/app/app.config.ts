import { provideHttpClient, withFetch } from '@angular/common/http';
import { APP_INITIALIZER, ApplicationConfig, isDevMode, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideTransloco } from '@ngneat/transloco';

import { TranslocoHttpLoader } from '@app/core/i18n/transloco-loader';
import { LanguagePersistenceService } from '@app/core/services/language-persistence.service';
import { routes } from './app.routes';

function initLangPersistence() {
  return () => {
    // Constructor side effects of LanguagePersistenceService
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withFetch()),
    provideRouter(
      routes,
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' })
    ),
    provideTransloco({
      config: {
        availableLangs: ['ca', 'es'],
        defaultLang: 'ca',
        fallbackLang: 'ca',
        reRenderOnLangChange: true,
        prodMode: !isDevMode()
      },
      loader: TranslocoHttpLoader
    }),
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: initLangPersistence,
      deps: [LanguagePersistenceService]
    }
  ]
};
