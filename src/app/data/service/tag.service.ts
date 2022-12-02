import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@env';
import { SynchronizeTagsRequest, SynchronizeTagsResponse, Tag } from '@data/schema/tag.types';

@Injectable({
  providedIn: 'root'
})
export class TagService {
  private basePath = environment.apiUrl;

  constructor(protected httpClient: HttpClient) {}

  findMatching(query: string): Observable<Tag[]> {
    const params = new HttpParams();
    params.set('q', query);
    return this.httpClient.get<Tag[]>(`${this.basePath}/tags`, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      params,
      observe: 'body',
      reportProgress: false
    });
  }

  getRecommendations(input: string[]): Observable<Tag[]> {
    const params = new HttpParams();
    params.set('tags', input.join(','));
    return this.httpClient.get<Tag[]>(`${this.basePath}/tags/recommendations`, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      params,
      observe: 'body',
      reportProgress: false
    });
  }

  getPopular(): Observable<Tag[]> {
    return this.httpClient.get<Tag[]>(`${this.basePath}/tags/popular`, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      observe: 'body',
      reportProgress: false
    });
  }

  synchronize(tags: string[]): Observable<SynchronizeTagsResponse> {
    return this.httpClient.post<SynchronizeTagsRequest>(
      `${this.basePath}/tags/synchronize`,
      {
        tags: tags
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        observe: 'body',
        reportProgress: false
      }
    );
  }
}
