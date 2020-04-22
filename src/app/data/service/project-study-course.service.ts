import { Injectable, Injector } from '@angular/core';

import { RestService } from 'angular4-hal';
import { Observable } from 'rxjs';

import { StudyCourse } from '@data/schema/study-course.resource';

@Injectable({
  providedIn: 'root'
})
export class ProjectStudyCourseService extends RestService<StudyCourse> {
  constructor(injector: Injector) {
    super(StudyCourse, 'projectStudyCourses', injector);
  }
}
