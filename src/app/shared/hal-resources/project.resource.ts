import { UUID } from 'angular2-uuid';
import { Observable } from 'rxjs';
import { CustomResource } from './custom-resource';
import { Module } from './module.resource';
import { Tag } from './tag.resource';

export class Project extends CustomResource {
  id: UUID;
  name: string;
  shortDescription: string;
  description: string;
  status: string;
  creatorID: UUID;
  creatorName: string;
  supervisorName: string;
  requirement: string;
  tags: Tag[] = [];

  setModules(newModules: Module[]): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.setRelationArray('modules', newModules).subscribe(
        () => {},
        error => reject(error),
        () => resolve()
      );
    });
  }

  setTags(tags: Tag[]) {
    this.setRelationArray('tags', tags).subscribe(console.log);
  }

  getModules(): Observable<Module[]> {
    return this.getRelationArray(Module, 'modules');
  }

  getAndSetTagArray(): Promise<Tag[]> {
    return new Promise<Tag[]>((resolve, reject) => {
      this.getTags().subscribe(tmp_tags => (this.tags = tmp_tags), () => reject(), () => {});
    });
  }

  getTags(): Observable<Tag[]> {
    return this.getRelationArray(Tag, 'tags');
  }
}
