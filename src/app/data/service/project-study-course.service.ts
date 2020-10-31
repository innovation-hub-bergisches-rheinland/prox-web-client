import { Injectable, Injector } from '@angular/core';

import { RestService } from 'angular4-hal';
import { Observable } from 'rxjs';

import { StudyCourse } from '@data/schema/study-course.resource';
import { HalCrudRestService } from './base/hal-crud-rest-service';

@Injectable({
  providedIn: 'root'
})
export class ProjectStudyCourseService extends HalCrudRestService<StudyCourse> {
  constructor(injector: Injector) {
    super(StudyCourse, 'projectStudyCourses', injector);
  }
}
