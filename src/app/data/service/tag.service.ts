import { Inject, Injectable, Injector } from '@angular/core';

import { RestService } from 'angular4-hal';
import { Observable } from 'rxjs';

import { Tag } from '@data/schema/tag.resource';
import { HalRestService } from './base/hal-crud-rest-service';
import { TagServiceService } from './openapi/api';
import { map } from 'rxjs/operators';
import { environment } from '@env';

@Injectable({
  providedIn: 'root'
})
export class TagService {
  constructor(
    private injector: Injector,
    private tagservice: TagServiceService
  ) {
    //super(Tag, 'tags', injector);
  }

  findByTagName(
    tagName: string,
    exactMatch: boolean = true
  ): Observable<Tag[]> {
    //const options = { params: [{ key: 'tagName', value: tagName }] };
    if (exactMatch) {
      //this.tagservice.find
      //return this.search('findByTagName', options);
      return this.tagservice
        .findByTagNameTagNameIgnoreCaseTagUsingGET(tagName)
        .pipe(map(tags => tags._embedded.tags.map(tag => tag as Tag)));
    } else {
      return this.tagservice
        .findByTagNameTagNameContainingIgnoreCaseTagUsingGET(tagName)
        .pipe(map(tags => tags._embedded.tags.map(tag => tag as Tag)));
      //return this.search('findByTagNameContaining', options);
    }
  }

  getRecommendations(tags: Tag[]): Observable<Tag[]> {
    const tagIds = tags.map(tag => tag.id).join(',');
    const options = { params: [{ key: 'tagIds', value: tagIds }] };

    return this.tagservice
      .tagRecommendationsTagUsingGET(tagIds)
      .pipe(
        map(tagRecommendations =>
          tagRecommendations._embedded.tags.map(tag => tag as Tag)
        )
      );

    //return this.search('tagRecommendations', options);
  }

  createTag(tag: Tag): Observable<Tag | any> {
    return this.tagservice.saveTagUsingPOST(tag);
    //return this.create(tag);
  }
}
