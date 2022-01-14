import {
  AfterViewInit,
  HostBinding,
  Input,
  QueryList,
  ViewChildren
} from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ProjectService } from '@data/service/project.service';
import { forkJoin, Observable } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { map, mergeMap, toArray } from 'rxjs/operators';
import { ModuleType, Project } from '@data/schema/project-service.types';

interface AvailableProject {
  project: Project;
  modules?: ModuleType[];
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
  projects$: Observable<AvailableProject[]>;
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
    this.projects$.subscribe({
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
  set projects(projects: Observable<AvailableProject[]>) {
    this.projects$ = projects;
  }
}
