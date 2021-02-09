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
  PagedModelEntityModelProfessor,
  Professor
} from '@data/schema/openapi/professor-profile-service/models';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { environment } from '@env';
import { FacultyControllerService } from './openapi/professor-profile-service/facultyController.service';
import { ProfessorSearchControllerService } from './openapi/professor-profile-service/professorSearchController.service';

@Injectable({
  providedIn: 'root'
})
export class ProfessorProfileService {
  constructor(
    injector: Injector,
    private professorControllerService: ProfessorControllerService,
    private facultyControllerService: FacultyControllerService,
    private professorSearchControllerService: ProfessorSearchControllerService,
    private httpClient: HttpClient
  ) {}

  getProfessorProfile(id: string): Observable<Professor> {
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

  getAllProfessors(
    page?: number,
    size?: number,
    sort: string[] = ['name']
  ): Observable<PagedModelEntityModelProfessor> {
    return this.professorControllerService.getAllProfessors(sort, page, size);
  }

  getProfessorFaculty(id: string): Observable<Faculty> {
    return this.professorControllerService
      .getFaculty(id)
      .pipe(map(em => <Faculty>em));
  }

  getAllFaculties(sort: string[] = []): Observable<Faculty[]> {
    return this.facultyControllerService.getAllFaculties(sort).pipe(
      map(f => {
        const facs = <Faculty[]>f._embedded.facultyList;
        return facs;
      })
    );
  }

  saveProfessorFaculty(id: string, faculty: Faculty): Observable<Faculty> {
    return this.professorControllerService
      .saveFaculty(id, faculty.id)
      .pipe(map(f => <Faculty>f));
  }

  saveProfessorImage(id: string, image: Blob): Observable<any> {
    return this.professorControllerService.postProfessorImage(id, image);
  }

  deleteImage(id: string): Observable<any> {
    return this.professorControllerService.deleteProfessorImage(id);
  }

  getProfessorsByFaculty(
    id: string,
    page?: number,
    size?: number,
    sort: string[] = ['name']
  ): Observable<PagedModelEntityModelProfessor> {
    return this.professorSearchControllerService.findProfessorsByFacultyId(
      id,
      sort,
      page,
      size
    );
  }

  getProfessorsByName(
    name: string,
    page?: number,
    size?: number,
    sort: string[] = ['name']
  ): Observable<PagedModelEntityModelProfessor> {
    return this.professorSearchControllerService.findProfessorsByName(
      name,
      sort,
      page,
      size
    );
  }

  getProfessorsByFacultyIdAndName(
    id: string,
    name: string,
    page?: number,
    size?: number,
    sort: string[] = ['name']
  ): Observable<PagedModelEntityModelProfessor> {
    return this.professorSearchControllerService.findProfessorsByFacultyIdAndName(
      id,
      name,
      sort,
      page,
      size
    );
  }
}
