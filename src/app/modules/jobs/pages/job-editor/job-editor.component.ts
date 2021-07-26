import { Component, OnInit } from '@angular/core';
import { JobOffer } from '@data/schema/openapi/job-service/jobOffer';
import { JobService } from '@data/service/job.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { JobOfferType } from '@data/schema/openapi/job-service/jobOfferType';
import { JobOfferEntryLevel } from '@data/schema/openapi/job-service/jobOfferEntryLevel';

@Component({
  selector: 'app-job-editor',
  templateUrl: './job-editor.component.html',
  styleUrls: ['./job-editor.component.scss']
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
    jobType: [],
    jobEntryLevel: []
  });
  allJobOfferTypes: Observable<JobOfferType[]>;
  allJobOfferEntryLevels: Observable<JobOfferEntryLevel[]>;

  constructor(
    private jobService: JobService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.allJobOfferEntryLevels = this.jobService.getAllEntryLevels();
    this.allJobOfferTypes = this.jobService.getAllJobTypes();
  }

  d(): void {
    console.log(this.jobOfferForm.controls.title.errors);
  }
}
