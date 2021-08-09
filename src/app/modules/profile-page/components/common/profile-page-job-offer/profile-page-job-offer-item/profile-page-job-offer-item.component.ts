import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { JobOffer } from '@data/schema/openapi/job-service/jobOffer';
import { JobService } from '@data/service/job.service';
import { forkJoin, from, Observable } from 'rxjs';
import { map, mergeMap, toArray } from 'rxjs/operators';
import { JobOfferType } from '@data/schema/openapi/job-service/jobOfferType';
import { JobOfferEntryLevel } from '@data/schema/openapi/job-service/jobOfferEntryLevel';

@Component({
  selector: 'app-profile-page-job-offer-item',
  templateUrl: './profile-page-job-offer-item.component.html',
  styleUrls: ['./profile-page-job-offer-item.component.scss']
})
export class ProfilePageJobOfferItemComponent implements OnInit, AfterViewInit {
  @Input()
  jobOffer: JobOffer;
  types: JobOfferType[];
  levels: JobOfferEntryLevel[];

  constructor(private jobService: JobService) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.jobService.getEntryLevelsFromJobOffer(this.jobOffer.id).subscribe({
      next: value => (this.levels = value)
    });

    this.jobService.getTypesFromJobOffer(this.jobOffer.id).subscribe({
      next: value => (this.types = value)
    });
  }
}
