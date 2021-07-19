import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { JobOffer } from '@data/schema/openapi/job-service/jobOffer';
import {
  getEntryLevelRepresentation,
  getTypeRepresentation
} from '@data/service/job.service';
import AvailableTypesEnum = JobOffer.AvailableTypesEnum;
import EntryLevelsEnum = JobOffer.EntryLevelsEnum;
import { ProfessorProfileService } from '@data/service/professor-profile.service';
import { CompanyProfileService } from '@data/service/company-profile.service';

@Component({
  selector: 'app-job-item',
  templateUrl: './job-item.component.html',
  styleUrls: ['./job-item.component.scss']
})
export class JobItemComponent implements OnInit {
  @Input()
  jobOffer: JobOffer;
  creatorName = '';
  creatorLink = '';

  constructor(
    private professorService: ProfessorProfileService,
    private companyService: CompanyProfileService
  ) {}

  ngOnInit(): void {
    this.getCreatorNameAndLink();
  }

  getTypeRepresentation(type: AvailableTypesEnum): string {
    return getTypeRepresentation(type);
  }

  getEntryLevelRepresentation(level: EntryLevelsEnum): string {
    return getEntryLevelRepresentation(level);
  }

  getFormattedDate(): string {
    return new Intl.DateTimeFormat('de-DE').format(
      Date.parse(this.jobOffer.createdAt)
    );
  }

  getCreatorNameAndLink() {
    switch (this.jobOffer.createdBy.variant) {
      case 'PROFESSOR':
        this.professorService
          .getProfessorProfile(this.jobOffer.createdBy.userId)
          .subscribe(res => {
            this.creatorName = res.name;
            this.creatorLink = `/lecturers/${res.id}`;
          });
        break;
      case 'COMPANY':
        this.companyService
          .findCompanyByCreatorId(this.jobOffer.createdBy.userId)
          .subscribe(res => {
            this.creatorName = res.information.name;
            this.creatorLink = `/companies/${res.id}`;
          });
        break;
    }
  }
}
