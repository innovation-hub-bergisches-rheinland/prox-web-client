import { Component, OnInit } from '@angular/core';
import { JobOffer } from '@data/schema/openapi/job-service/jobOffer';
import { getTypeRepresentation, JobService } from '@data/service/job.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { StatusOption } from '@modules/project/pages/project/status-option.enum';
import AvailableTypesEnum = JobOffer.AvailableTypesEnum;

@Component({
  selector: 'app-job-overview',
  templateUrl: './job-overview.component.html',
  styleUrls: ['./job-overview.component.scss']
})
export class JobOverviewComponent implements OnInit {
  private _jobOffers: JobOffer[] = [];

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
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.jobService.getAllJobOffers().subscribe(res => (this.jobOffers = res));
  }
}
