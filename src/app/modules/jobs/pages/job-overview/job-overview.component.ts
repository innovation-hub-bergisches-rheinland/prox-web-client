import { Component, OnInit } from '@angular/core';
import { JobOffer } from '@data/schema/openapi/job-service/jobOffer';
import { JobService } from '@data/service/job.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable, from } from 'rxjs';
import { JobOfferType } from '@data/schema/openapi/job-service/jobOfferType';
import { JobOfferEntryLevel } from '@data/schema/openapi/job-service/jobOfferEntryLevel';
import { KeycloakService } from 'keycloak-angular';
import { map } from 'rxjs/operators';
import { ToastService } from '@modules/toast/toast.service';

@Component({
  selector: 'app-job-overview',
  templateUrl: './job-overview.component.html',
  styleUrls: ['./job-overview.component.scss']
})
export class JobOverviewComponent implements OnInit {
  private _jobOffers: JobOffer[] = [];
  private allJobOffers: JobOffer[] = [];
  allJobOfferTypes: Observable<JobOfferType[]>;
  allJobOfferEntryLevels: Observable<JobOfferEntryLevel[]>;
  hasPermission: Observable<boolean>;

  public searchForm: FormGroup = this.formBuilder.group({
    searchString: [''],
    selectedJobTypes: [],
    selectedEntryLevel: []
  });

  get jobOffers(): JobOffer[] {
    return this._jobOffers.sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt));
  }

  set jobOffers(jobOffers: JobOffer[]) {
    this._jobOffers = jobOffers;
  }

  constructor(
    private jobService: JobService,
    private formBuilder: FormBuilder,
    private keycloakService: KeycloakService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.jobService.getAllJobOffers().subscribe(res => (this.jobOffers = this.allJobOffers = res));
    this.allJobOfferEntryLevels = this.jobService.getAllEntryLevels();
    this.allJobOfferTypes = this.jobService.getAllJobTypes();
    this.hasPermission = from(this.keycloakService.isLoggedIn()).pipe(
      map(loggedIn => {
        if (loggedIn) {
          return this.keycloakService.isUserInRole('professor') || this.keycloakService.isUserInRole('company-manager');
        }
        return false;
      })
    );
  }

  jobOfferDeleted(jobOffer: JobOffer) {
    this._jobOffers = this._jobOffers.filter(j => jobOffer.id !== j.id);
  }

  searchJobOffers() {
    const searchString = this.searchForm.value.searchString;
    const entryLevels = this.searchForm.value.selectedEntryLevel;
    const types = this.searchForm.value.selectedJobTypes;
    this.jobService.searchJobOffers(searchString, entryLevels, types).subscribe({
      next: res => (this._jobOffers = res),
      error: err => {
        console.error(err);
        this.toastService.showToasts([
          {
            isError: true,
            message: 'Suche konnte nicht erfolgreich durchgeführt werden'
          }
        ]);
      }
    });
  }
}
