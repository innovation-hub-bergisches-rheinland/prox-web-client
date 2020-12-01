import { Injectable, Injector } from '@angular/core';

import { Observable } from 'rxjs';

import { StudyCourse } from '@data/schema/study-course.resource';
import { StudyCourseEntityService } from './openapi/project-service/studyCourseEntity.service';
import { map } from 'rxjs/operators';
import { Module } from '@data/schema/module.resource';
import { ModuleEntityService } from './openapi/project-service/moduleEntity.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectModuleService {
  constructor(
    injector: Injector,
    private projectModuleEntityService: ModuleEntityService
  ) {}

  findStudyCourseOfModule(id: any): Observable<StudyCourse> {
    return this.projectModuleEntityService
      .moduleStudyCourseUsingGET(id)
      .pipe(map(s => Object.assign(new StudyCourse(), s)));
  }
}
