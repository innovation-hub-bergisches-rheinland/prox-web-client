import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@env';
import { SynchronizeTagsResponse, Tag } from '@data/schema/tag.types';
import { Page, PageRequest } from '@data/schema/shared.types';

@Injectable({
  providedIn: 'root'
})
export class TagService {
  private basePath = environment.apiUrl;

  constructor(protected httpClient: HttpClient) {}

  findTags(query?: string, pagination?: PageRequest): Observable<Tag[]> {
    return this.findTagsPage(query, pagination).pipe(map(page => page.content));
  }

  findTagsPage(query?: string, pagination?: PageRequest): Observable<Page<Tag>> {
    let params = new HttpParams();
    if (query) {
      params = params.set('q', query);
    }
    if (pagination?.size) {
      params = params.set('size', pagination.size);
    }
    if (pagination?.page) {
      params = params.set('page', pagination.page);
    }
    if (pagination?.sort) {
      params = params.set('sort', pagination.sort);
    }
    return this.httpClient.get<Page<Tag>>(`${this.basePath}/tags`, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      params: params,
      observe: 'body',
      reportProgress: false
    });
  }

  getRecommendations(input: string[]): Observable<Tag[]> {
    const params = new HttpParams().set('tags', input.join(','));
    return this.httpClient
      .get<Page<Tag>>(`${this.basePath}/tags/recommendations`, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        params,
        observe: 'body',
        reportProgress: false
      })
      .pipe(map(page => page.content));
  }

  getPopular(): Observable<Tag[]> {
    return this.httpClient
      .get<Page<Tag>>(`${this.basePath}/tags/popular`, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        observe: 'body',
        reportProgress: false
      })
      .pipe(map(page => page.content));
  }

  synchronize(tags: string[]): Observable<SynchronizeTagsResponse> {
    return this.httpClient.post<SynchronizeTagsResponse>(
      `${this.basePath}/tags/synchronization`,
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

  merge(source: string, target: string): Observable<Tag[]> {
    return this.httpClient.post<Tag[]>(`${this.basePath}/tags/${source}/merge`, {
      mergeInto: target
    });
  }

  updateAliases(tag: string, aliases: string[]): Observable<Tag[]> {
    return this.httpClient.put<Tag[]>(`${this.basePath}/tags/${tag}/aliases`, {
      aliases
    });
  }

  slugify(str: string): string {
    return str
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }
}
