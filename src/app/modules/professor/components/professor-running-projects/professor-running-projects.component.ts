import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Professor } from '@data/schema/openapi/professor-profile-service/models';
import { Project } from '@data/schema/project.resource';
import { ProjectService } from '@data/service/project.service';
import { Observable } from 'rxjs';
import { environment } from '@env';

@Component({
  selector: 'app-professor-running-projects',
  templateUrl: './professor-running-projects.component.html',
  styleUrls: ['./professor-running-projects.component.scss'],
  host: { class: 'prof-running-projects' }
})
export class ProfessorRunningProjectsComponent implements OnInit {
  displayedColumns = ['name', 'type'];

  //professor$: Observable<Professor>
  projects$: Observable<Project[]>;
  availableProjects: Project[];

  constructor() {}

  ngOnInit() {
    this.projects$.subscribe(
      res => {
        console.log(res);
        this.availableProjects = res;
      },
      err => console.error(err)
    );
  }

  getProjectType(project: Project): string {
    return project.modules.map(module => module.name).join(' / ');
  }

  getProjectLink(project: Project): string {
    return ``;
  }

  @Input()
  set projects(projects: Observable<Project[]>) {
    this.projects$ = projects;
  }
}
