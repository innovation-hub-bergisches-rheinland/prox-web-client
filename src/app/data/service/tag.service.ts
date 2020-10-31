import { Injectable, Injector } from '@angular/core';

import { RestService } from 'angular4-hal';
import { Observable } from 'rxjs';

import { Tag } from '@data/schema/tag.resource';
import { HalRestService } from './base/hal-crud-rest-service';

@Injectable({
  providedIn: 'root'
})
export class TagService extends HalRestService<Tag> {
  constructor(injector: Injector) {
    super(Tag, 'tags', injector);
  }

  findByTagName(
    tagName: string,
    exactMatch: boolean = true
  ): Observable<Tag[]> {
    const options = { params: [{ key: 'tagName', value: tagName }] };
    if (exactMatch) {
      return this.search('findByTagName', options);
    } else {
      return this.search('findByTagNameContaining', options);
    }
  }

  getRecommendations(tags: Tag[]): Observable<Tag[]> {
    const tagIds = tags.map(tag => tag.id).join(',');
    const options = { params: [{ key: 'tagIds', value: tagIds }] };
    return this.search('tagRecommendations', options);
  }
}
