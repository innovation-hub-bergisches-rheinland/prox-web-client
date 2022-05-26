import { Injectable, Injector } from '@angular/core';

import { Observable } from 'rxjs';

import {
  CreateProjectSchema,
  ModuleType,
  ModuleTypeCollectionModel,
  Project,
  ProjectCollectionModel,
  ProjectWithAssociations,
  Specialization,
  SpecializationCollectionModel,
  Status,
  StudyProgram,
  StudyProgramCollectionModel,
  StudyProgramsWithModules
} from '@data/schema/project-service.types';
import { map } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@env';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private basePath = environment.apiUrl;

  constructor(injector: Injector, protected httpClient: HttpClient) {}

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

  getProject(id: string, projection: 'withAssociations'): Observable<ProjectWithAssociations>;
  getProject(id: string): Observable<Project>;
  getProject(id: string, projection?: 'withAssociations'): Observable<Project | ProjectWithAssociations> {
    let queryParams = new HttpParams();
    if (projection) {
      queryParams = queryParams.set('projection', projection);
    }
    return this.httpClient.get<Project | ProjectWithAssociations>(`${this.basePath}/projects/${id}`, {
      params: queryParams,
      headers: {
        Accept: 'application/json'
      },
      observe: 'body'
    });
  }

  getAllProjects(projection: 'withAssociations'): Observable<ProjectWithAssociations[]>;
  getAllProjects(): Observable<Project[]>;
  getAllProjects(projection?: 'withAssociations'): Observable<Project[] | ProjectWithAssociations[]> {
    let queryParams = new HttpParams().set('sort', `createdAt,desc`);
    if (projection) {
      queryParams = queryParams.set('projection', projection);
    }
    return this.httpClient
      .get<ProjectCollectionModel>(`${this.basePath}/projects`, {
        params: queryParams,
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

  findAvailableProjectsOfCreator(id: string, projection: 'withAssociations'): Observable<ProjectWithAssociations[]>;
  findAvailableProjectsOfCreator(id: string): Observable<Project[]>;
  findAvailableProjectsOfCreator(id: string, projection?: 'withAssociations'): Observable<Project[] | ProjectWithAssociations[]> {
    let queryParameters = new HttpParams().set('creatorId', id).set('sort', `createdAt,desc`);

    if (projection) {
      queryParameters = queryParameters.set('projection', projection);
    }

    return this.httpClient
      .get<ProjectCollectionModel>(`${this.basePath}/projects/search/findAvailableProjectsOfCreator`, {
        params: queryParameters,
        headers: {
          Accept: 'application/json'
        },
        observe: 'body'
      })
      .pipe(map(p => p._embedded.projects));
  }

  findRunningProjectsOfCreator(id: string): Observable<Project[]> {
    const queryParameters = new HttpParams().set('creatorId', id).set('sort', `createdAt,desc`);

    return this.httpClient
      .get<ProjectCollectionModel>(`${this.basePath}/projects/search/findRunningProjectsOfCreator`, {
        params: queryParameters,
        headers: {
          Accept: 'application/json'
        },
        observe: 'body'
      })
      .pipe(map(p => p._embedded.projects));
  }

  findRunningAndFinishedProjectsOfCreator(id: string): Observable<Project[]> {
    const queryParameters = new HttpParams().set('creatorId', id).set('sort', `createdAt,desc`);

    return this.httpClient
      .get<ProjectCollectionModel>(`${this.basePath}/projects/search/findRunningAndFinishedProjectsOfCreator`, {
        params: queryParameters,
        headers: {
          Accept: 'application/json'
        },
        observe: 'body'
      })
      .pipe(map(p => p._embedded.projects));
  }

  getAllStudyPrograms(projection?: 'withModules'): Observable<StudyProgramsWithModules[]>;
  getAllStudyPrograms(): Observable<StudyProgram[]>;
  getAllStudyPrograms(projection?: string): Observable<StudyProgram[] | StudyProgramsWithModules[]> {
    let queryParams = new HttpParams();
    if (projection) {
      queryParams = queryParams.set('projection', projection);
    }

    return this.httpClient
      .get<StudyProgramCollectionModel>(`${this.basePath}/studyPrograms`, {
        params: queryParams,
        headers: {
          Accept: 'application/json'
        },
        observe: 'body'
      })
      .pipe(map(p => p._embedded.studyPrograms));
  }

  getAllModuleTypesOfStudyProgram(id: any): Observable<ModuleType[]> {
    return this.httpClient
      .get<ModuleTypeCollectionModel>(`${this.basePath}/studyPrograms/${id}/modules`, {
        headers: {
          Accept: 'application/json'
        },
        observe: 'body'
      })
      .pipe(map(cm => cm._embedded.moduleTypes));
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

  getAllModuleTypesOfStudyprograms(ids: string[]): Observable<ModuleType[]> {
    const queryParameters = new HttpParams().set('studyProgramIds', ids.join(','));
    return this.httpClient
      .get<ModuleTypeCollectionModel>(`${this.basePath}/studyPrograms/search/findAllModulesOfStudyPrograms`, {
        params: queryParameters,
        headers: {
          Accept: 'application/json'
        },
        observe: 'body'
      })
      .pipe(map(p => p._embedded.moduleTypes));
  }

  filterProjects(
    projection: 'withAssociations',
    status?: Status,
    specializationKeys?: string[],
    moduleTypeKeys?: string[],
    text?: string
  ): Observable<ProjectWithAssociations[]>;
  filterProjects(
    projection: null,
    status?: Status,
    specializationKeys?: string[],
    moduleTypeKeys?: string[],
    text?: string
  ): Observable<Project[]>;
  filterProjects(
    projection?: 'withAssociations',
    status?: Status,
    specializationKeys?: string[],
    moduleTypeKeys?: string[],
    text?: string
  ): Observable<Project[] | ProjectWithAssociations[]> {
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
    if (projection) {
      queryParameters = queryParameters.set('projection', projection);
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
