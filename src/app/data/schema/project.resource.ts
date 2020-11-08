import { Observable } from 'rxjs';

import { CustomResource } from './custom-resource.resource';
import { Module } from './module.resource';
import { Tag } from './tag.resource';

export class Project extends CustomResource {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  requirement: string;
  status: string;
  creatorID: string;
  creatorName: string;
  supervisorName: string;
  tagCollection: Tag[];
  modules: Module[];
}
