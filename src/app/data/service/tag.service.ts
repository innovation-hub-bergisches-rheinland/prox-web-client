import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';
import { Tag, TagPopularity, TagRecommendation, Tags } from '@data/schema/tag-service.types';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@env';

@Injectable({
  providedIn: 'root'
})
export class TagService {
  private basePath = environment.apiUrl;

  constructor(protected httpClient: HttpClient) {}

  setTagsForEntity(id: string, tags: Tag[]): Observable<Tag[] | any> {
    return this.httpClient
      .put<Tags>(
        `${this.basePath}/tags/${id}`,
        {
          tags
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          },
          observe: 'body',
          reportProgress: false
        }
      )
      .pipe(map(res => res.tags));
  }

  findByTagName(tagName: string): Observable<Tag[]> {
    const queryParameters = new HttpParams().set('q', tagName);

    return this.httpClient
      .get<Tags>(`${this.basePath}/tags/search`, {
        params: queryParameters,
        headers: {
          Accept: 'application/json'
        },
        observe: 'body'
      })
      .pipe(map(res => res.tags));
  }

  getRecommendations(tags: Tag[]): Observable<Tag[]> {
    const queryParameters = new HttpParams().set('tags', tags.join(','));
    return this.httpClient
      .get<TagRecommendation>(`${this.basePath}/tags/recommendations`, {
        params: queryParameters,
        headers: {
          Accept: 'application/json'
        },
        observe: 'body'
      })
      .pipe(map(res => res.recommendations));
  }

  getTagsForEntity(id: string): Observable<Tag[]> {
    return this.httpClient
      .get<Tags>(`${this.basePath}/tags/${id}`, {
        headers: {
          Accept: 'application/json'
        },
        observe: 'body'
      })
      .pipe(map(res => res.tags));
  }

  getPopularTags(limit = 10): Observable<Tag[]> {
    return this.httpClient
      .get<TagPopularity>(`${this.basePath}/tags/popular`, {
        headers: {
          Accept: 'application/json'
        },
        observe: 'body'
      })
      .pipe(
        map(res =>
          Object.entries(res.popularity)
            .sort(([, popularityA], [, popularityB]) => popularityB - popularityA)
            .map(([tag]) => tag)
        )
      );
  }
}
