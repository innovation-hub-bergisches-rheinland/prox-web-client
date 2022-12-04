import { Component, Input, OnInit } from '@angular/core';
import { Project } from '@data/schema/project.types';

@Component({
  selector: 'app-project-card-header',
  templateUrl: './project-card-header.component.html'
})
export class ProjectCardHeaderComponent implements OnInit {
  @Input()
  project: Project;

  constructor() {}

  ngOnInit() {}
}
