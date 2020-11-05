import { Injectable, Injector } from '@angular/core';

import { HalOptions, RestService } from 'angular4-hal';

import { StudyCourse } from '@data/schema/study-course.resource';
import { HalRestService } from './base/hal-crud-rest-service';
import { Observable } from 'rxjs';
import { PageableOptions } from './base/pageable-options';

@Injectable({
  providedIn: 'root'
})
export class StudyCourseService extends HalRestService<StudyCourse> {
  constructor(injector: Injector) {
    super(StudyCourse, 'studyCourses', injector);
  }

  getAllStudyCourses(options?: PageableOptions): Observable<StudyCourse[]> {
    return this.getAll(options);
  }

  getStudyCourse(id: any): Observable<StudyCourse> {
    return this.get(id);
  }
}
