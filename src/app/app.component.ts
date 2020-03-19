import { Component } from '@angular/core';
import { CacheHelper } from 'angular4-hal';

@Component({
  selector: 'prox-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Prox';

  constructor() {
    CacheHelper.isActive = false;
  }
}
