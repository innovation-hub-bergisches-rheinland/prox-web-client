import { Module } from './module.resource';
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
  modules: Module[]; //TODO use this
}
