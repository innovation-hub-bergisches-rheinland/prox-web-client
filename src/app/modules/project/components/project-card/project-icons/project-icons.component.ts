import { Component, Input } from '@angular/core';
import { Owner, Specialization, Status } from '@data/schema/project-service.types';
import { faIndustry, faLaptop, faLock, faLockOpen, faRunning, faWrench } from '@fortawesome/free-solid-svg-icons';

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
