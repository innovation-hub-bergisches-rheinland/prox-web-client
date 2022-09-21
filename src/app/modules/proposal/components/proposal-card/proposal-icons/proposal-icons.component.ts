import { Component, Input } from '@angular/core';
import { Owner, Specialization } from '@data/schema/project-service.types';
import { faIndustry, faLaptop, faWrench } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-proposal-icons',
  templateUrl: './proposal-icons.component.html'
})
export class ProposalIconsComponent {
  infIcon = faLaptop;
  ingIcon = faWrench;
  companyIcon = faIndustry;

  specializationIcons = {
    INF: this.infIcon,
    ING: this.ingIcon
  };

  @Input()
  owner: Owner;

  @Input()
  specialization: Specialization[];

  get specializationKeys(): string[] {
    return this.specialization?.map(s => s.key) ?? [];
  }
}
