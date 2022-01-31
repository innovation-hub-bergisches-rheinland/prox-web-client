import { Component, OnInit } from '@angular/core';
import { JobOffer } from '@data/schema/openapi/job-service/jobOffer';
import { JobService } from '@data/service/job.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EMPTY, Observable, from, throwError } from 'rxjs';
import { JobOfferType } from '@data/schema/openapi/job-service/jobOfferType';
import { JobOfferEntryLevel } from '@data/schema/openapi/job-service/jobOfferEntryLevel';
import { KeycloakService } from 'keycloak-angular';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-job-details',
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.scss']
})
export class JobDetailsComponent implements OnInit {
  jobOffer: Observable<JobOffer>;
  hasPermission: Observable<boolean>;

  constructor(
    private jobService: JobService,
    private formBuilder: FormBuilder,
    private keycloakService: KeycloakService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.jobOffer = this.activatedRoute.paramMap.pipe(
      switchMap(params => this.jobService.getJobOffer(params.get('id'))),
      catchError(err => {
        console.error(err);
        this.router.navigate(['/404']);
        return throwError(() => new Error('Error loading job offer'));
      })
    );
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
    this.router.navigate(['/jobs']);
  }
}
