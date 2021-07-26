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

@Component({
  selector: 'app-job-editor',
  templateUrl: './job-editor.component.html',
  styleUrls: ['./job-editor.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE]
    },
    {
      provide: MAT_DATE_LOCALE,
      useValue: 'de-DE'
    }
  ]
})
export class JobEditorComponent implements OnInit {
  jobOfferForm: FormGroup = this.formBuilder.group({
    title: [
      '',
      [Validators.required, Validators.minLength(10), Validators.maxLength(255)]
    ],
    description: [
      '',
      [
        Validators.required,
        Validators.minLength(50),
        Validators.maxLength(50000)
      ]
    ],
    date: [],
    jobType: [],
    jobEntryLevel: []
  });
  allJobOfferTypes: Observable<JobOfferType[]>;
  allJobOfferEntryLevels: Observable<JobOfferEntryLevel[]>;

  get jobOffer(): JobOffer {
    return {
      id: undefined, // TODO
      description: this.jobOfferForm.value.description,
      title: this.jobOfferForm.value.title,
      earliestStartOfEmployment: (
        this.jobOfferForm.value.date as Moment
      ).format('YYYY-MM-DD')
    };
  }

  get selectedJobOfferTypes(): JobOfferType[] {
    return this.jobOfferForm.value.jobType;
  }

  get selectedJobOfferEntryLevels(): JobOfferEntryLevel[] {
    return this.jobOfferForm.value.jobEntryLevel;
  }

  set jobOffer(jobOffer: JobOffer) {
    this.jobOfferForm.patchValue({
      title: jobOffer.title,
      description: jobOffer.description,
      date: moment(jobOffer.earliestStartOfEmployment)
    });
  }

  constructor(
    private jobService: JobService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.allJobOfferEntryLevels = this.jobService.getAllEntryLevels();
    this.allJobOfferTypes = this.jobService.getAllJobTypes();
  }

  saveOrUpdate(): void {
    if (this.jobOfferForm.valid) {
      this.jobService
        .createJobOffer(this.jobOffer)
        .pipe(
          mergeMap(jobOffer =>
            forkJoin({
              jobOffer: of(jobOffer),
              types: this.jobService.setJobTypes(
                jobOffer.id,
                this.selectedJobOfferTypes
              ),
              levels: this.jobService.setEntryLevels(
                jobOffer.id,
                this.selectedJobOfferEntryLevels
              )
            })
          )
        )
        .subscribe({
          next: value => console.log(value),
          error: err => console.error(err)
        });
    }
  }
}
