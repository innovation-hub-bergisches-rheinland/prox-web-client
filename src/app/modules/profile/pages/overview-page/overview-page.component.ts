import { Component, Input, OnInit } from '@angular/core';

export interface OverviewItem {
  readonly title: string;
  readonly href: string;
  readonly subtitle?: string;
  readonly avatar: string;
  readonly numAvailableProjects: number;
  readonly numRunningProjects: number;
  readonly numFinishedProjects: number;
}

@Component({
  selector: 'app-overview-page',
  templateUrl: './overview-page.component.html',
  styleUrls: ['./overview-page.component.scss']
})
export class OverviewPageComponent implements OnInit {
  @Input()
  title: string;

  @Input()
  items: OverviewItem[];

  constructor() {}

  ngOnInit(): void {}
}
