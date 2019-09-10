import { Injectable, Injector } from '@angular/core';
import { StudyCourse } from '@prox/shared/hal-resources';
import { RestService } from 'angular4-hal';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudyCourseService extends RestService<StudyCourse> {
  constructor(injector: Injector) {
    super(StudyCourse, 'studyCourses', injector);
  }

  findByAcademicDegree(academicDegree: string): Observable<StudyCourse[]> {
    let options: any = { params: [{ key: 'academicDegree', value: academicDegree }] };
    return this.search('findByAcademicDegree', options);
  }
}
