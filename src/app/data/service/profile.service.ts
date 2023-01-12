import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '@env';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
  AddOrganizationMembershipRequest,
  CreateLecturerRequest,
  CreateOrganizationRequest,
  Lecturer,
  LecturerList,
  Organization,
  OrganizationList,
  OrganizationMemberList,
  OrganizationMembership,
  OrganizationRole
} from '@data/schema/profile.types';
import { PageRequest } from '@data/schema/shared.types';

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

  setOrganizationLogo(id: string, avatar: File): Observable<void> {
    const formParams = new FormData();
    formParams.set('image', avatar);
    return this.httpClient.post<void>(`${this.basePath}/organizations/${id}/logo`, formParams, {
      headers: {},
      observe: 'body',
      reportProgress: false
    });
  }

  setOrganizationTags(id: string, tagIds: string[]): Observable<void> {
    const body = {
      tags: tagIds
    };
    return this.httpClient.post<void>(`${this.basePath}/organizations/${id}/tags`, body, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      observe: 'body',
      reportProgress: false
    });
  }

  getAllOrganizations(page: PageRequest = { page: 0, size: 20 }): Observable<OrganizationList> {
    const params = new HttpParams().set('page', page.page).set('size', page.size);

    return this.httpClient.get<OrganizationList>(`${this.basePath}/organizations`, {
      headers: {
        Accept: 'application/json'
      },
      observe: 'body',
      params,
      reportProgress: false
    });
  }

  /**
   * @deprecated
   */
  getAllOrganizationsAsArray(): Observable<Organization[]> {
    return this.getAllOrganizations({
      page: 0,
      size: 99999
    }).pipe(map(p => p.content));
  }

  getOrganizationsOfUser(): Observable<Organization[]> {
    // TODO: Temporary solution. Needs a separate endpoint
    return this.getAllOrganizations().pipe(
      map(page => page.content),
      map((orgs: Organization[]) => orgs.filter(o => o._permissions.hasAccess))
    );
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

  findLecturersByName(query: string, page: PageRequest = { page: 0, size: 20 }): Observable<LecturerList> {
    const params = new HttpParams().set('q', query).set('page', page.page).set('size', page.size);

    return this.httpClient.get<LecturerList>(`${this.basePath}/lecturers/search/findByName`, {
      headers: {
        Accept: 'application/json'
      },
      observe: 'body',
      params,
      reportProgress: false
    });
  }

  updateLecturer(id: string, profile: CreateLecturerRequest): Observable<Lecturer> {
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
    const params = new HttpParams().set('page', page.page).set('size', page.size);

    return this.httpClient.get<LecturerList>(`${this.basePath}/lecturers`, {
      headers: {
        Accept: 'application/json'
      },
      params,
      observe: 'body',
      reportProgress: false
    });
  }

  filterLecturers(text?: string, tags?: string[], page: PageRequest = { page: 0, size: 20 }): Observable<LecturerList> {
    let queryParameters = new HttpParams().set('page', page.page).set('size', page.size);
    if (tags && tags.length > 0) {
      queryParameters = queryParameters.set('tags', tags.join(','));
    }
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

  filterOrganizations(text?: string, tags?: string[], page: PageRequest = { page: 0, size: 20 }): Observable<OrganizationList> {
    let queryParameters = new HttpParams().set('page', page.page).set('size', page.size);
    if (tags && tags.length > 0) {
      queryParameters = queryParameters.set('tags', tags.join(','));
    }
    if (text) {
      queryParameters = queryParameters.set('q', text);
    }

    return this.httpClient.get<OrganizationList>(`${this.basePath}/organizations/search/filter`, {
      headers: {
        Accept: 'application/json'
      },
      params: queryParameters,
      observe: 'body',
      reportProgress: false
    });
  }
}
