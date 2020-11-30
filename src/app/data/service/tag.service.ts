import { Inject, Injectable, Injector } from '@angular/core';

import { RestService } from 'angular4-hal';
import { Observable } from 'rxjs';

import { Tag } from '@data/schema/tag.resource';
import { HalRestService } from './base/hal-crud-rest-service';
import { map } from 'rxjs/operators';
import { environment } from '@env';
import { TagEntityService } from './openapi/tag-service/tagEntity.service';

@Injectable({
  providedIn: 'root'
})
export class TagService extends HalRestService<Tag> {
  constructor(injector: Injector) {
    super(Tag, 'tags', injector);
  }

  createTag(tag: Tag): Observable<Tag | any> {
    return this.halRestService.create(tag);
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
