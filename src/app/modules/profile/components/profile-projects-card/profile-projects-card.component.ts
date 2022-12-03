import { ChangeDetectionStrategy, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Project } from '@data/schema/project.types';
import { faTasks } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-profile-projects-card',
  templateUrl: './profile-projects-card.component.html',
  styleUrls: ['./profile-projects-card.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileProjectsCardComponent {
  @Input()
  projects: Project[];

  faTask = faTasks;
}
