import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { faTasks } from '@fortawesome/free-solid-svg-icons';

export interface AvailableProject {
  id: string;
  name: string;
  modules: string[];
}

@Component({
  selector: 'app-profile-projects-card',
  templateUrl: './profile-projects-card.component.html',
  styleUrls: ['./profile-projects-card.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileProjectsCardComponent implements OnInit {
  @Input()
  projects: AvailableProject[];
  displayedColumns: string[] = ['name', 'type'];

  faTask = faTasks;

  constructor() {}

  ngOnInit(): void {}
}
