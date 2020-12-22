import { Component } from '@angular/core';

@Component({
  selector: 'app-professor-running-projects',
  templateUrl: './professor-running-projects.component.html',
  styleUrls: ['./professor-running-projects.component.scss'],
  host: { class: 'prof-running-projects' }
})
export class ProfessorRunningProjectsComponent {
  dataSource = [
    { subject: 'Predictive Maintenance', type: 'Abschlussarbeit' },
    { subject: 'Analyse von Data Logs', type: 'Projekt' }
  ];
  displayedColumns = ['subject', 'type'];

  constructor() {}
}
