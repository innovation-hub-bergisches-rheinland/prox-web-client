import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';

import { Tag } from '@data/schema/tag.resource';
import { HalRestService } from './base/hal-crud-rest-service';
import { map, tap } from 'rxjs/operators';
import { TagEntityService } from './openapi/tag-service/tagEntity.service';

@Injectable({
  providedIn: 'root'
})
export class TagService extends HalRestService<Tag> {
  constructor(injector: Injector, private tagEntityService: TagEntityService) {
    super(Tag, 'tags', injector);
  }

  createTag(tag: Tag): Observable<Tag | any> {
    return this.tagEntityService.saveTagUsingPOST(tag).pipe(map(t => t as Tag));
  }

  findByTagName(
    tagName: string,
    exactMatch: boolean = true
  ): Observable<Tag[]> {
    if (exactMatch) {
      return this.tagEntityService
        .findByTagNameTagNameIgnoreCaseTagUsingGET(tagName)
        .pipe(map(t => t._embedded.tags as Tag[]));
    } else {
      return this.tagEntityService
        .findByTagNameTagNameContainingIgnoreCaseTagUsingGET(tagName)
        .pipe(map(t => t._embedded.tags as Tag[]));
    }
  }

  getRecommendations(tags: Tag[]): Observable<Tag[]> {
    const tagIds = tags.map(tag => tag.id).join(',');
    return this.tagEntityService.tagRecommendationsTagUsingGET(tagIds).pipe(
      map(t => t._embedded.tags as Tag[]),
      tap(t => console.log(t))
    );
  }
}
