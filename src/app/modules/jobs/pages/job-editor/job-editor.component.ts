import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { JobOffer } from '@data/schema/openapi/job-service/jobOffer';
import { JobService } from '@data/service/job.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin, Observable, of, throwError } from 'rxjs';
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
import {
  catchError,
  map,
  mergeMap,
  mergeMapTo,
  switchMap,
  tap
} from 'rxjs/operators';
import { JobOfferEvent } from '@modules/jobs/components/job-offer-form/job-offer-form.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '@modules/toast/toast.service';

@Component({
  selector: 'app-job-editor',
  templateUrl: './job-editor.component.html',
  styleUrls: ['./job-editor.component.scss']
})
export class JobEditorComponent implements OnInit {
  jobOffer: Observable<JobOffer>;
  jobId: string;

  constructor(
    private jobService: JobService,
    private route: ActivatedRoute,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.jobOffer = this.route.paramMap.pipe(
      map(params => {
        const id = (this.jobId = params.get('id'));
        return id;
      }),
      switchMap(id => this.jobService.getJobOffer(id)),
      catchError(err => {
        console.error(err);
        this.router.navigate(['/404']);
        return throwError(() => new Error('Error loading job offer'));
      })
    );
  }

  updateJobOffer(event: JobOfferEvent) {
    this.jobService
      .updateJobOffer(this.jobId, event.jobOffer)
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
              message: 'Stellenangebot erfolgreich bearbeitet'
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
