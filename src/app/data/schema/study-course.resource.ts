import { Module } from './module.resource';

//TODO Refactor to use interface
export class StudyCourse {
  id: string;
  name: string;
  academicDegree: string;
  modules: Module[] | Set<Module>; //TODO use this
}
