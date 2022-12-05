import { Injectable, Injector } from '@angular/core';

import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@env';
import { CreateProjectRequest, Discipline, ModuleType, Project, ProjectList, ProjectState } from '@data/schema/project.types';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private basePath = environment.apiUrl;

  constructor(injector: Injector, protected httpClient: HttpClient) {}

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

  setProjectSupervisors(id: string, supervisorIds: string[]): Observable<void> {
    return this.httpClient.post<void>(`${this.basePath}/projects/${id}/supervisors`, supervisorIds, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      observe: 'body',
      reportProgress: false
    });
  }

  setProjectPartner(id: string, organizationId: string): Observable<void> {
    const body = {
      organizationId
    };

    return this.httpClient.put<void>(`${this.basePath}/projects/${id}/partner`, body, {
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

  getAllProjects(): Observable<Project[]> {
    return this.httpClient
      .get<ProjectList>(`${this.basePath}/projects`, {
        headers: {
          Accept: 'application/json'
        },
        observe: 'body'
      })
      .pipe(map(p => p.projects));
  }

  findBySupervisor(id: string): Observable<Project[]> {
    const params = new HttpParams().set('supervisor', id);
    return this.httpClient
      .get<ProjectList>(`${this.basePath}/projects/search/findBySupervisor`, {
        headers: {
          Accept: 'application/json'
        },
        params,
        observe: 'body'
      })
      .pipe(map(r => r.projects));
  }

  findByPartner(id: string): Observable<Project[]> {
    const params = new HttpParams().set('partner', id);
    return this.httpClient
      .get<ProjectList>(`${this.basePath}/projects/search/findByPartner`, {
        headers: {
          Accept: 'application/json'
        },
        params,
        observe: 'body'
      })
      .pipe(map(r => r.projects));
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
    return this.httpClient.get<ModuleType[]>(`${this.basePath}/modules/search/findByDisciplines`, {
      params: queryParameters,
      headers: {
        Accept: 'application/json'
      },
      observe: 'body'
    });
  }

  getAllModuleTypes(): Observable<ModuleType[]> {
    return this.httpClient.get<ModuleType[]>(`${this.basePath}/modules`, {
      headers: {
        Accept: 'application/json'
      },
      observe: 'body'
    });
  }

  filterProjects(status?: ProjectState, disciplines?: string[], moduleTypes?: string[], text?: string): Observable<Project[]> {
    let queryParameters = new HttpParams();
    if (status) {
      queryParameters = queryParameters.set('status', status);
    }
    if (disciplines && disciplines.length > 0) {
      queryParameters = queryParameters.set('disciplineKeys', disciplines.join(','));
    }
    if (moduleTypes && moduleTypes.length > 0) {
      queryParameters = queryParameters.set('moduleTypeKeys', moduleTypes.join(','));
    }
    if (text) {
      queryParameters = queryParameters.set('text', text);
    }

    return this.httpClient
      .get<ProjectList>(`${this.basePath}/projects/search/filter`, {
        params: queryParameters,
        headers: {
          Accept: 'application/json'
        },
        observe: 'body'
      })
      .pipe(map(r => r.projects));
  }
}
