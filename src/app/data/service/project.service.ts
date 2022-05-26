import { Injectable, Injector } from '@angular/core';

import { Observable } from 'rxjs';

import {
  CreateProjectSchema,
  ModuleType,
  ModuleTypeCollectionModel,
  Project,
  ProjectCollectionModel,
  Specialization,
  SpecializationCollectionModel,
  Status,
  StudyProgram,
  StudyProgramCollectionModel
} from '@data/schema/project-service.types';
import { map } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@env';
import { Context } from '@shared/components/context-selector/context-selector.component';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private basePath = environment.apiUrl;

  constructor(injector: Injector, protected httpClient: HttpClient) {}

  createProjectForContext(project: CreateProjectSchema, context: Context): Observable<Project> {
    let path: string;
    switch (context.discriminator) {
      case 'organization':
        path = `organizations/${context.id}/projects`;
        break;
      case 'user':
        path = `users/${context.id}/projects`;
        break;
    }

    return this.httpClient.post<Project>(`${this.basePath}/${path}`, project, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      observe: 'body',
      reportProgress: false
    });
  }

  createProjectForAuthenticatedUser(project: CreateProjectSchema): Observable<Project> {
    return this.httpClient.post<Project>(`${this.basePath}/user/projects`, project, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      observe: 'body',
      reportProgress: false
    });
  }

  setProjectModules(id: string, modules: string[]): Observable<ModuleType[] | any> {
    const requestBody = modules.join('\n');

    return this.httpClient.put<ModuleTypeCollectionModel>(`${this.basePath}/projects/${id}/modules`, requestBody, {
      headers: {
        'Content-Type': 'text/uri-list',
        Accept: 'application/json'
      },
      observe: 'body'
    });
  }

  setProjectSpecializations(id: string, specializations: string[]): Observable<Specialization[] | any> {
    const requestBody = specializations.join('\n');

    return this.httpClient.put<SpecializationCollectionModel>(`${this.basePath}/projects/${id}/specializations`, requestBody, {
      headers: {
        'Content-Type': 'text/uri-list',
        Accept: 'application/json'
      },
      observe: 'body'
    });
  }

  updateProject(id: string, project: CreateProjectSchema): Observable<Project> {
    return this.httpClient.put<Project>(`${this.basePath}/projects/${id}`, project, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      observe: 'body'
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
      .get<ProjectCollectionModel>(`${this.basePath}/projects`, {
        headers: {
          Accept: 'application/json'
        },
        observe: 'body'
      })
      .pipe(map(p => p._embedded.projects));
  }

  deleteProject(project: Pick<Project, 'id'>): Observable<any> {
    return this.httpClient.delete<any>(`${this.basePath}/projects/${project.id}`, {
      headers: {
        Accept: 'application/json'
      },
      observe: 'body'
    });
  }

  getAllSpecializations(): Observable<Specialization[]> {
    return this.httpClient
      .get<SpecializationCollectionModel>(`${this.basePath}/specializations`, {
        headers: {
          Accept: 'application/json'
        },
        observe: 'body'
      })
      .pipe(map(sp => sp._embedded.specializations));
  }

  getModulesOfSpecializations(specializations: string[]): Observable<ModuleType[]> {
    const queryParameters = new HttpParams().set('ids', specializations.join(','));
    return this.httpClient
      .get<ModuleTypeCollectionModel>(`${this.basePath}/moduleTypes/search/findAllModuleTypesOfSpecializationId`, {
        params: queryParameters,
        headers: {
          Accept: 'application/json'
        },
        observe: 'body'
      })
      .pipe(map(sp => sp._embedded.moduleTypes));
  }

  getModulesOfProject(project: Pick<Project, 'id'>): Observable<ModuleType[]> {
    return this.getModulesOfProjectById(project.id);
  }

  getModulesOfProjectById(id: string): Observable<ModuleType[]> {
    return this.httpClient
      .get<ModuleTypeCollectionModel>(`${this.basePath}/projects/${id}/modules`, {
        headers: {
          Accept: 'application/json'
        },
        observe: 'body'
      })
      .pipe(map(p => p._embedded.moduleTypes));
  }

  getSpecializationsOfProjectById(id: string): Observable<Specialization[]> {
    return this.httpClient
      .get<SpecializationCollectionModel>(`${this.basePath}/projects/${id}/specializations`, {
        headers: {
          Accept: 'application/json'
        },
        observe: 'body'
      })
      .pipe(map(p => p._embedded.specializations));
  }

  findProjectsOfUser(id: string): Observable<Project[]> {
    return this.httpClient
      .get<ProjectCollectionModel>(`${this.basePath}/users/${id}/projects`, {
        headers: {
          Accept: 'application/json'
        },
        observe: 'body'
      })
      .pipe(map(p => p._embedded.projects));
  }

  findProjectsOfOrganization(id: string): Observable<Project[]> {
    return this.httpClient
      .get<ProjectCollectionModel>(`${this.basePath}/users/${id}/projects`, {
        headers: {
          Accept: 'application/json'
        },
        observe: 'body'
      })
      .pipe(map(p => p._embedded.projects));
  }

  getAllModuleTypes(): Observable<ModuleType[]> {
    return this.httpClient
      .get<ModuleTypeCollectionModel>(`${this.basePath}/moduleTypes`, {
        headers: {
          Accept: 'application/json'
        },
        observe: 'body'
      })
      .pipe(map(p => p._embedded.moduleTypes));
  }

  filterProjects(status?: Status, specializationKeys?: string[], moduleTypeKeys?: string[], text?: string): Observable<Project[]> {
    let queryParameters = new HttpParams().set('sort', `createdAt,desc`);
    if (status) {
      queryParameters = queryParameters.set('status', status);
    }
    if (specializationKeys) {
      queryParameters = queryParameters.set('specializationKeys', specializationKeys.join(','));
    }
    if (moduleTypeKeys) {
      queryParameters = queryParameters.set('moduleTypeKeys', moduleTypeKeys.join(','));
    }
    if (text) {
      queryParameters = queryParameters.set('text', text);
    }

    return this.httpClient
      .get<ProjectCollectionModel>(`${this.basePath}/projects/search/filterProjects`, {
        params: queryParameters,
        headers: {
          Accept: 'application/json'
        },
        observe: 'body'
      })
      .pipe(map(r => r._embedded.projects));
  }
}
