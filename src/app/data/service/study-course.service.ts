import { Injectable, Injector } from '@angular/core';

import { RestService } from 'angular4-hal';

import { StudyCourse } from '@data/schema/study-course.resource';
import { HalRestService } from './base/hal-crud-rest-service';

@Injectable({
  providedIn: 'root'
})
export class StudyCourseService extends HalRestService<StudyCourse> {
  constructor(injector: Injector) {
    super(StudyCourse, 'studyCourses', injector);
  }
}
