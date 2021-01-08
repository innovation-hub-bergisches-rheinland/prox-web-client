import { Injectable, Injector } from '@angular/core';

import { Observable, of } from 'rxjs';

import { StudyCourse } from '@data/schema/study-course.resource';
import { StudyCourseEntityService } from './openapi/project-service/studyCourseEntity.service';
import { map } from 'rxjs/operators';
import { Module } from '@data/schema/module.resource';
import { ModuleEntityService } from './openapi/project-service/moduleEntity.service';
import { ProfessorControllerService } from './openapi/professor-profile-service/professorController.service';
import {
  Faculty,
  Professor
} from '@data/schema/openapi/professor-profile-service/models';
import { HttpResponse } from '@angular/common/http';
import { environment } from '@env';
import { FacultyControllerService } from './openapi/professor-profile-service/facultyController.service';

@Injectable({
  providedIn: 'root'
})
export class ProfessorProfileService {
  constructor(
    injector: Injector,
    private professorControllerService: ProfessorControllerService,
    private facultyControllerService: FacultyControllerService
  ) {}

  getProfessorProfile(id: any): Observable<Professor> {
    return this.professorControllerService.getProfessorUsingGET(id);
  }

  saveProfessorProfile(professor: Professor): Observable<Professor | any> {
    return this.professorControllerService.saveProfessorUsingPOST(professor);
  }

  getProfessorImageUrl(professor: Professor): Observable<string> {
    return of(`${environment.apiUrl}/professors/${professor.id}/image`); //TODO Hardcoded - this might be refactored
    //return this.professorControllerService.getProfessorImageUsingGET(professor.id, 'response').pipe(map(r => r.url))
  }

  getProfessorFaculty(id: any): Observable<Faculty> {
    return this.professorControllerService.getFacultyUsingGET1(id);
  }

  getAllFaculties(): Observable<Faculty[]> {
    return this.facultyControllerService
      .getALlFacultiesUsingGET()
      .pipe(map(f => f._embedded['facultyList']));
  }

  saveProfessorFaculty(id: any, faculty: Faculty): Observable<Faculty> {
    return this.professorControllerService.saveFacultyUsingPUT(id, faculty.id);
  }
}
