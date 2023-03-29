import { Component, Input } from '@angular/core';
import { ProjectState, ProjectStatus } from '@data/schema/project.types';
import { IconDefinition, faFileLines, faLock, faLockOpen, faRunning } from '@fortawesome/free-solid-svg-icons';

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
  proposalIcon = faFileLines;

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
    PROPOSED: {
      icon: this.proposalIcon,
      tooltip: 'Vorschlag'
    },
    ARCHIVED: undefined,
    STALE: undefined
  };

  @Input()
  status: ProjectStatus | undefined;
}
