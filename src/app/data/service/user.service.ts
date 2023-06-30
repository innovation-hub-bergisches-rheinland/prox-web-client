import { Injectable } from '@angular/core';
import { EMPTY, Observable, catchError, map, of } from 'rxjs';
import { environment } from '@env';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
  CreateLecturerProfileRequest,
  CreateUserProfileRequest,
  SearchPreferences,
  SearchPreferencesRequest,
  UserProfile
} from '@data/schema/user.types';
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

  getSearchPreferences(): Observable<SearchPreferences> {
    return this.httpClient.get<SearchPreferences>(`${this.basePath}/user/search`).pipe(
      catchError(err => {
        if (err.status === 404) {
          return EMPTY;
        }
        throw err;
      })
    );
  }

  setSearchPreferences(sp: SearchPreferencesRequest): Observable<SearchPreferences> {
    return this.httpClient.put<SearchPreferences>(`${this.basePath}/user/search`, sp, {
      observe: 'body',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      reportProgress: false
    });
  }
}
