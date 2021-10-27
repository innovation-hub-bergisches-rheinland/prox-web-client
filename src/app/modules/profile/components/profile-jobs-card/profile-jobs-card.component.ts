import { Component, Input, OnInit } from '@angular/core';
import { faBriefcase } from '@fortawesome/free-solid-svg-icons';

export interface AvailableJob {
  id: string;
  name: string;
  levels: string[];
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

  displayedColumns: string[] = ['name', 'level'];

  constructor() {}

  ngOnInit(): void {}
}
