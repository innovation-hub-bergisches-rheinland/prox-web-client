import { Injectable, Injector } from '@angular/core';

import { RestService } from 'angular4-hal';
import { Observable } from 'rxjs';

import { StudyCourse } from '@data/schema/study-course.resource';
import { HalRestService } from './base/hal-crud-rest-service';
import { StudyCourseEntityService } from './openapi/project-service/studyCourseEntity.service';
import { map } from 'rxjs/operators';
import { Module } from '@data/schema/module.resource';

@Injectable({
  providedIn: 'root'
})
export class ProjectStudyCourseService extends HalRestService<StudyCourse> {
  constructor(
    injector: Injector,
    private projectStudyCourseService: StudyCourseEntityService
  ) {
    super(StudyCourse, 'projectStudyCourses', injector);
  }

  findAllModulesOfStudyCourse(id: any): Observable<Module[]> {
    return this.projectStudyCourseService.studyCourseModulesUsingGET(id).pipe(
      map(m =>
        m._embedded.projectModules.map(m2 => {
          const module = new Module();
          return Object.assign(module, m2);
        })
      )
    );
  }

  getAllProjectStudyCourses(): Observable<StudyCourse[]> {
    return this.projectStudyCourseService.findAllStudyCourseUsingGET().pipe(
      map(s =>
        s._embedded.projectStudyCourses.map(s2 => {
          const sc = new StudyCourse();
          return Object.assign(sc, s2);
        })
      )
    );
  }
}
