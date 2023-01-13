import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from '@env';
import { HttpClient, HttpParams } from '@angular/common/http';
import { User } from '@data/schema/user.types';
import { faL } from '@fortawesome/free-solid-svg-icons';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private basePath = environment.apiUrl;

  constructor(protected httpClient: HttpClient) {}

  search(query: string): Observable<User[]> {
    return this.httpClient.get<User[]>(`${this.basePath}/users/search`, {
      params: new HttpParams().set('q', query),
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
