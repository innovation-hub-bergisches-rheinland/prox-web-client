import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';

import { Tag } from '@data/schema/tag.resource';
import { map } from 'rxjs/operators';
import { TagEntityService } from './openapi/tag-service/tagEntity.service';
import { TagCollectionEntityService } from './openapi/tag-service/tagCollectionEntity.service';
import { TagControllerService } from './openapi/tag-service/tagController.service';

@Injectable({
  providedIn: 'root'
})
export class TagService {
  constructor(
    injector: Injector,
    private tagEntityService: TagEntityService,
    private tagCollectionEntityService: TagCollectionEntityService,
    private tagControllerService: TagControllerService
  ) {}

  createTag(tag: Tag): Observable<Tag | any> {
    return this.tagEntityService
      .saveTagUsingPOST(tag)
      .pipe(map(t => Object.assign(new Tag(), t)));
  }

  findByTagName(
    tagName: string,
    exactMatch: boolean = true
  ): Observable<Tag[]> {
    if (exactMatch) {
      return this.tagEntityService
        .findByTagNameTagNameIgnoreCaseTagUsingGET(tagName)
        .pipe(
          map(t => t._embedded.tags.map(t2 => Object.assign(new Tag(), t2)))
        );
    } else {
      return this.tagEntityService
        .findByTagNameTagNameContainingIgnoreCaseTagUsingGET(tagName)
        .pipe(
          map(t => t._embedded.tags.map(t2 => Object.assign(new Tag(), t2)))
        );
    }
  }

  getRecommendations(tags: Tag[]): Observable<Tag[]> {
    const tagIds = tags.map(tag => tag.id).join(',');
    return this.tagEntityService
      .tagRecommendationsTagUsingGET(tagIds)
      .pipe(map(t => t._embedded.tags.map(t2 => Object.assign(new Tag(), t2))));
  }

  getAllTagsOfProject(id: any): Observable<Tag[]> {
    return this.tagCollectionEntityService
      .tagCollectionTagsUsingGET(id)
      .pipe(map(e => e._embedded.tags.map(e2 => Object.assign(new Tag(), e2))));
  }

  setProjectTags(id: string, tags: Tag[]): Observable<Tag[] | any> {
    return this.tagCollectionEntityService.tagCollectionTagsUsingPUT(
      id,
      tags.map(t => t.id).join('\n')
    );
  }

  getPopularTags(limit: number = 10): Observable<Tag[]> {
    return this.tagControllerService
      .popularTagsUsingGET(limit)
      .pipe(
        map(tagCount =>
          tagCount.sort((a, b) => b.count - a.count).map(tc => tc.tag)
        )
      );
  }
}
