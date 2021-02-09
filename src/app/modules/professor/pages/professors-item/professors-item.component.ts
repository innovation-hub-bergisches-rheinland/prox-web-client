import { Component, Input, OnInit } from '@angular/core';
import {
  Faculty,
  Professor
} from '@data/schema/openapi/professor-profile-service/models';
import { ProfessorOverview } from '@modules/professor/pages/professors-item/professor-overview';
import { Project } from '@data/schema/project.resource';
import { ProfessorProfileService } from '@data/service/professor-profile.service';
import { ProjectService } from '@data/service/project.service';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-professors-item',
  templateUrl: './professors-item.component.html',
  styleUrls: ['./professors-item.component.scss']
})
export class ProfessorsItemComponent implements OnInit {
  _professor: ProfessorOverview;

  @Input()
  set professor(professor: ProfessorOverview) {
    this._professor = professor;
  }

  get professor(): ProfessorOverview {
    return this._professor;
  }

  constructor() {}

  ngOnInit() {}

  getProfilePictureUrl(professor: ProfessorOverview): string {
    return professor._links?.image?.href ?? this.getDefaultPic();
  }

  getDefaultPic(): string {
    return './assets/images/blank-profile-picture.png';
  }
}
