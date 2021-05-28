import { Component, Input, OnInit } from '@angular/core';
import { Company } from '@data/schema/openapi/company-profile-service/company';
import {
  EntityModelProfessorOverviewDto,
  Professor,
  ProfessorOverviewDto
} from '@data/schema/openapi/professor-profile-service/models';
import { Project } from '@data/schema/project.resource';
import { CompanyProfileService } from '@data/service/company-profile.service';
import { ProfessorProfileService } from '@data/service/professor-profile.service';
import { ProjectService } from '@data/service/project.service';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-profile-overview-card',
  templateUrl: './profile-overview-card.component.html',
  styleUrls: ['./profile-overview-card.component.scss'],
  host: { class: 'profile-overview' }
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

  ngOnInit() {
    console.log(this.chips);
  }
}
