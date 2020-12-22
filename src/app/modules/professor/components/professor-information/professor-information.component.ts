import { Component } from '@angular/core';

@Component({
  selector: 'app-professor-information',
  templateUrl: './professor-information.component.html',
  styleUrls: ['./professor-information.component.scss'],
  host: { class: 'prof-information' }
})
export class ProfessorInformationComponent {
  constructor() {}
}
