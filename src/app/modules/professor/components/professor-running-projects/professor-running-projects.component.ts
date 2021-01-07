import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Professor } from '@data/schema/openapi/professor-profile-service/models';
import { Project } from '@data/schema/project.resource';
import { ProjectService } from '@data/service/project.service';
import { Observable } from 'rxjs';
import { environment } from '@env';
import { type } from 'os';

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
      res => (this.availableProjects = res),
      err => console.error(err)
    );
  }

  /**
   * Returns the available project types of the project.
   * The function distincts all available modules by their projectType and returns the name.
   *
   * For example a project has the following modules:
   * ```
   * [
   *   {
   *     projectType = 'BA',
   *     name = 'Bachelorarbeit'
   *   },
   *   {
   *     projectType = 'BA',
   *     name = 'Bachelor Arbeit'
   *   }
   * ]
   * ```
   *
   * The return value would be:
   * ```
   * [
   *   'Bachelorarbeit'
   * ]
   * ```
   *
   * @param project Project
   */
  getProjectType(project: Project): string[] {
    return project.modules
      .filter((obj, pos, arr) => {
        return (
          arr.map(m => m['projectType']).indexOf(obj['projectType']) === pos
        );
      })
      .map(m => m.name);
  }

  @Input()
  set projects(projects: Observable<Project[]>) {
    this.projects$ = projects;
  }
}
