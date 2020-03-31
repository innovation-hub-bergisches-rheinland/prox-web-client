import { Observable } from 'rxjs';
import { CustomResource } from './custom-resource.resource';
import { Module } from './module.resource';
import { map } from 'rxjs/operators';

export class StudyCourse extends CustomResource {
  id: string;
  name: string;
  academicDegree: string;
  modules: Module[];

  getStudyDirections(): Observable<StudyCourse[]> {
    return this.getRelationArray(StudyCourse, 'studyDirections');
  }

  getModules(): Observable<Module[]> {
    return this.getRelationArray(Module, 'modules');
  }

  getParentStudyCourse(): Observable<StudyCourse> {
    return this.getRelation(StudyCourse, 'parentStudyCourse');
  }
}
