import { Component, Input, OnInit } from '@angular/core';
import { EntityModelProfessorOverviewDto } from '@data/schema/openapi/professor-profile-service/models';
import { ProfessorProfileService } from '@data/service/professor-profile.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-professor-overview-item',
  template: `<app-profile-overview-card
    [title]="professor.name"
    [subtitle]="faculty | async"
    [href]="getProfileLink()"
    [secondarySubtitle]="professor.mainSubject"
    [imgSrc]="getProfilePictureUrl()"
    [chipTitle]="'Lehr- und Forschungsgebiete'"
    [chips]="researchSubjects"
    [numAvailableProjects]="this.numAvailableProjects"
    [numRunningProjects]="this.numRunningProjects"
    [numFinishedProjects]="this.numFinishedProjects"
  ></app-profile-overview-card>`,
  host: { '[class.professor-item-wrapper]': 'true' }
})
export class ProfessorOverviewItemComponent implements OnInit {
  _professor: EntityModelProfessorOverviewDto;
  faculty: Observable<string>;
  defaultImg: string = './assets/images/blank-profile-picture.png';

  @Input()
  set professor(professor: EntityModelProfessorOverviewDto) {
    this._professor = professor;
  }

  get professor(): EntityModelProfessorOverviewDto {
    return this._professor;
  }

  get researchSubjects(): string[] {
    return this.professor.researchSubjects ?? [];
  }

  get numAvailableProjects(): number {
    return this.professor.sumAvailableProjects;
  }
  get numRunningProjects(): number {
    return this.professor.sumRunningProjects;
  }
  get numFinishedProjects(): number {
    return this.professor.sumFinishedProjects;
  }

  constructor(private professorProfileService: ProfessorProfileService) {}

  ngOnInit() {
    this.faculty = this.professorProfileService
      .getProfessorFaculty(this.professor.id)
      .pipe(map(f => f.name));
  }

  getProfilePictureUrl(): string {
    return this.professorProfileService.getProfessorImageUrl(this.professor.id);
  }

  getProfileLink(): string {
    return `./lecturers/${this.professor.id}`;
  }
}
