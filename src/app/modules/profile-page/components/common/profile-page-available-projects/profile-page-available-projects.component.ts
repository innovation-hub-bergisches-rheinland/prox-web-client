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
  selector: 'app-profile-page-available-projects',
  templateUrl: './profile-page-available-projects.component.html',
  styleUrls: ['./profile-page-available-projects.component.scss'],
  host: { class: 'profile-available-projects' }
})
export class ProfilePageAvailableProjects implements OnInit, AfterViewInit {
  displayedColumns = ['name', 'type'];

  //professor$: Observable<Professor>
  projects$: Observable<Project[]>;
  availableProjects: Project[];
  dataSource = new MatTableDataSource<Project>();

  //Because the paginator is wrapped inside a *ngIf, @ViewChild cannot be used
  @ViewChildren('paginator') paginator: QueryList<MatPaginator>;

  constructor(private projectService: ProjectService) {}

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
   *
   * @param project Project
   */
  getProjectType(project: Project): string[] {
    return project.modules.map(m => m.name).sort((a, b) => a.localeCompare(b));
  }

  @Input()
  set projects(projects: Observable<Project[]>) {
    this.projects$ = projects;
  }
}
