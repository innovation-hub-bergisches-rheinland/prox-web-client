import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Project, ProjectState } from '@data/schema/project.types';
import { faArrowRotateLeft, faFlagCheckered, faPlay } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-project-card-status-actions',
  templateUrl: './project-card-status-actions.component.html'
})
export class ProjectCardStatusActionsComponent implements OnInit {
  endProjectIcon = faFlagCheckered;
  startProjectIcon = faPlay;
  resetProjectIcon = faArrowRotateLeft;

  @Input()
  project: Project;

  @Output()
  status: EventEmitter<ProjectState> = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  onStatusChange(status: ProjectState) {
    this.status.emit(status);
  }
}
