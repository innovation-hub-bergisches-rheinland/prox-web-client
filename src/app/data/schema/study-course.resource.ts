import { Module } from './module.resource';

export class StudyCourse {
  id: string;
  name: string;
  academicDegree: string;
  modules: Module[] | Set<Module>; //TODO use this
}
