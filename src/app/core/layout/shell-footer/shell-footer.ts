import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslocoPipe } from '@ngneat/transloco';
import { APP_VERSION } from '@app/core/version';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterModule, TranslocoPipe],
  templateUrl: './shell-footer.html',
  styleUrl: './shell-footer.scss'
})
export class AppFooterComponent {
  readonly appVersion = APP_VERSION;
}
