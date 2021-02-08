import { Component, Input, OnInit } from '@angular/core';
import {
  Faculty,
  Professor
} from '@data/schema/openapi/professor-profile-service/models';
import { ProfessorProfileService } from '@data/service/professor-profile.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-professors-item',
  templateUrl: './professors-item.component.html',
  styleUrls: ['./professors-item.component.scss']
})
export class ProfessorsItemComponent implements OnInit {
  _professor: Professor;
  faculty: Faculty;

  @Input()
  set professor(professor: Professor) {
    this._professor = professor;
  }

  get professor(): Professor {
    return this._professor;
  }

  constructor(private professorProfileService: ProfessorProfileService) {}

  ngOnInit(): void {
    this.professorProfileService
      .getProfessorFaculty(this.professor.id)
      .subscribe(
        res => (this.faculty = res),
        err => console.error(err)
      );
  }

  getProfessorUrl(professor: Professor): Observable<string> {
    return this.professorProfileService.getProfessorImageUrl(professor);
  }
}
