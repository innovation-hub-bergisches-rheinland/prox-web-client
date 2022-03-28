import { ChangeDetectionStrategy, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { faTasks } from '@fortawesome/free-solid-svg-icons';
import { Project, ProjectWithAssociations } from '@data/schema/project-service.types';

@Component({
  selector: 'app-profile-projects-card',
  templateUrl: './profile-projects-card.component.html',
  styleUrls: ['./profile-projects-card.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileProjectsCardComponent implements OnInit {
  @Input()
  projects: ProjectWithAssociations[];

  faTask = faTasks;

  constructor() {}

  ngOnInit(): void {}
}
