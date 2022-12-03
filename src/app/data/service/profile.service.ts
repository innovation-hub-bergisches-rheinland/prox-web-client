import { Injectable } from '@angular/core';
import { Observable, filter, map, observable, of } from 'rxjs';
import { environment } from '@env';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
  AddOrganizationMembershipRequest,
  CreateLecturerRequest,
  CreateOrganizationRequest,
  Lecturer,
  Organization,
  OrganizationMemberList,
  OrganizationMembership,
  OrganizationRole
} from '@data/schema/profile.types';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private basePath = environment.apiUrl;

  constructor(protected httpClient: HttpClient) {}

  createOrganization(org: CreateOrganizationRequest): Observable<Organization> {
    return this.httpClient.post<Organization>(`${this.basePath}/organizations`, org, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      observe: 'body',
      reportProgress: false
    });
  }

  updateOrganization(id: string, org: CreateOrganizationRequest): Observable<Organization> {
    return this.httpClient.put<Organization>(`${this.basePath}/organizations/${id}`, org, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      observe: 'body',
      reportProgress: false
    });
  }

  setOrganizationAvatar(id: string, avatar: File): Observable<void> {
    const formParams = new FormData();
    formParams.set('file', avatar);
    return this.httpClient.post<void>(`${this.basePath}/organizations/${id}/avatar`, formParams, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data'
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

  getOrganizationsOfUser(): Observable<Organization[]> {
    // TODO: Temporary solution. Needs a separate endpoint
    return this.getAllOrganizations().pipe(map((orgs: Organization[]) => orgs.filter(o => o._permissions.hasAccess)));
  }

  getOrganization(id: string): Observable<Organization> {
    return this.httpClient.get<Organization>(`${this.basePath}/organizations/${id}`, {
      headers: {
        Accept: 'application/json'
      },
      observe: 'body',
      reportProgress: false
    });
  }

  createMembership(orgId: string, userId: string, role: OrganizationRole): Observable<OrganizationMembership> {
    const body: AddOrganizationMembershipRequest = {
      member: userId,
      role
    };
    return this.httpClient.post<OrganizationMembership>(`${this.basePath}/organizations/${orgId}/memberships`, body, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      observe: 'body',
      reportProgress: false
    });
  }

  deleteMembership(orgId: string, userId: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.basePath}/organizations/${orgId}/memberships/${userId}`, {
      headers: {
        Accept: 'application/json'
      },
      observe: 'body',
      reportProgress: false
    });
  }

  updateMembership(orgId: string, userId: string, role: OrganizationRole): Observable<OrganizationMembership> {
    const body: AddOrganizationMembershipRequest = {
      member: userId,
      role
    };
    return this.httpClient.put<OrganizationMembership>(`${this.basePath}/organizations/${orgId}/memberships/${userId}`, body, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      observe: 'body',
      reportProgress: false
    });
  }

  getMemberships(id: string): Observable<OrganizationMembership[]> {
    return this.httpClient
      .get<OrganizationMemberList>(`${this.basePath}/organizations/${id}/memberships`, {
        headers: {
          Accept: 'application/json'
        },
        observe: 'body',
        reportProgress: false
      })
      .pipe(map((res: OrganizationMemberList) => res.members));
  }

  getLecturer(id: string): Observable<Lecturer> {
    return this.httpClient.get<Lecturer>(`${this.basePath}/lecturers/${id}`, {
      headers: {
        Accept: 'application/json'
      },
      observe: 'body',
      reportProgress: false
    });
  }

  createLecturer(id: string, profile: CreateLecturerRequest): Observable<Lecturer> {
    return this.httpClient.post<Lecturer>(`${this.basePath}/lecturers`, profile, {
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
    formParams.set('file', avatar);
    return this.httpClient.post<any>(`${this.basePath}/lecturers/${id}/avatar`, formParams, {
      headers: {},
      observe: 'body',
      reportProgress: false
    });
  }

  getLecturers(): Observable<Lecturer[]> {
    return this.httpClient.get<Lecturer[]>(`${this.basePath}/lecturers`, {
      headers: {
        Accept: 'application/json'
      },
      observe: 'body',
      reportProgress: false
    });
  }
}
