import { Component, OnInit } from '@angular/core';
import { JobOffer } from '@data/schema/openapi/job-service/jobOffer';
import { JobService } from '@data/service/job.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { from, Observable } from 'rxjs';
import { JobOfferType } from '@data/schema/openapi/job-service/jobOfferType';
import { JobOfferEntryLevel } from '@data/schema/openapi/job-service/jobOfferEntryLevel';
import { KeycloakService } from 'keycloak-angular';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-job-overview',
  templateUrl: './job-overview.component.html',
  styleUrls: ['./job-overview.component.scss']
})
export class JobOverviewComponent implements OnInit {
  private _jobOffers: JobOffer[] = [];
  allJobOfferTypes: Observable<JobOfferType[]>;
  allJobOfferEntryLevels: Observable<JobOfferEntryLevel[]>;
  hasPermission: Observable<boolean>;

  public searchForm: FormGroup = this.formBuilder.group({
    searchString: [''],
    selectedJobTypes: [],
    selectedEntryLevel: []
  });

  get jobOffers(): JobOffer[] {
    return this._jobOffers.sort(
      (a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt)
    );
  }

  set jobOffers(jobOffers: JobOffer[]) {
    this._jobOffers = jobOffers;
  }

  constructor(
    private jobService: JobService,
    private formBuilder: FormBuilder,
    private keycloakService: KeycloakService
  ) {}

  ngOnInit(): void {
    this.jobService.getAllJobOffers().subscribe(res => (this.jobOffers = res));
    this.allJobOfferEntryLevels = this.jobService.getAllEntryLevels();
    this.allJobOfferTypes = this.jobService.getAllJobTypes();
    this.hasPermission = from(this.keycloakService.isLoggedIn()).pipe(
      map(loggedIn => {
        if (loggedIn) {
          return (
            this.keycloakService.isUserInRole('professor') ||
            this.keycloakService.isUserInRole('company-manager')
          );
        }
        return false;
      })
    );
  }
}
