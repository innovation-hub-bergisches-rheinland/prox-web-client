import { Injectable, Injector } from '@angular/core';

import { Observable } from 'rxjs';

import { StudyCourse } from '@data/schema/study-course.resource';
import { StudyCourseEntityService } from './openapi/project-service/studyCourseEntity.service';
import { map } from 'rxjs/operators';
import { Module } from '@data/schema/module.resource';
import { ModuleEntityService } from './openapi/project-service/moduleEntity.service';
import { ProfessorControllerService } from './openapi/professor-profile-service/professorController.service';
import { Professor } from '@data/schema/openapi/professor-profile-service/models';

@Injectable({
  providedIn: 'root'
})
export class ProfessorProfileService {
  constructor(
    injector: Injector,
    private professorControllerService: ProfessorControllerService
  ) {}

  saveProfessorProfile(professor: Professor): Observable<Professor | any> {
    return this.professorControllerService.saveProfessorUsingPOST(professor);
  }
}
