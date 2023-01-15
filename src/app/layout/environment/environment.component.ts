import { Component } from '@angular/core';
import { environment } from '@env';
import { faFlag } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-environment',
  templateUrl: './environment.component.html'
})
export class EnvironmentComponent {
  isDev = !environment.production;
  name = environment.name;
  faFlag = faFlag;
}
