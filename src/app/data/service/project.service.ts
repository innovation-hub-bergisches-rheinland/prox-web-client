import { Injectable, Injector } from '@angular/core';

import { forkJoin, Observable } from 'rxjs';

import {
  ModuleType,
  Project,
  Project as ProjectSchema,
  StudyProgram
} from '@data/schema/openapi/project-service/models';
import { Tag } from '@data/schema/tag.resource';
import { Module } from '@data/schema/module.resource';
import { map } from 'rxjs/operators';
import { ProjectEntityService } from './openapi/project-service/projectEntity.service';
import { TagCollectionEntityService } from './openapi/tag-service/tagCollectionEntity.service';
import { StudyProgramEntityService } from './openapi/project-service/studyProgramEntity.service';
import { ModuleTypeEntityService } from './openapi/project-service/moduleTypeEntity.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  constructor(
    injector: Injector,
    private projectEntityService: ProjectEntityService,
    private tagCollectionEntityService: TagCollectionEntityService,
    private studyProgramEntityService: StudyProgramEntityService,
    private moduleTypeEntityService: ModuleTypeEntityService
  ) {}

  createProject(
    project: ProjectSchema,
    tags?: Tag[],
    modules?: ModuleType[]
  ): Observable<Project | any> {
    return this.projectEntityService.saveProjectUsingPOST(project).pipe(
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
    project: ProjectSchema,
    tags?: Tag[],
    modules?: ModuleType[]
  ): Observable<Project | any> {
    return this.projectEntityService
      .saveProjectUsingPUT(project.id, project)
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
    return this.projectEntityService.findByIdProjectUsingGET(id);
  }

  getAllProjects(): Observable<Project[]> {
    return this.projectEntityService
      .findAllProjectUsingGET()
      .pipe(map(p => p._embedded.projects));
  }

  deleteProject(project: Project): Observable<any> {
    return this.projectEntityService.deleteProjectUsingDELETE(project.id);
  }

  getModulesOfProject(project: Project): Observable<ModuleType[]> {
    return this.projectEntityService
      .projectModulesUsingGET(project.id)
      .pipe(map(m => m._embedded.moduleTypes));
  }

  findAvailableProjectsOfCreator(id: string): Observable<Project[]> {
    return this.projectEntityService
      .findAvailableProjectsOfCreatorProjectUsingGET(id)
      .pipe(map(p => p._embedded.projects));
  }

  findRunningProjectsOfCreator(id: string): Observable<Project[]> {
    return this.projectEntityService
      .findRunningProjectsOfCreatorProjectUsingGET(id)
      .pipe(map(p => p._embedded.projects));
  }

  findRunningAndFinishedProjectsOfCreator(id: string): Observable<Project[]> {
    return this.projectEntityService
      .findRunningAndFinishedProjectsOfCreatorProjectUsingGET(id)
      .pipe(map(p => p._embedded.projects));
  }

  getAllStudyPrograms(): Observable<StudyProgram[]> {
    return this.studyProgramEntityService
      .findAllStudyProgramUsingGET()
      .pipe(map(sp => sp._embedded.studyPrograms));
  }

  getAllModuleTypesOfStudyProgram(id: any): Observable<ModuleType[]> {
    return this.studyProgramEntityService
      .studyProgramModulesUsingGET(id)
      .pipe(map(m => m._embedded.moduleTypes));
  }

  getAllModuleTypes(): Observable<ModuleType[]> {
    return this.moduleTypeEntityService
      .findAllModuleTypeUsingGET()
      .pipe(map(m => m._embedded.moduleTypes));
  }

  getAllModuleTypesOfStudyprograms(ids: string[]): Observable<ModuleType[]> {
    return this.studyProgramEntityService
      .findAllModulesOfStudyProgramsStudyProgramUsingGET(ids.join(','))
      .pipe(map(m => m._embedded.moduleTypes));
  }

  filterProjects(
    status?: Project.StatusEnum,
    moduleTypeKeys?: string[],
    text?: string
  ): Observable<Project[]> {
    return this.projectEntityService
      .filterProjectsProjectUsingGET(status, moduleTypeKeys?.join(','), text)
      .pipe(map(p => p._embedded.projects));
  }
}
