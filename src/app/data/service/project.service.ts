import { Injectable, Injector } from '@angular/core';

import { Observable } from 'rxjs';

import {
  CreateProjectSchema,
  CreateProposalSchema,
  ModuleType,
  ModuleTypeCollectionModel,
  Project,
  ProjectCollectionModel,
  Proposal,
  ProposalCollectionModel,
  Specialization,
  SpecializationCollectionModel,
  Status
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

  createProposalForContext(project: CreateProposalSchema, context: Pick<Context, 'id' | 'discriminator'>): Observable<Proposal> {
    let path: string;
    switch (context.discriminator) {
      case 'organization':
        path = `organizations/${context.id}/proposals`;
        break;
      case 'user':
        path = `users/${context.id}/proposals`;
        break;
    }

    return this.httpClient.post<Proposal>(`${this.basePath}/${path}`, project, {
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

  setProjectModules(id: string, moduleKeys: string[]): Observable<ModuleType[] | any> {
    return this.httpClient.put<ModuleTypeCollectionModel>(`${this.basePath}/projects/${id}/modules`, moduleKeys, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      observe: 'body'
    });
  }

  setProjectSpecializations(id: string, specializationKeys: string[]): Observable<Specialization[] | any> {
    return this.httpClient.put<SpecializationCollectionModel>(`${this.basePath}/projects/${id}/specializations`, specializationKeys, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      observe: 'body'
    });
  }

  setProposalModules(id: string, moduleKeys: string[]): Observable<ModuleType[] | any> {
    return this.httpClient.put<ModuleTypeCollectionModel>(`${this.basePath}/proposals/${id}/modules`, moduleKeys, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      observe: 'body'
    });
  }

  setProposalSpecializations(id: string, specializationKeys: string[]): Observable<Specialization[] | any> {
    return this.httpClient.put<SpecializationCollectionModel>(`${this.basePath}/proposals/${id}/specializations`, specializationKeys, {
      headers: {
        'Content-Type': 'application/json',
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
      .pipe(map(p => p.projects));
  }

  deleteProject(project: Pick<Project, 'id'>): Observable<any> {
    return this.httpClient.delete<any>(`${this.basePath}/projects/${project.id}`, {
      headers: {
        Accept: 'application/json'
      },
      observe: 'body'
    });
  }

  updateProposal(id: string, project: CreateProposalSchema): Observable<Proposal> {
    return this.httpClient.put<Proposal>(`${this.basePath}/proposals/${id}`, project, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      observe: 'body'
    });
  }

  getProposal(id: string): Observable<Proposal> {
    return this.httpClient.get<Proposal>(`${this.basePath}/proposals/${id}`, {
      headers: {
        Accept: 'application/json'
      },
      observe: 'body'
    });
  }

  getAllProposals(): Observable<Proposal[]> {
    return this.httpClient
      .get<ProposalCollectionModel>(`${this.basePath}/proposals`, {
        headers: {
          Accept: 'application/json'
        },
        observe: 'body'
      })
      .pipe(map(p => p.proposals));
  }

  deleteProposal(proposal: Pick<Proposal, 'id'>): Observable<any> {
    return this.httpClient.delete<any>(`${this.basePath}/proposals/${proposal.id}`, {
      headers: {
        Accept: 'application/json'
      },
      observe: 'body'
    });
  }

  commitForProposal(proposal: Pick<Proposal, 'id'>): Observable<Proposal & Required<Pick<Proposal, 'projectId'>>> {
    return this.httpClient.post<Proposal & Required<Pick<Proposal, 'projectId'>>>(`${this.basePath}/proposals/${proposal.id}/commitment`, {
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
      .pipe(map(sp => sp.specializations));
  }

  getModulesOfSpecializations(specializationKeys: string[]): Observable<ModuleType[]> {
    const queryParameters = new HttpParams().set('keys', specializationKeys.join(','));
    return this.httpClient
      .get<ModuleTypeCollectionModel>(`${this.basePath}/modules/search/findModulesOfSpecializations`, {
        params: queryParameters,
        headers: {
          Accept: 'application/json'
        },
        observe: 'body'
      })
      .pipe(map(sp => sp.modules));
  }

  findProjectsOfUser(id: string): Observable<Project[]> {
    return this.httpClient
      .get<ProjectCollectionModel>(`${this.basePath}/users/${id}/projects`, {
        headers: {
          Accept: 'application/json'
        },
        observe: 'body'
      })
      .pipe(map(p => p.projects));
  }

  findProjectsOfOrganization(id: string): Observable<Project[]> {
    return this.httpClient
      .get<ProjectCollectionModel>(`${this.basePath}/organizations/${id}/projects`, {
        headers: {
          Accept: 'application/json'
        },
        observe: 'body'
      })
      .pipe(map(p => p.projects));
  }

  getAllModuleTypes(): Observable<ModuleType[]> {
    return this.httpClient
      .get<ModuleTypeCollectionModel>(`${this.basePath}/modules`, {
        headers: {
          Accept: 'application/json'
        },
        observe: 'body'
      })
      .pipe(map(p => p.modules));
  }

  filterProjects(status?: Status, specializationKeys?: string[], moduleTypeKeys?: string[], text?: string): Observable<Project[]> {
    let queryParameters = new HttpParams().set('sort', `modifiedAt,desc`);
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
      .get<ProjectCollectionModel>(`${this.basePath}/projects/search/filter`, {
        params: queryParameters,
        headers: {
          Accept: 'application/json'
        },
        observe: 'body'
      })
      .pipe(map(r => r.projects));
  }
}
