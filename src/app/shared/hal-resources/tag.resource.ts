import { UUID } from 'angular2-uuid';
import { CustomResource } from './custom-resource.resource';

export class Tag extends CustomResource {
  id: UUID;
  tagName: string;
}
