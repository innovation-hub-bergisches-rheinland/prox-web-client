import { Component, Input, OnInit } from '@angular/core';
import {
  EntityModelProfessorOverviewDto,
  Professor,
  ProfessorOverviewDto
} from '@data/schema/openapi/professor-profile-service/models';
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
  _professor: EntityModelProfessorOverviewDto;

  @Input()
  set professor(professor: EntityModelProfessorOverviewDto) {
    this._professor = professor;
  }

  get professor(): EntityModelProfessorOverviewDto {
    return this._professor;
  }

  constructor() {}

  ngOnInit() {}

  getProfilePictureUrl(professor: EntityModelProfessorOverviewDto): string {
    return professor._links?.image?.href ?? this.getDefaultPic();
  }

  getDefaultPic(): string {
    return './assets/images/blank-profile-picture.png';
  }
}
