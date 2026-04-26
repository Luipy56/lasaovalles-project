import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AppHeaderComponent } from '@app/core/layout/shell-header/shell-header';
import { AppFooterComponent } from '@app/core/layout/shell-footer/shell-footer';
import { DevWatermarkComponent } from '@app/core/layout/dev-watermark/dev-watermark';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterModule, RouterOutlet, AppHeaderComponent, AppFooterComponent, DevWatermarkComponent],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: { class: 'app-main-layout' }
})
export class MainLayoutComponent {}
