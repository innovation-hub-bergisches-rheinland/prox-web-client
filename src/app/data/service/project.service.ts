import { Injectable, Injector } from '@angular/core';

import { Observable } from 'rxjs';

import { Project } from '@data/schema/project.resource';
import { Project as ProjectSchema } from '@data/schema/openapi/project-service/models';
import { Tag } from '@data/schema/tag.resource';
import { Module } from '@data/schema/module.resource';
import { map } from 'rxjs/operators';
import { ProjectEntityService } from './openapi/project-service/projectEntity.service';
import { TagCollectionEntityService } from './openapi/tag-service/tagCollectionEntity.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  constructor(
    injector: Injector,
    private projectEntityService: ProjectEntityService,
    private tagCollectionEntityService: TagCollectionEntityService
  ) {}

  createProject(
    project: Project,
    tags?: Tag[],
    modules?: Module[]
  ): Observable<Project | any> {
    return this.projectEntityService
      .saveProjectUsingPOST(project as ProjectSchema)
      .pipe(
        map(p => {
          if (modules) {
            this.projectEntityService
              .projectModulesUsingPUT(p.id, modules.map(m => m.id).join('\n'))
              .subscribe();
          }
          if (tags) {
            this.tagCollectionEntityService
              .tagCollectionTagsUsingPUT(p.id, tags.map(t => t.id).join('\n'))
              .subscribe();
          }
        })
      );
  }

  updateProject(
    project: Project,
    tags?: Tag[],
    modules?: Module[]
  ): Observable<Project | any> {
    return this.projectEntityService
      .saveProjectUsingPUT(project.id, project as ProjectSchema)
      .pipe(
        map(p => {
          if (modules) {
            this.projectEntityService
              .projectModulesUsingPUT(p.id, modules.map(m => m.id).join('\n'))
              .subscribe();
          }
          if (tags) {
            this.tagCollectionEntityService
              .tagCollectionTagsUsingPUT(p.id, tags.map(t => t.id).join('\n'))
              .subscribe();
          }
        })
      );
  }

  getProject(id: any): Observable<Project> {
    return this.projectEntityService
      .findByIdProjectUsingGET(id)
      .pipe(map(p => Object.assign(new Project(), p)));
  }

  getAllProjects(): Observable<Project[]> {
    return this.projectEntityService
      .findAllProjectUsingGET()
      .pipe(
        map(p =>
          p._embedded.projects.map(p2 => Object.assign(new Project(), p2))
        )
      );
  }

  deleteProject(project: Project): Observable<any> {
    return this.projectEntityService.deleteProjectUsingDELETE(project.id);
  }

  getModulesOfProject(project: Project): Observable<Module[]> {
    return this.projectEntityService
      .projectModulesUsingGET(project.id)
      .pipe(
        map(m =>
          m._embedded.projectModules.map(m2 => Object.assign(new Module(), m2))
        )
      );
  }
}
