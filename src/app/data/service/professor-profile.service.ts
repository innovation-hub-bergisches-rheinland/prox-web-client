import { Injectable, Injector } from '@angular/core';

import { Observable, of } from 'rxjs';

import { map, tap } from 'rxjs/operators';
import {
  EntityModelFaculty,
  EntityModelProfessor,
  EntityModelProfessorOverviewDto,
  PagedModelEntityModelProfessor,
  Professor
} from '@data/schema/openapi/professor-profile-service/models';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env';
import { FacultyAPIService, ProfessorAPIService } from './openapi/professor-profile-service/api';

@Injectable({
  providedIn: 'root'
})
export class ProfessorProfileService {
  constructor(
    injector: Injector,
    private professorApiService: ProfessorAPIService,
    private facultyApiService: FacultyAPIService,
    private httpClient: HttpClient
  ) {}

  getProfessorProfile(id: string): Observable<Professor> {
    return this.professorApiService.getProfessor(id, 'body', false, {
      httpHeaderAccept: 'application/hal+json'
    });
  }

  saveProfessorProfile(professor: Professor): Observable<Professor | any> {
    return this.professorApiService.saveProfessor(professor, 'body', false, {
      httpHeaderAccept: 'application/hal+json'
    });
  }

  updateProfessorProfile(professor: Professor): Observable<Professor | any> {
    return this.professorApiService.updateProfessor(professor.id, professor, 'body', false, {
      httpHeaderAccept: 'application/hal+json'
    });
  }

  getProfessorImageUrl(id: string): string {
    return `${environment.apiUrl}/professors/${id}/image`; //TODO Hardcoded - this might be refactored
  }

  getAllProfessors(page?: number, size?: number, sort: string[] = ['name']): Observable<PagedModelEntityModelProfessor> {
    return this.professorApiService.getAllProfessors(sort, page, size, 'body', false, {
      httpHeaderAccept: 'application/hal+json'
    });
  }

  getProfessorFaculty(id: string): Observable<EntityModelFaculty> {
    return this.professorApiService.getFaculty(id, 'body', false, {
      httpHeaderAccept: 'application/hal+json'
    });
  }

  getAllFaculties(sort: Set<string> = new Set()): Observable<EntityModelFaculty[]> {
    return this.facultyApiService
      .getAllFaculties(sort, 'body', false, {
        httpHeaderAccept: 'application/hal+json'
      })
      .pipe(map(f => f._embedded.facultyList));
  }

  saveProfessorFaculty(id: string, facultyId: string): Observable<EntityModelFaculty> {
    return this.professorApiService.saveFaculty(id, facultyId, 'body', false, {
      httpHeaderAccept: 'application/hal+json'
    });
  }

  saveProfessorImage(id: string, image: Blob): Observable<any> {
    return this.professorApiService.postProfessorImage(id, image);
  }

  deleteImage(id: string): Observable<any> {
    return this.professorApiService.deleteProfessorImage(id);
  }

  getProfessorOverview(): Observable<EntityModelProfessorOverviewDto[]> {
    return this.professorApiService
      .getProfessorOverview('body', false, {
        httpHeaderAccept: 'application/hal+json'
      })
      .pipe(map(p => p._embedded.professorOverviewDtoList));
  }

  findProfessorWithNameLike(names: string[]): Observable<{ [key: string]: string }> {
    return this.professorApiService.findProfessorWithNameLike(names, 'body', false, {
      httpHeaderAccept: 'application/json'
    });
  }
}
