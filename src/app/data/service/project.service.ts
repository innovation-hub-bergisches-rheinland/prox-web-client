import { Inject, Injectable, Injector, Optional } from '@angular/core';

import { forkJoin, Observable } from 'rxjs';

import {
  CreateProjectSchema,
  ModuleType,
  ModuleTypeCollectionModel,
  Project,
  ProjectCollectionModel,
  Status,
  StudyProgramWithoutModules,
  StudyProgramWithoutModulesCollectionModel
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

  createProject(project: CreateProjectSchema): Observable<Project> {
    return this.httpClient.post<Project>(`${this.basePath}/projects`, project, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      observe: 'body',
      reportProgress: false
    });
  }

  setProjectModules(
    id: string,
    modules: ModuleType[]
  ): Observable<ModuleType[] | any> {
    const requestBody = modules.map(m => m.id).join('\n');

    return this.httpClient.put<ModuleTypeCollectionModel>(
      `${this.basePath}/projects/${id}/modules`,
      requestBody,
      {
        headers: {
          'Content-Type': 'text/uri-list',
          Accept: 'application/json'
        },
        observe: 'body'
      }
    );
  }

  updateProject(id: string, project: CreateProjectSchema): Observable<Project> {
    return this.httpClient.put<Project>(
      `${this.basePath}/projects/${id}`,
      project,
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        observe: 'body'
      }
    );
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

  deleteProject(project: Project): Observable<any> {
    return this.httpClient.delete<any>(
      `${this.basePath}/projects/${project.id}`,
      {
        headers: {
          Accept: 'application/json'
        },
        observe: 'body'
      }
    );
  }

  getModulesOfProject(project: Project): Observable<ModuleType[]> {
    return this.getModulesOfProjectById(project.id);
  }

  getModulesOfProjectById(id: string): Observable<ModuleType[]> {
    return this.httpClient
      .get<ModuleTypeCollectionModel>(
        `${this.basePath}/projects/${id}/modules`,
        {
          headers: {
            Accept: 'application/json'
          },
          observe: 'body'
        }
      )
      .pipe(map(p => p._embedded.moduleTypes));
  }

  findAvailableProjectsOfCreator(id: string): Observable<Project[]> {
    const queryParameters = new HttpParams().set('creatorId', id);

    return this.httpClient
      .get<ProjectCollectionModel>(
        `${this.basePath}/projects/search/findAvailableProjectsOfCreator`,
        {
          params: queryParameters,
          headers: {
            Accept: 'application/json'
          },
          observe: 'body'
        }
      )
      .pipe(map(p => p._embedded.projects));
  }

  findRunningProjectsOfCreator(id: string): Observable<Project[]> {
    const queryParameters = new HttpParams().set('creatorId', id);

    return this.httpClient
      .get<ProjectCollectionModel>(
        `${this.basePath}/projects/search/findRunningProjectsOfCreator`,
        {
          params: queryParameters,
          headers: {
            Accept: 'application/json'
          },
          observe: 'body'
        }
      )
      .pipe(map(p => p._embedded.projects));
  }

  findRunningAndFinishedProjectsOfCreator(id: string): Observable<Project[]> {
    const queryParameters = new HttpParams().set('creatorId', id);

    return this.httpClient
      .get<ProjectCollectionModel>(
        `${this.basePath}/projects/search/findRunningAndFinishedProjectsOfCreator`,
        {
          params: queryParameters,
          headers: {
            Accept: 'application/json'
          },
          observe: 'body'
        }
      )
      .pipe(map(p => p._embedded.projects));
  }

  getAllStudyPrograms(): Observable<StudyProgramWithoutModules[]> {
    return this.httpClient
      .get<StudyProgramWithoutModulesCollectionModel>(
        `${this.basePath}/studyPrograms`,
        {
          headers: {
            Accept: 'application/json'
          },
          observe: 'body'
        }
      )
      .pipe(map(p => p._embedded.studyPrograms));
  }

  getAllModuleTypesOfStudyProgram(id: any): Observable<ModuleType[]> {
    return this.httpClient
      .get<ModuleTypeCollectionModel>(
        `${this.basePath}/studyPrograms/${id}/modules`,
        {
          headers: {
            Accept: 'application/json'
          },
          observe: 'body'
        }
      )
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
    const queryParameters = new HttpParams().set(
      'studyProgramIds',
      ids.join(',')
    );
    return this.httpClient
      .get<ModuleTypeCollectionModel>(
        `${this.basePath}/studyPrograms/search/findAllModulesOfStudyPrograms`,
        {
          params: queryParameters,
          headers: {
            Accept: 'application/json'
          },
          observe: 'body'
        }
      )
      .pipe(map(p => p._embedded.moduleTypes));
  }

  filterProjects(
    status?: Status,
    moduleTypeKeys?: string[],
    text?: string
  ): Observable<Project[]> {
    let queryParameters = new HttpParams();
    if (status) {
      queryParameters = queryParameters.set('status', status);
    }
    if (moduleTypeKeys) {
      queryParameters = queryParameters.set(
        'moduleTypeKeys',
        moduleTypeKeys.join(',')
      );
    }
    if (text) {
      queryParameters = queryParameters.set('text', text);
    }

    return this.httpClient
      .get<ProjectCollectionModel>(
        `${this.basePath}/projects/search/filterProjects`,
        {
          params: queryParameters,
          headers: {
            Accept: 'application/json'
          },
          observe: 'body'
        }
      )
      .pipe(map(r => r._embedded.projects));
  }
}
