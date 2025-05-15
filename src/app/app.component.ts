import { Component } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})

export class AppComponent {
  title = 'agent-portal-client';

  constructor(private translateService: TranslateService) {
    this.translateService.addLangs(['en', 'ar']);
    this.translateService.setDefaultLang('en');
    this.translateService.use('en');
  }
}
