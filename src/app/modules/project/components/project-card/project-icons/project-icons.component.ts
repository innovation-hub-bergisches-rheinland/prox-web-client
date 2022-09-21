import { Component, Input } from '@angular/core';
import { Owner, Specialization, Status } from '@data/schema/project-service.types';
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

  specializationIcons = {
    INF: this.infIcon,
    ING: this.ingIcon
  };

  statusIcons: Record<Status, StatusIconDefinition> = {
    AVAILABLE: {
      icon: this.availableIcon,
      tooltip: 'Verfügbar'
    },
    FINISHED: {
      icon: this.unavailableIcon,
      tooltip: 'Abgeschlossen'
    },
    RUNNING: {
      icon: this.runningIcon,
      tooltip: 'Laufend'
    }
  };

  @Input()
  status: Status;

  @Input()
  owner: Owner;

  @Input()
  specialization: Specialization[];

  get specializationKeys(): string[] {
    return this.specialization?.map(s => s.key) ?? [];
  }
}
