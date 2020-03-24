import { CustomResource } from './custom-resource.resource';

export class Module extends CustomResource {
  id: string;
  name: string;
  description: string;
  projectType: string;
}
