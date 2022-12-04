import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { Project } from '@data/schema/project.types';
import { ProjectService } from '@data/service/project.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit, AfterViewChecked {
  projects$: Observable<Project[]>;

  constructor(private projectService: ProjectService) {}

  ngAfterViewChecked(): void {}
  ngOnInit(): void {
    this.projects$ = this.projectService.getAllProjects();
  }
}
