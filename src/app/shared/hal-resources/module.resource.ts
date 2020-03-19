import { CustomResource } from './custom-resource.resource';
import { UUID } from 'angular2-uuid';

export class Module extends CustomResource {
  id: UUID;
  name: string;
  description: string;
  projectType: string;
}
