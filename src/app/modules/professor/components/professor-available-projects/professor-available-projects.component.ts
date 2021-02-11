import {
  AfterViewInit,
  Input,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Professor } from '@data/schema/openapi/professor-profile-service/models';
import { Project } from '@data/schema/project.resource';
import { ProjectService } from '@data/service/project.service';
import { Observable } from 'rxjs';
import { environment } from '@env';
import { type } from 'os';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-professor-available-projects',
  templateUrl: './professor-available-projects.component.html',
  styleUrls: ['./professor-available-projects.component.scss'],
  host: { class: 'prof-avaialable-projects' }
})
export class ProfessorRunningProjectsComponent
  implements OnInit, AfterViewInit {
  displayedColumns = ['name', 'type'];

  //professor$: Observable<Professor>
  projects$: Observable<Project[]>;
  availableProjects: Project[];
  dataSource = new MatTableDataSource<Project>();

  //Because the paginator is wrapped inside a *ngIf, @ViewChild cannot be used
  @ViewChildren('paginator') paginator: QueryList<MatPaginator>;

  constructor() {}

  ngAfterViewInit() {
    this.paginator.changes.subscribe((comps: QueryList<MatPaginator>) => {
      this.dataSource.paginator = comps.first;
    });
  }

  ngOnInit() {
    this.projects$.subscribe(
      res => {
        this.availableProjects = res;
        this.dataSource.data.push(...res);
      },
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
