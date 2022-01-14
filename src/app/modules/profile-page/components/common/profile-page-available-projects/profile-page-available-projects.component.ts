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

interface ModuleType {
  name: string;
}

interface AvailableProject {
  id: string;
  name: string;
  modules: ModuleType[];
}

@Component({
  selector: 'app-profile-page-available-projects',
  templateUrl: './profile-page-available-projects.component.html',
  styleUrls: ['./profile-page-available-projects.component.scss']
})
export class ProfilePageAvailableProjectsComponent {
  @HostBinding('class')
  classes: string = 'profile-available-projects';

  displayedColumns = ['name', 'type'];

  @Input()
  availableProjects: AvailableProject[];

  //Because the paginator is wrapped inside a *ngIf, @ViewChild cannot be used
  @ViewChildren('paginator') paginator: QueryList<MatPaginator>;

  constructor(private projectService: ProjectService) {}
}
