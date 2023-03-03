import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '@env';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PageRequest } from '@data/schema/shared.types';
import { Lecturer, LecturerList } from '@data/schema/lecturer.types';
import { CreateLecturerProfileRequest } from '@data/schema/user.types';

@Injectable({
  providedIn: 'root'
})
export class LecturerService {
  private basePath = environment.apiUrl;

  constructor(protected httpClient: HttpClient) {}

  getLecturer(id: string): Observable<Lecturer> {
    return this.httpClient.get<Lecturer>(`${this.basePath}/users/${id}`, {
      headers: {
        Accept: 'application/json'
      },
      observe: 'body',
      reportProgress: false
    });
  }

  findLecturersByName(query: string, page: PageRequest = { page: 0, size: 20 }): Observable<LecturerList> {
    const params = new HttpParams().set('q', query).set('page', page.page).set('size', page.size).set('sort', 'displayName,asc');

    return this.httpClient.get<LecturerList>(`${this.basePath}/lecturers/search/findByName`, {
      headers: {
        Accept: 'application/json'
      },
      observe: 'body',
      params,
      reportProgress: false
    });
  }

  updateLecturer(id: string, profile: CreateLecturerProfileRequest): Observable<Lecturer> {
    return this.httpClient.put<Lecturer>(`${this.basePath}/lecturers/${id}`, profile, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      observe: 'body',
      reportProgress: false
    });
  }

  setLecturerTags(id: string, tagIds: string[]): Observable<void> {
    const body = {
      tags: tagIds
    };
    return this.httpClient.post<void>(`${this.basePath}/lecturers/${id}/tags`, body, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      observe: 'body',
      reportProgress: false
    });
  }

  setLecturerAvatar(id: string, avatar: File): Observable<any> {
    const formParams = new FormData();
    formParams.set('image', avatar);
    return this.httpClient.post<any>(`${this.basePath}/lecturers/${id}/avatar`, formParams, {
      headers: {},
      observe: 'body',
      reportProgress: false
    });
  }

  getLecturers(page: PageRequest = { page: 0, size: 20 }): Observable<LecturerList> {
    const params = new HttpParams().set('page', page.page).set('size', page.size).set('sort', 'displayName,asc');

    return this.httpClient.get<LecturerList>(`${this.basePath}/lecturers`, {
      headers: {
        Accept: 'application/json'
      },
      params,
      observe: 'body',
      reportProgress: false
    });
  }

  filterLecturers(text?: string, page: PageRequest = { page: 0, size: 20 }): Observable<LecturerList> {
    let queryParameters = new HttpParams().set('page', page.page).set('size', page.size).set('sort', 'display_name,asc');

    if (text) {
      queryParameters = queryParameters.set('q', text);
    }

    return this.httpClient.get<LecturerList>(`${this.basePath}/lecturers/search/filter`, {
      headers: {
        Accept: 'application/json'
      },
      params: queryParameters,
      observe: 'body',
      reportProgress: false
    });
  }
}
