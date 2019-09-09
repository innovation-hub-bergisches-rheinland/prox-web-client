import { UUID } from 'angular2-uuid';
import { Module } from './module.resource';
import { Observable } from 'rxjs';
import { CustomResource } from './custom-resource';
import { Tag } from './tag.resource';

export class Project extends CustomResource {
  id: UUID;
  name: string;
  shortDescription: string =
    'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor';
  description: string;
  status: string;
  creatorID: UUID;
  creatorName: string;
  supervisorName: string;
  requirement: string;
  tags: Tag[] = [
    { id: 1, name: 'Tag 01' },
    { id: 2, name: 'Tag 02' },
    { id: 3, name: 'Tag 03' },
    { id: 4, name: 'Tag 04' },
    { id: 5, name: 'Tag 05' },
    { id: 6, name: 'Tag 06' },
    { id: 7, name: 'Tag 07' },
    { id: 8, name: 'Tag 08' },
    { id: 9, name: 'Tag 09' },
    { id: 10, name: 'Tag 10' }
  ];

  setModules(newModules: Module[]): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.setRelationArray('modules', newModules).subscribe(
        () => {},
        error => reject(error),
        () => resolve()
      );
    });
  }

  getModules(): Observable<Module[]> {
    return this.getRelationArray(Module, 'modules');
  }

  getMockedTags(): Tag[] {
    return this.tags;
  }
}
