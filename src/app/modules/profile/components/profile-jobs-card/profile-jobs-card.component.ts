import { Component, Input, OnInit } from '@angular/core';
import { faBriefcase } from '@fortawesome/free-solid-svg-icons';

export interface AvailableJob {
  readonly id: string;
  readonly name: string;
  readonly levels: string[];
}

@Component({
  selector: 'app-profile-jobs-card',
  templateUrl: './profile-jobs-card.component.html',
  styleUrls: ['./profile-jobs-card.component.scss']
})
export class ProfileJobsCardComponent implements OnInit {
  icon = faBriefcase;

  @Input()
  jobs: AvailableJob[];

  constructor() {}

  ngOnInit(): void {}
}
