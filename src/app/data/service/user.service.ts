import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '@env';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
  CreateOrganizationMembership,
  CreateOrganizationSchema,
  CreateUserProfileSchema,
  Organization,
  OrganizationMembership,
  OrganizationMembershipWrapper,
  OrganizationRole,
  UpdateOrganizationMembership,
  UserProfile,
  UserProfileBriefCollection,
  UserSearchResult
} from '@data/schema/user-service.types';

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

  updateOrganization(id: string, org: CreateOrganizationSchema): Observable<Organization> {
    return this.httpClient.put<Organization>(`${this.basePath}/organizations/${id}`, org, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      observe: 'body',
      reportProgress: false
    });
  }

  setOrganizationAvatar(id: string, avatar: File): Observable<any> {
    const formParams = new FormData();
    formParams.set('file', avatar);
    return this.httpClient.post<any>(`${this.basePath}/organizations/${id}/avatar`, formParams, {
      headers: {
        Accept: 'application/json'
      },
      observe: 'body',
      reportProgress: false
    });
  }

  getOrganizationAvatar(id: string): Observable<string> {
    return of(`${this.basePath}/organizations/${id}/avatar`);
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

  getOrganizationsOfAuthenticatedUser(): Observable<Organization[]> {
    return this.httpClient.get<Organization[]>(`${this.basePath}/user/organizations`, {
      headers: {
        Accept: 'application/json'
      },
      observe: 'body',
      reportProgress: false
    });
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
    const body: CreateOrganizationMembership = {
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

  deleteMembership(orgId: string, userId: string): Observable<any> {
    return this.httpClient.delete<any>(`${this.basePath}/organizations/${orgId}/memberships/${userId}`, {
      headers: {
        Accept: 'application/json'
      },
      observe: 'body',
      reportProgress: false
    });
  }

  updateMembership(orgId: string, userId: string, body: UpdateOrganizationMembership): Observable<any> {
    return this.httpClient.put<OrganizationMembership>(`${this.basePath}/organizations/${orgId}/memberships/${userId}`, body, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      observe: 'body',
      reportProgress: false
    });
  }

  getMemberships(id: string): Observable<OrganizationMembershipWrapper> {
    return this.httpClient.get<OrganizationMembershipWrapper>(`${this.basePath}/organizations/${id}/memberships`, {
      headers: {
        Accept: 'application/json'
      },
      observe: 'body',
      reportProgress: false
    });
  }

  searchUser(query: string): Observable<UserSearchResult[]> {
    return this.httpClient.get<UserSearchResult[]>(`${this.basePath}/users/search`, {
      params: new HttpParams().set('q', query),
      headers: {
        Accept: 'application/json'
      },
      observe: 'body',
      reportProgress: false
    });
  }

  getUserProfile(id: string): Observable<UserProfile> {
    return this.httpClient.get<UserProfile>(`${this.basePath}/users/${id}/profile`, {
      headers: {
        Accept: 'application/json'
      },
      observe: 'body',
      reportProgress: false
    });
  }

  createUserProfile(id: string, profile: CreateUserProfileSchema): Observable<UserProfile> {
    return this.httpClient.post<UserProfile>(`${this.basePath}/users/${id}/profile`, profile, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      observe: 'body',
      reportProgress: false
    });
  }

  setUserAvatar(id: string, avatar: File): Observable<any> {
    const formParams = new FormData();
    formParams.set('file', avatar);
    return this.httpClient.post<any>(`${this.basePath}/users/${id}/profile/avatar`, formParams, {
      headers: {},
      observe: 'body',
      reportProgress: false
    });
  }

  getUserAvatar(id: string): string {
    return `${this.basePath}/users/${id}/profile/avatar`;
  }

  getUserProfiles(): Observable<UserProfileBriefCollection> {
    return this.httpClient.get<UserProfileBriefCollection>(`${this.basePath}/users/profiles`, {
      headers: {
        Accept: 'application/json'
      },
      observe: 'body',
      reportProgress: false
    });
  }
}
