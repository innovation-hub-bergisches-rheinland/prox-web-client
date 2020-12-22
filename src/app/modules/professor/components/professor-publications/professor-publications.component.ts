import { Component } from '@angular/core';

@Component({
  selector: 'app-professor-publications',
  templateUrl: './professor-publications.component.html',
  styleUrls: ['./professor-publications.component.scss'],
  host: { class: 'prof-publications' }
})
export class ProfessorPublicationsComponent {
  constructor() {}
}
