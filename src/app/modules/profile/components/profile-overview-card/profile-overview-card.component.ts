import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile-overview-card',
  templateUrl: './profile-overview-card.component.html',
  styleUrls: ['./profile-overview-card.component.scss']
})
export class ProfileOverviewCardComponent implements OnInit {
  @Input()
  title: string;

  @Input()
  subtitle: string;

  @Input()
  secondarySubtitle: string;

  @Input()
  href: string;

  private _chips: string[] = [];

  @Input()
  set chips(chips: string[]) {
    this._chips = chips;
  }

  get chips(): string[] {
    return this._chips.filter(s => s && s.trim().length > 0);
  }

  @Input()
  imgSrc: string;

  @Input()
  chipTitle: string;

  @Input()
  defaultImage: string = '/assets/images/blank-profile-picture.png';

  @Input()
  numAvailableProjects: number = 0;

  @Input()
  numRunningProjects: number = 0;

  @Input()
  numFinishedProjects: number = 0;

  constructor() {}

  ngOnInit() {}
}
