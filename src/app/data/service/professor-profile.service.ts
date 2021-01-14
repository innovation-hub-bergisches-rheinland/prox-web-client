import { Injectable, Injector } from '@angular/core';

import { Observable, of } from 'rxjs';

import { StudyCourse } from '@data/schema/study-course.resource';
import { StudyCourseEntityService } from './openapi/project-service/studyCourseEntity.service';
import { map, tap } from 'rxjs/operators';
import { Module } from '@data/schema/module.resource';
import { ModuleEntityService } from './openapi/project-service/moduleEntity.service';
import { ProfessorControllerService } from './openapi/professor-profile-service/professorController.service';
import {
  Faculty,
  Professor
} from '@data/schema/openapi/professor-profile-service/models';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { environment } from '@env';
import { FacultyControllerService } from './openapi/professor-profile-service/facultyController.service';

@Injectable({
  providedIn: 'root'
})
export class ProfessorProfileService {
  constructor(
    injector: Injector,
    private professorControllerService: ProfessorControllerService,
    private facultyControllerService: FacultyControllerService,
    private httpClient: HttpClient
  ) {}

  getProfessorProfile(id: any): Observable<Professor> {
    return this.professorControllerService.getProfessor(id);
  }

  saveProfessorProfile(professor: Professor): Observable<Professor | any> {
    return this.professorControllerService.saveProfessor(professor);
  }

  updateProfessorProfile(professor: Professor): Observable<Professor | any> {
    return this.professorControllerService.updateProfessor(
      professor.id,
      professor
    );
  }

  getProfessorImageUrl(professor: Professor): Observable<string> {
    return of(`${environment.apiUrl}/professors/${professor.id}/image`); //TODO Hardcoded - this might be refactored
  }

  getProfessorFaculty(id: any): Observable<Faculty> {
    return this.professorControllerService
      .getFaculty(id)
      .pipe(map(em => <Faculty>em));
  }

  getAllFaculties(): Observable<Faculty[]> {
    return this.facultyControllerService.getAllFaculties({}).pipe(
      map(f => {
        console.log(f._embedded.facultyList);
        const facs = <Faculty[]>f._embedded.facultyList;
        console.log(facs);
        return facs;
      })
    );
  }

  saveProfessorFaculty(id: any, faculty: Faculty): Observable<Faculty> {
    return this.professorControllerService
      .saveFaculty(id, faculty.id)
      .pipe(map(f => <Faculty>f));
  }

  saveProfessorImage(id: any, image: Blob): Observable<any> {
    return this.professorControllerService.postProfessorImage(id, image);
  }
}
