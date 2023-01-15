import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from '@env';
import { HttpClient, HttpParams } from '@angular/common/http';
import { RoleSearch, User, UserProfile } from '@data/schema/user.types';

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

  search(query: string, role?: RoleSearch): Observable<User[]> {
    let params = new HttpParams().set('q', query);
    if (role) {
      params = params.set('role', role);
    }

    return this.httpClient.get<User[]>(`${this.basePath}/users/search`, {
      params,
      headers: {
        Accept: 'application/json'
      },
      observe: 'body',
      reportProgress: false
    });
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

  star(projectId: string): Observable<unknown> {
    return this.httpClient.put<unknown>(`${this.basePath}/user/stars/projects/${projectId}`, null);
  }

  unStar(projectId: string): Observable<unknown> {
    return this.httpClient.delete<unknown>(`${this.basePath}/user/stars/projects/${projectId}`);
  }
}
