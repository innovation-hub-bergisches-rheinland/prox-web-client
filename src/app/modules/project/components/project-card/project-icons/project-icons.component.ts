import { Component, Input } from '@angular/core';
import { Discipline, ProjectPartner, ProjectState, ProjectStatus } from '@data/schema/project.types';
import { IconDefinition, faIndustry, faLaptop, faLock, faLockOpen, faRunning, faWrench } from '@fortawesome/free-solid-svg-icons';

interface StatusIconDefinition {
  icon: IconDefinition;
  tooltip: string;
}

@Component({
  selector: 'app-project-icons',
  templateUrl: './project-icons.component.html',
  styleUrls: ['./project-icons.component.scss']
})
export class ProjectIconsComponent {
  availableIcon = faLockOpen;
  unavailableIcon = faLock;
  runningIcon = faRunning;
  infIcon = faLaptop;
  ingIcon = faWrench;
  companyIcon = faIndustry;

  disciplineIcons = {
    INF: this.infIcon,
    ING: this.ingIcon
  };

  statusIcons: Record<ProjectState, StatusIconDefinition> = {
    OFFERED: {
      icon: this.availableIcon,
      tooltip: 'Verfügbar'
    },
    COMPLETED: {
      icon: this.unavailableIcon,
      tooltip: 'Abgeschlossen'
    },
    RUNNING: {
      icon: this.runningIcon,
      tooltip: 'Laufend'
    },
    PROPOSED: undefined,
    ARCHIVED: undefined,
    STALE: undefined
  };

  @Input()
  status: ProjectStatus | undefined;

  @Input()
  partner: ProjectPartner | undefined;

  @Input()
  disciplines: Discipline[] | undefined;
}
