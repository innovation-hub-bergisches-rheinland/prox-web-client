import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@env';
import { HttpClient } from '@angular/common/http';
import { Project } from '@data/schema/project-service.types';
import { CreateOrganizationSchema, Organization } from '@data/schema/user-service.types';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private basePath = environment.apiUrl;

  constructor(protected httpClient: HttpClient) {}

  createOrganization(org: CreateOrganizationSchema): Observable<Organization> {
    return this.httpClient.post<Organization>(`${this.basePath}/organizations`, org, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      observe: 'body',
      reportProgress: false
    });
  }

  getAllOrganizations(): Observable<Organization[]> {
    return this.httpClient.get<Organization[]>(`${this.basePath}/organizations`, {
      headers: {
        Accept: 'application/json'
      },
      observe: 'body',
      reportProgress: false
    });
  }
}
