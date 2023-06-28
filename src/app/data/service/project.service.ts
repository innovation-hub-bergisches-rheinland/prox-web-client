import { Injectable, Injector } from '@angular/core';

import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@env';
import {
  ApplyCommitment,
  CreateProjectRequest,
  Discipline,
  ModuleType,
  Project,
  ProjectList,
  ProjectState
} from '@data/schema/project.types';
import { KeycloakService } from 'keycloak-angular';
import { PageRequest } from '@data/schema/shared.types';
import { RecommendationResponse } from '@data/schema/recommendation.types';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private basePath = environment.apiUrl;

  constructor(injector: Injector, protected httpClient: HttpClient, private keycloakService: KeycloakService) {}

  createProject(project: CreateProjectRequest): Observable<Project> {
    return this.httpClient.post<Project>(`${this.basePath}/projects`, project, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      observe: 'body',
      reportProgress: false
    });
  }

  updateProject(id: string, project: CreateProjectRequest): Observable<Project> {
    return this.httpClient.put<Project>(`${this.basePath}/projects/${id}`, project, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      observe: 'body'
    });
  }

  setProjectTags(id: string, tagIds: string[]): Observable<void> {
    const body = {
      tags: tagIds
    };
    return this.httpClient.post<void>(`${this.basePath}/projects/${id}/tags`, body, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      observe: 'body',
      reportProgress: false
    });
  }

  setCommitment(projectId: string): Observable<Project> {
    const subject = this.keycloakService.getKeycloakInstance().subject;
    if (!subject) {
      throw new Error('No subject found');
    }
    const request: ApplyCommitment = {
      supervisorId: subject
    };
    return this.httpClient.post<Project>(`${this.basePath}/projects/${projectId}/commitment`, request, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      observe: 'body',
      reportProgress: false
    });
  }

  setState(id: string, state: ProjectState): Observable<Project> {
    const body = {
      state: state
    };
    return this.httpClient.post<Project>(`${this.basePath}/projects/${id}/status`, body, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      observe: 'body',
      reportProgress: false
    });
  }

  getProject(id: string): Observable<Project> {
    return this.httpClient.get<Project>(`${this.basePath}/projects/${id}`, {
      headers: {
        Accept: 'application/json'
      },
      observe: 'body'
    });
  }

  getProjectRecommendations(id: string): Observable<RecommendationResponse> {
    return this.httpClient.get<RecommendationResponse>(`${this.basePath}/projects/${id}/recommendations`, {
      headers: {
        Accept: 'application/json'
      },
      observe: 'body'
    });
  }

  getAllProjects(page: PageRequest = { page: 0, size: 20 }): Observable<ProjectList> {
    const params = new HttpParams().set('page', page.page).set('size', page.size);

    return this.httpClient.get<ProjectList>(`${this.basePath}/projects`, {
      headers: {
        Accept: 'application/json'
      },
      params,
      observe: 'body'
    });
  }

  findBySupervisor(id: string, page: PageRequest = { page: 0, size: 20 }): Observable<ProjectList> {
    const params = new HttpParams().set('supervisor', id).set('page', page.page).set('size', page.size);
    return this.httpClient.get<ProjectList>(`${this.basePath}/projects/search/findBySupervisor`, {
      headers: {
        Accept: 'application/json'
      },
      params,
      observe: 'body'
    });
  }

  findByPartner(id: string, page: PageRequest = { page: 0, size: 20 }): Observable<ProjectList> {
    const params = new HttpParams().set('partner', id).set('page', page.page).set('size', page.size);
    return this.httpClient.get<ProjectList>(`${this.basePath}/projects/search/findByPartner`, {
      headers: {
        Accept: 'application/json'
      },
      params,
      observe: 'body'
    });
  }

  deleteProject(project: Pick<Project, 'id'>): Observable<any> {
    return this.httpClient.delete<any>(`${this.basePath}/projects/${project.id}`, {
      headers: {
        Accept: 'application/json'
      },
      observe: 'body'
    });
  }

  getAllDisciplines(): Observable<Discipline[]> {
    return this.httpClient.get<Discipline[]>(`${this.basePath}/disciplines`, {
      headers: {
        Accept: 'application/json'
      },
      observe: 'body'
    });
  }

  getModulesOfDisciplines(keyes: string[]): Observable<ModuleType[]> {
    const queryParameters = new HttpParams().set('keys', keyes.join(','));
    return this.httpClient.get<ModuleType[]>(`${this.basePath}/moduleTypes/search/findByDisciplines`, {
      params: queryParameters,
      headers: {
        Accept: 'application/json'
      },
      observe: 'body'
    });
  }

  getAllModuleTypes(): Observable<ModuleType[]> {
    return this.httpClient.get<ModuleType[]>(`${this.basePath}/moduleTypes`, {
      headers: {
        Accept: 'application/json'
      },
      observe: 'body'
    });
  }

  filterProjects(
    status?: ProjectState[],
    disciplines?: string[],
    moduleTypes?: string[],
    text?: string,
    tags?: string[],
    page: PageRequest = { page: 0, size: 20 }
  ): Observable<ProjectList> {
    let queryParameters = new HttpParams().set('page', page.page).set('size', page.size);
    if (status && status.length > 0) {
      queryParameters = queryParameters.set('status', status.join(','));
    }
    if (disciplines && disciplines.length > 0) {
      queryParameters = queryParameters.set('disciplineKeys', disciplines.join(','));
    }
    if (moduleTypes && moduleTypes.length > 0) {
      queryParameters = queryParameters.set('moduleTypeKeys', moduleTypes.join(','));
    }
    if (tags && tags.length > 0) {
      queryParameters = queryParameters.set('tags', tags.join(','));
    }
    if (text) {
      queryParameters = queryParameters.set('text', text);
    }

    return this.httpClient.get<ProjectList>(`${this.basePath}/projects/search/filter`, {
      params: queryParameters,
      headers: {
        Accept: 'application/json'
      },
      observe: 'body'
    });
  }
}
