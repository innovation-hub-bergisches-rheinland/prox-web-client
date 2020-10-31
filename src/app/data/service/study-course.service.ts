import { Injectable, Injector } from '@angular/core';

import { RestService } from 'angular4-hal';

import { StudyCourse } from '@data/schema/study-course.resource';
import { HalCrudRestService } from './base/hal-crud-rest-service';

@Injectable({
  providedIn: 'root'
})
export class StudyCourseService extends HalCrudRestService<StudyCourse> {
  constructor(injector: Injector) {
    super(StudyCourse, 'studyCourses', injector);
  }
}
