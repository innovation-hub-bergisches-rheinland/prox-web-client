import { Injectable, Injector } from '@angular/core';
import { StudyCourse } from '@prox/shared/hal-resources';
import { RestService } from 'angular4-hal';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectStudyCourseService extends RestService<StudyCourse> {
  constructor(injector: Injector) {
    super(StudyCourse, 'projectStudyCourses', injector);
  }

  getAllSorted(): Observable<StudyCourse[]> {
    let options: any = { notPaged: true, params: [{ key: 'sort', value: 'name,asc' }] };
    return this.getAll(options);
  }
}
