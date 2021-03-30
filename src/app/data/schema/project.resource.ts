import { Module } from './module.resource';
import { ModuleType } from './openapi/project-service/moduleType';
import { Tag } from './tag.resource';

//TODO Refactor to use interface
export class Project {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  requirement: string;
  status: string;
  creatorID: string;
  creatorName: string;
  supervisorName: string;
  tagCollection: Tag[]; //TODO use this
  modules: ModuleType[]; //TODO use this
}
