import { Module } from './module.resource';
import { ModuleType } from './openapi/project-service/moduleType';
import { Tag } from './tag.resource';

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
