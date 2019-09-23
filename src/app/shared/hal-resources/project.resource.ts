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
  modules: Module[] = [];

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
    //this.setRelationArray('tagCollection', tags).subscribe(console.log);
    //this.getRelation(Tag, 'tagCollection').subscribe(console.log);
    //this.getRelation(Tag, 'tagCollection').subscribe(x => x.setRelationArray('tagCollection', tags));
    console.log(tags[0]);
    this.addRelation('tagCollection', tags[0]);
    //console.log(this._links);
    //this.getRelationArray(Tag, 'tagCollection').subscribe(x=> console.log(x));
  }

  getModules(): Observable<Module[]> {
    return this.getRelationArray(Module, 'modules');
  }

  getAndSetTagArray(): Promise<Tag[]> {
    return new Promise<Tag[]>((resolve, reject) => {
      this.getTags().subscribe(
        tmp_tags => (this.tags = tmp_tags),
        () => reject(),
        () => {
          this.getAndSetModuleArray().then();
        }
      );
    });
  }

  getAndSetModuleArray(): Promise<Module[]> {
    return new Promise<Module[]>((resolve, reject) => {
      this.getModules().subscribe(
        temp_modules => (this.modules = temp_modules),
        () => reject(),
        () => {}
      );
    });
  }

  getTags(): Observable<Tag[]> {
    return this.getRelationArray(Tag, 'tags');
  }
}
