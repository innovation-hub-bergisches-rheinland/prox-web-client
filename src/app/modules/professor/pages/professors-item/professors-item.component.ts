import { Component, Input, OnInit } from '@angular/core';
import {
  Faculty,
  Professor
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
  _professor: Professor;
  faculty: Faculty;
  sumOfAvailableProjects: number = 0;
  sumOfRunningProjects: number = 0;
  sumOfFinishedProjects: number = 0;

  @Input()
  set professor(professor: Professor) {
    this._professor = professor;
  }

  get professor(): Professor {
    return this._professor;
  }

  constructor(
    private professorProfileService: ProfessorProfileService,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    this.professorProfileService
      .getProfessorFaculty(this.professor.id)
      .subscribe(
        res => (this.faculty = res),
        err => console.error(err)
      );

    combineLatest([
      this.projectService.findFinishedProjectsOfCreator(this.professor.id),
      this.projectService.findAvailableProjectsOfCreator(this.professor.id),
      this.projectService.findRunningProjectsOfCreator(this.professor.id)
    ]).subscribe(
      ([finished, available, running]) => {
        this.sumOfFinishedProjects = finished.length;
        this.sumOfAvailableProjects = available.length;
        this.sumOfRunningProjects = running.length;
      },
      err => console.error(err)
    );
  }

  getProfessorUrl(professor: Professor): Observable<string> {
    return this.professorProfileService.getProfessorImageUrl(professor);
  }
}
