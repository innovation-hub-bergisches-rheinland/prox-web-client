import { Injectable, Injector } from '@angular/core';
import { Tag } from '@prox/shared/hal-resources';
import { RestService } from 'angular4-hal';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TagService extends RestService<Tag> {
  constructor(injector: Injector) {
    super(Tag, 'tags', injector);
  }

  findByTagName(tagName: string): Observable<Tag[]> {
    let options = { params: [{ key: 'tagName', value: tagName }] };
    return this.search('findByTagName', options);
  }
}
