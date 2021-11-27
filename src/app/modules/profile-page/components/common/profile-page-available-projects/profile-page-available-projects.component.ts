import {
  AfterViewInit,
  HostBinding,
  Input,
  QueryList,
  ViewChildren
} from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Project } from '@data/schema/openapi/project-service/project';
import { ProjectService } from '@data/service/project.service';
import { forkJoin, Observable } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ModuleType } from '@data/schema/openapi/project-service/moduleType';
import { map, mergeMap, toArray } from 'rxjs/operators';

export interface AvailableProject {
  project: Project;
  modules: ModuleType[];
}

@Component({
  selector: 'app-profile-page-available-projects',
  templateUrl: './profile-page-available-projects.component.html',
  styleUrls: ['./profile-page-available-projects.component.scss']
})
export class ProfilePageAvailableProjectsComponent
  implements OnInit, AfterViewInit
{
  @HostBinding('class')
  classes: string = 'profile-available-projects';

  displayedColumns = ['name', 'type'];

  //professor$: Observable<Professor>
  projects$: Observable<Project[]>;
  availableProjects: AvailableProject[];
  dataSource = new MatTableDataSource<AvailableProject>();

  //Because the paginator is wrapped inside a *ngIf, @ViewChild cannot be used
  @ViewChildren('paginator') paginator: QueryList<MatPaginator>;

  constructor(private projectService: ProjectService) {}

  ngAfterViewInit() {
    this.paginator.changes.subscribe((comps: QueryList<MatPaginator>) => {
      this.dataSource.paginator = comps.first;
    });
  }

  ngOnInit() {
    this.projects$
      .pipe(
        mergeMap(projects => projects),
        mergeMap(project =>
          forkJoin({
            modules: this.projectService.getModulesOfProject(project)
          }).pipe(
            map((value: { modules: ModuleType[] }) => {
              return {
                project: project,
                modules: value.modules
              };
            })
          )
        ),
        toArray()
      )
      .subscribe({
        next: res => {
          this.availableProjects = res;
          this.dataSource.data.push(...res);
        },
        error: err => console.error(err)
      });
  }

  /**
   * Returns the available project types of the project.
   *
   * @param project Project
   */
  getProjectType(project: Project): string[] {
    return (
      this.availableProjects
        .find(p => p.project.id === project.id)
        .modules.map(m => m.name)
        .sort((a, b) => a.localeCompare(b)) ?? []
    );
  }

  @Input()
  set projects(projects: Observable<Project[]>) {
    this.projects$ = projects;
  }
}
