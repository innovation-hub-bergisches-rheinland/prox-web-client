import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { JobOffer } from '@data/schema/openapi/job-service/jobOffer';
import { ProfessorProfileService } from '@data/service/professor-profile.service';
import { CompanyProfileService } from '@data/service/company-profile.service';
import { Observable } from 'rxjs';
import { JobService } from '@data/service/job.service';
import { map } from 'rxjs/operators';

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

  availableTypesAsString: Observable<string[]>;
  availableEntryLevelsAsString: Observable<string[]>;

  constructor(
    private professorService: ProfessorProfileService,
    private companyService: CompanyProfileService,
    private jobService: JobService
  ) {}

  ngOnInit(): void {
    this.getCreatorNameAndLink();
    this.availableTypesAsString = this.jobService
      .getTypesFromJobOffer(this.jobOffer.id)
      .pipe(map(jobOfferTypes => jobOfferTypes.map(type => type.description)));
    this.availableEntryLevelsAsString = this.jobService
      .getEntryLevelsFromJobOffer(this.jobOffer.id)
      .pipe(
        map(jobOfferEntryLevels => jobOfferEntryLevels.map(o => o.description))
      );
  }

  getFormattedDate(date: string): string {
    return new Intl.DateTimeFormat('de-DE').format(Date.parse(date));
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
