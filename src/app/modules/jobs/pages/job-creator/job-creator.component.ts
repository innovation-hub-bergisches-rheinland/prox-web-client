import { Component, Input, OnInit } from '@angular/core';
import { JobOffer } from '@data/schema/openapi/job-service/jobOffer';
import { JobService } from '@data/service/job.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin, Observable, of } from 'rxjs';
import { JobOfferType } from '@data/schema/openapi/job-service/jobOfferType';
import { JobOfferEntryLevel } from '@data/schema/openapi/job-service/jobOfferEntryLevel';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE
} from '@angular/material/core';
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter
} from '@angular/material-moment-adapter';
import { Moment } from 'moment';
import * as moment from 'moment';
import { mergeMap, mergeMapTo } from 'rxjs/operators';
import { JobOfferEvent } from '@modules/jobs/components/job-offer-form/job-offer-form.component';
import { Router } from '@angular/router';
import { ToastService } from '@modules/toast/toast.service';

@Component({
  selector: 'app-job-creator',
  templateUrl: './job-creator.component.html',
  styleUrls: ['./job-creator.component.scss']
})
export class JobCreatorComponent implements OnInit {
  constructor(
    private jobService: JobService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {}

  // TODO refactor
  saveJobOffer(event: JobOfferEvent) {
    this.jobService
      .createJobOffer(event.jobOffer)
      .pipe(
        mergeMap(jobOffer =>
          forkJoin({
            jobOffer: of(jobOffer),
            types: this.jobService.setJobTypes(jobOffer.id, event.types ?? []),
            levels: this.jobService.setEntryLevels(
              jobOffer.id,
              event.levels ?? []
            )
          })
        )
      )
      .subscribe({
        next: value => {
          this.toastService.showToasts([
            {
              isError: false,
              message: 'Stellenangebot erfolgreich angelegt'
            }
          ]);
          this.router.navigate([`/jobs/${value.jobOffer.id}`]);
        },
        error: err => {
          this.toastService.showToasts([
            {
              isError: true,
              message:
                'Das Stellenangebot konnte nicht gespeichert werden, bitte versuchen Sie es später erneut'
            }
          ]);
          console.error(err);
        }
      });
  }
}
