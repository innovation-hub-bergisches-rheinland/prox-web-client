import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from '@env';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CreateLecturerProfileRequest, CreateUserProfileRequest, UserProfile } from '@data/schema/user.types';
import { Page } from '@data/schema/shared.types';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private basePath = environment.apiUrl;

  constructor(protected httpClient: HttpClient) {}

  getById(id: string): Observable<UserProfile> {
    return this.httpClient.get<UserProfile>(`${this.basePath}/users/${id}`, {
      headers: {
        Accept: 'application/json'
      },
      observe: 'body',
      reportProgress: false
    });
  }

  getCurrentAuthenticated(): Observable<UserProfile> {
    return this.httpClient.get<UserProfile>(`${this.basePath}/user/profile`, {
      headers: {
        Accept: 'application/json'
      },
      observe: 'body',
      reportProgress: false
    });
  }

  search(query: string): Observable<UserProfile[]> {
    const params = new HttpParams().set('q', query);

    return this.httpClient
      .get<Page<UserProfile>>(`${this.basePath}/users/search`, {
        params,
        headers: {
          Accept: 'application/json'
        },
        observe: 'body',
        reportProgress: false
      })
      .pipe(map(page => page.content));
  }

  checkStar(projectId: string): Observable<boolean> {
    return this.httpClient
      .get<unknown>(`${this.basePath}/user/stars/projects/${projectId}`, {
        observe: 'response'
      })
      .pipe(
        map(_r => true),
        catchError(_err => of(false))
      );
  }

  setUserProfile(userProfile: CreateUserProfileRequest): Observable<UserProfile> {
    return this.httpClient.put<UserProfile>(`${this.basePath}/user/profile`, userProfile, {
      observe: 'body',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      reportProgress: false
    });
  }

  setUserAvatar(avatar: File): Observable<void> {
    const formParams = new FormData();
    formParams.set('image', avatar);
    return this.httpClient.post<void>(`${this.basePath}/user/profile/avatar`, formParams, {
      headers: {},
      observe: 'body',
      reportProgress: false
    });
  }

  setUserTags(tagIds: string[]): Observable<void> {
    const body = {
      tags: tagIds
    };
    return this.httpClient.put<void>(`${this.basePath}/user/profile/tags`, body, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      observe: 'body',
      reportProgress: false
    });
  }

  setLecturerProfile(lecturerProfile: CreateLecturerProfileRequest): Observable<UserProfile> {
    return this.httpClient.put<UserProfile>(`${this.basePath}/user/profile/lecturer`, lecturerProfile, {
      observe: 'body',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      reportProgress: false
    });
  }

  star(projectId: string): Observable<unknown> {
    return this.httpClient.put<unknown>(`${this.basePath}/user/stars/projects/${projectId}`, null);
  }

  unStar(projectId: string): Observable<unknown> {
    return this.httpClient.delete<unknown>(`${this.basePath}/user/stars/projects/${projectId}`);
  }
}
