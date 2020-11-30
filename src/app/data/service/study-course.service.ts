import { Injectable, Injector } from '@angular/core';

import { HalOptions, RestService } from 'angular4-hal';

import { StudyCourse } from '@data/schema/study-course.resource';
import { HalRestService } from './base/hal-crud-rest-service';
import { Observable } from 'rxjs';
import { PageableOptions } from './base/pageable-options';
import { StudyCourseEntityService } from './openapi/module-service/studyCourseEntity.service';
import { map } from 'rxjs/operators';
import { Module } from '@data/schema/module.resource';

@Injectable({
  providedIn: 'root'
})
export class StudyCourseService extends HalRestService<StudyCourse> {
  constructor(
    injector: Injector,
    private studyCourseEntityService: StudyCourseEntityService
  ) {
    super(StudyCourse, 'studyCourses', injector);
  }

  findModulesOfStudyCourse(id: any): Observable<Module[]> {
    return this.studyCourseEntityService
      .studyCourseModulesUsingGET(id)
      .pipe(map(m => m._embedded.modules as Module[]));
  }

  getAllStudyCourses(pageable: PageableOptions): Observable<StudyCourse[]> {
    return this.studyCourseEntityService
      .findAllStudyCourseUsingGET(pageable.page, pageable.size, pageable.sort)
      .pipe(map(s => s._embedded.studyCourses as StudyCourse[]));
  }

  getStudyCourse(id: any): Observable<StudyCourse> {
    return this.studyCourseEntityService
      .findByIdStudyCourseUsingGET(id)
      .pipe(map(s => s as StudyCourse));
  }
}
