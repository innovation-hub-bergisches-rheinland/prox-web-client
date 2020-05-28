import { Observable } from 'rxjs';

import { CustomResource } from './custom-resource.resource';
import { Module } from './module.resource';

export class StudyCourse extends CustomResource {
  id: string;
  name: string;
  academicDegree: string;
  modules: Module[];

  getModules(): Observable<Module[]> {
    return this.getRelationArray(Module, 'modules');
  }
}
