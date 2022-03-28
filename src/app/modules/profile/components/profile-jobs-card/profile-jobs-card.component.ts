import { Component, Input, OnInit } from '@angular/core';
import { faBriefcase } from '@fortawesome/free-solid-svg-icons';
import { JobOffer } from '@data/schema/openapi/job-service/jobOffer';

@Component({
  selector: 'app-profile-jobs-card',
  templateUrl: './profile-jobs-card.component.html',
  styleUrls: ['./profile-jobs-card.component.scss']
})
export class ProfileJobsCardComponent implements OnInit {
  icon = faBriefcase;

  @Input()
  jobs: JobOffer[];

  constructor() {}

  ngOnInit(): void {}
}
