import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

import { Observable, forkJoin, of, throwError } from 'rxjs';
import { catchError, mergeMap, startWith } from 'rxjs/operators';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import { KeycloakService } from 'keycloak-angular';

import { ProjectService } from '@data/service/project.service';
import { TagService } from '@data/service/tag.service';
import { CreateProjectSchema, ModuleType, Project, Specialization } from '@data/schema/project-service.types';
import { Context } from '@shared/components/context-selector/context-selector.component';
import { NotificationService } from '@shared/modules/notifications/notification.service';

@Component({
  selector: 'app-project-editor',
  templateUrl: './project-editor.component.html',
  styleUrls: ['./project-editor.component.scss']
})
export class ProjectEditorComponent implements OnInit {
  projectInformationFormGroup = this.formBuilder.group({
    name: ['', Validators.required],
    description: [''],
    shortDescription: ['', Validators.required],
    requirement: [''],
    supervisors: [],
    status: ['', Validators.required],
    context: []
  });
  projectModuleFormGroup = this.formBuilder.group({
    specializations: [[]],
    modules: [[]]
  });
  projectTagFormGroup = this.formBuilder.group({
    tags: [[]]
  });
  projectForm: UntypedFormGroup = this.formBuilder.group({
    information: this.projectInformationFormGroup,
    module: this.projectModuleFormGroup,
    tag: this.projectTagFormGroup
  });

  @Input()
  project: Project;
  isEdit = false;

  @Output()
  saved = new EventEmitter<Project>();

  specializations$: Observable<Specialization[]>;
  modules$: Observable<ModuleType[]>;

  constructor(
    private projectService: ProjectService,
    private tagService: TagService,
    private formBuilder: UntypedFormBuilder,
    private notificationService: NotificationService,
    private keycloakService: KeycloakService,
    @Inject(LOCAL_STORAGE) private storage: StorageService
  ) {}

  async ngOnInit() {
    // If user is logged in set its ID and Full Name
    if (await this.keycloakService.isLoggedIn()) {
      const userProfile = await this.keycloakService.loadUserProfile();
      const fullName = `${userProfile.firstName} ${userProfile.lastName}`;
      const id = this.keycloakService.getKeycloakInstance().subject;

      // TODO: Hacked to preserve default value in context selector
      this.projectForm.controls.information.get('context').setValue({
        id: userProfile.id,
        name: userProfile.username,
        discriminator: 'user'
      });

      const projectSupervisorControl = this.projectInformationFormGroup.controls.supervisors;
      if (!projectSupervisorControl.value && this.keycloakService.isUserInRole('professor')) {
        projectSupervisorControl.setValue([
          {
            id,
            name: fullName
          }
        ]);
      }
    }

    this.specializations$ = this.projectService.getAllSpecializations().pipe(
      catchError(err => {
        this.notificationService.error('Studiengänge konnten nicht geladen werden.');
        return of([]);
      })
    );
    this.modules$ = this.projectModuleFormGroup.get('specializations').valueChanges.pipe(
      startWith([]),
      mergeMap((s: string[]) => {
        if (!s || s.length === 0) {
          return this.projectService.getAllModuleTypes();
        }
        return this.projectService.getModulesOfSpecializations(s);
      }),
      catchError(err => {
        this.notificationService.error('Module konnten nicht geladen werden.');
        return of([]);
      })
    );

    if (this.project) {
      await this.setProjectValues(this.project);
      this.isEdit = true;
    }
  }

  async setProjectValues(project: Project) {
    this.projectForm.controls.information.get('name').setValue(project.name);
    this.projectForm.controls.information.get('description').setValue(project.description);
    this.projectForm.controls.information.get('requirement').setValue(project.requirement);
    this.projectForm.controls.information.get('shortDescription').setValue(project.shortDescription);
    this.projectForm.controls.information.get('status').setValue(project.status);
    this.projectForm.controls.information.get('supervisors').setValue(project.supervisors);
    this.projectModuleFormGroup.get('specializations').setValue(project.specializations.map(v => v.key));
    this.projectModuleFormGroup.get('modules').setValue(project.modules.map(v => v.key));

    this.tagService
      .getTagsForEntity(project.id)
      .pipe(
        catchError(err => {
          this.notificationService.error('Tags konnten nicht geladen werden');
          // Unrecoverable unless we disable the form control. Must be refactored to do so
          return throwError(() => err);
        })
      )
      .subscribe({
        next: value => this.projectTagFormGroup.get('tags').setValue(value)
      });
  }

  buildProject(): CreateProjectSchema {
    const name = this.projectForm.value.information.name;
    const description = this.projectForm.value.information.description;
    const requirement = this.projectForm.value.information.requirement;
    const shortDescription = this.projectForm.value.information.shortDescription;
    const status = this.projectForm.value.information.status;
    const supervisors = this.projectForm.value.information.supervisors;

    return {
      shortDescription,
      status,
      description,
      supervisors,
      name,
      requirement
    };
  }

  onSave() {
    const project = this.buildProject();
    let createOrUpdateProject$: Observable<Project>;
    if (this.isEdit) {
      createOrUpdateProject$ = this.projectService.updateProject(this.project.id, project);
    } else {
      const context: Context = this.projectForm.value.information.context;
      if (!context) {
        createOrUpdateProject$ = this.projectService.createProjectForAuthenticatedUser(project);
      } else {
        createOrUpdateProject$ = this.projectService.createProjectForContext(project, context);
      }
    }

    createOrUpdateProject$
      .pipe(
        mergeMap((p: Project) =>
          forkJoin({
            modules: this.projectService.setProjectModules(p.id, this.projectModuleFormGroup.controls.modules.value ?? []).pipe(
              catchError(err => {
                this.notificationService.error('Module konnten nicht gespeichert werden');
                return of([]);
              })
            ),
            specializations: this.projectService
              .setProjectSpecializations(p.id, this.projectModuleFormGroup.controls.specializations.value ?? [])
              .pipe(
                catchError(err => {
                  this.notificationService.error('Studiengänge konnten nicht gespeichert werden');
                  return of([]);
                })
              ),
            tags: this.tagService.setTagsForEntity(p.id, this.projectTagFormGroup.controls.tags.value ?? []).pipe(
              catchError(err => {
                this.notificationService.error('Tags konnten nicht gespeichert werden');
                return of([]);
              })
            ),
            project: of(p)
          })
        )
      )
      .subscribe({
        next: value => {
          this.notificationService.success('Projekt wurde erstellt');
          this.saved.emit(value.project);
        },
        error: err => {
          this.notificationService.error('Projekt konnte nicht erstellt werden');
        }
      });
  }
}
