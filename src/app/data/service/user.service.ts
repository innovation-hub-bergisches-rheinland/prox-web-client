import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@env';
import { HttpClient, HttpParams } from '@angular/common/http';
import { User } from '@data/schema/user.types';

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
}
