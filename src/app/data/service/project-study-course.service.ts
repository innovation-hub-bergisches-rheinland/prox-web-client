import { Injectable, Injector } from '@angular/core';

import { Observable } from 'rxjs';

import { StudyCourse } from '@data/schema/study-course.resource';
import { StudyCourseEntityService } from './openapi/project-service/studyCourseEntity.service';
import { map } from 'rxjs/operators';
import { Module } from '@data/schema/module.resource';

@Injectable({
  providedIn: 'root'
})
export class ProjectStudyCourseService {
  constructor(
    injector: Injector,
    private projectStudyCourseService: StudyCourseEntityService
  ) {}

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
