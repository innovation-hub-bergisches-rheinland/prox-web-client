import { Injectable, Injector } from '@angular/core';

import { RestService } from 'angular4-hal';
import { Observable } from 'rxjs';

import { Project } from '@data/schema/project.resource';
import { ObserveOnSubscriber } from 'rxjs/internal/operators/observeOn';
import { CrudRestService } from './base/crud-rest-service';
import { HalRestService } from './base/hal-crud-rest-service';
//import { map, tap } from 'rxjs/operators';
import { Tag } from '@data/schema/tag.resource';
import { Module } from '@data/schema/module.resource';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProjectService extends HalRestService<Project> {
  constructor(injector: Injector) {
    super(Project, 'projects', injector);
  }

  createProject(
    project: Project,
    tags?: Tag[],
    modules?: Module[]
  ): Observable<Project | any> {
    return this.create(project).pipe(
      map(p => {
        if (tags) {
          p.setRelationArray('tagCollection', tags).subscribe();
        }
        if (modules) {
          p.setRelationArray('modules', modules).subscribe();
        }
      })
    );
  }

  updateProject(
    project: Project,
    tags?: Tag[],
    modules?: Module[]
  ): Observable<Project | any> {
    return this.update(project).pipe(
      map(p => {
        if (tags) {
          p.setRelationArray('tagCollection', tags).subscribe();
        }
        if (modules) {
          p.setRelationArray('modules', modules).subscribe();
        }
      })
    );
  }

  getProject(id: any): Observable<Project> {
    return this.get(id);
  }

  getAllProjects(): Observable<Project[]> {
    return this.getAll();
  }

  deleteProject(project: Project): Observable<any> {
    return this.delete(project);
  }
}
