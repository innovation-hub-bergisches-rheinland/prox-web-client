import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { JobOffer } from '@data/schema/openapi/job-service/jobOffer';
import { JobService } from '@data/service/job.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { JobOfferType } from '@data/schema/openapi/job-service/jobOfferType';
import { JobOfferEntryLevel } from '@data/schema/openapi/job-service/jobOfferEntryLevel';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import * as moment from 'moment';
import { Moment } from 'moment';

export interface JobOfferEvent {
  jobOffer: JobOffer;
  types?: JobOfferType[];
  levels?: JobOfferEntryLevel[];
}

@Component({
  selector: 'app-job-offer-form',
  templateUrl: './job-offer-form.component.html',
  styleUrls: ['./job-offer-form.component.scss'],
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
export class JobOfferFormComponent implements OnInit {
  jobOfferForm: FormGroup = this.formBuilder.group({
    title: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(255)]],
    description: ['', [Validators.required, Validators.minLength(50), Validators.maxLength(50000)]],
    date: [],
    jobType: [],
    jobEntryLevel: []
  });
  allJobOfferTypes: Observable<JobOfferType[]>;
  allJobOfferEntryLevels: Observable<JobOfferEntryLevel[]>;
  @Output() saveEvent = new EventEmitter<JobOfferEvent>();

  get jobOffer(): JobOffer {
    return {
      id: undefined, // TODO
      description: this.jobOfferForm.value.description,
      title: this.jobOfferForm.value.title,
      earliestStartOfEmployment: this.jobOfferForm.value.date ? (this.jobOfferForm.value.date as Moment).format('YYYY-MM-DD') : null
    };
  }

  @Input()
  set jobOffer(jobOffer: JobOffer) {
    if (jobOffer) {
      this.jobOfferForm.patchValue({
        title: jobOffer.title,
        description: jobOffer.description,
        date: moment(jobOffer.earliestStartOfEmployment)
      });
    }
  }

  get selectedJobOfferTypes(): JobOfferType[] {
    return this.jobOfferForm.value.jobType;
  }

  get selectedJobOfferEntryLevels(): JobOfferEntryLevel[] {
    return this.jobOfferForm.value.jobEntryLevel;
  }

  constructor(private jobService: JobService, private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.allJobOfferEntryLevels = this.jobService.getAllEntryLevels();
    this.allJobOfferTypes = this.jobService.getAllJobTypes();
  }

  saveOrUpdate(): void {
    if (this.jobOfferForm.valid) {
      this.saveEvent.emit({
        jobOffer: this.jobOffer,
        levels: this.selectedJobOfferEntryLevels,
        types: this.selectedJobOfferTypes
      });
    }
  }
}
