import { DOCUMENT } from '@angular/common';
import { Component, HostListener, effect, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslocoModule, TranslocoPipe } from '@ngneat/transloco';
import { MAIN_NAV } from '@app/core/navigation/nav.model';
import { LanguagePersistenceService } from '@app/core/services/language-persistence.service';
import type { AppLang } from '@app/core/services/language-persistence.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, TranslocoModule, TranslocoPipe],
  templateUrl: './shell-header.html',
  styleUrl: './shell-header.scss'
})
export class AppHeaderComponent {
  protected readonly nav = MAIN_NAV;
  protected readonly mobileOpen = signal(false);
  private readonly lang = inject(LanguagePersistenceService);
  private readonly document = inject(DOCUMENT);

  constructor() {
    effect(() => {
      const open = this.mobileOpen();
      if (typeof this.document.defaultView === 'undefined') {
        return;
      }
      this.document.body.style.overflow = open ? 'hidden' : '';
    });
  }

  @HostListener('window:keydown.escape')
  onEscape(): void {
    this.mobileOpen.set(false);
  }

  toggleNav(): void {
    this.mobileOpen.update((v) => !v);
  }

  closeNav(): void {
    this.mobileOpen.set(false);
  }

  setLang(l: AppLang): void {
    this.lang.setLanguage(l);
  }

  isActive(l: AppLang): boolean {
    return this.lang.isActive(l);
  }
}
