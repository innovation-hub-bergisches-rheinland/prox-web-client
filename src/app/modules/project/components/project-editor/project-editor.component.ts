import { AfterViewInit, Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Observable, forkJoin, of } from 'rxjs';
import { catchError, map, mergeMap, startWith, tap, toArray } from 'rxjs/operators';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import { KeycloakService } from 'keycloak-angular';

import { ProjectService } from '@data/service/project.service';
import { TagService } from '@data/service/tag.service';
import { ToastService } from '@modules/toast/toast.service';
import { CreateProjectSchema, ModuleType, Project, Specialization } from '@data/schema/project-service.types';
import { Tag } from '@data/schema/tag.resource';
import { Context } from '@shared/components/context-selector/context-selector.component';

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
    supervisorName: ['', Validators.required],
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
  projectForm: FormGroup = this.formBuilder.group({
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
    private formBuilder: FormBuilder,
    private toastService: ToastService,
    private keycloakService: KeycloakService,
    @Inject(LOCAL_STORAGE) private storage: StorageService
  ) {}

  async ngOnInit() {
    // If user is logged in set its ID and Full Name
    if (await this.keycloakService.isLoggedIn()) {
      const userProfile = await this.keycloakService.loadUserProfile();
      const fullName = `${userProfile.firstName} ${userProfile.lastName}`;

      // TODO: Hacked to preserve default value in context selector
      this.projectForm.controls.information.get('context').setValue({
        id: userProfile.id,
        name: userProfile.username,
        discriminator: 'user'
      });

      const projectSupervisorControl = this.projectInformationFormGroup.controls.supervisorName;
      if (!projectSupervisorControl.value && this.keycloakService.isUserInRole('professor')) {
        projectSupervisorControl.setValue(fullName);
      }
    }

    this.specializations$ = this.projectService.getAllSpecializations();
    this.modules$ = this.projectModuleFormGroup.get('specializations').valueChanges.pipe(
      startWith([]),
      tap(v => console.log(v)),
      mergeMap((s: string[]) => {
        if (!s || s.length === 0) {
          return this.projectService.getAllModuleTypes();
        }
        return this.projectService.getModulesOfSpecializations(s);
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
    this.projectForm.controls.information.get('supervisorName').setValue(project.supervisorName);

    this.projectService.getSpecializationsOfProjectById(project.id).subscribe({
      next: value => this.projectModuleFormGroup.get('specializations').setValue(value.map(v => v.id))
    });

    this.projectService.getModulesOfProjectById(project.id).subscribe({
      next: value => this.projectModuleFormGroup.get('modules').setValue(value.map(v => v.id))
    });

    this.tagService.getAllTagsOfProject(project.id).subscribe({
      next: value => this.projectTagFormGroup.get('tags').setValue(value)
    });
  }

  buildProject(): CreateProjectSchema {
    const name = this.projectForm.value.information.name;
    const description = this.projectForm.value.information.description;
    const requirement = this.projectForm.value.information.requirement;
    const shortDescription = this.projectForm.value.information.shortDescription;
    const status = this.projectForm.value.information.status;
    const supervisorName = this.projectForm.value.information.supervisorName;

    return {
      shortDescription,
      status,
      description,
      supervisorName,
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
            modules: this.projectService
              .setProjectModules(p.id, this.projectModuleFormGroup.controls.modules.value ?? [])
              .pipe(catchError(err => of(err))),
            specializations: this.projectService
              .setProjectSpecializations(p.id, this.projectModuleFormGroup.controls.specializations.value ?? [])
              .pipe(catchError(err => of(err))),
            tags: this.createTags(this.projectTagFormGroup.controls.tags.value).pipe(
              mergeMap(tags => this.tagService.setProjectTags(p.id, tags).pipe(catchError(err => of(err))))
            ),
            project: of(p)
          })
        )
      )
      .subscribe({
        next: value => {
          this.toastService.showToast({
            message: 'Projekt wurde erfolgreich erstellt'
          });
          this.saved.emit(value.project);
        },
        error: err => {
          console.log(err);
          this.toastService.showToast({
            message: 'Projekt konnte nicht erstellt werden',
            isError: true
          });
        }
      });
  }

  private createTags(tags: Tag[]): Observable<Tag[]> {
    return of(...tags).pipe(
      mergeMap(tag =>
        this.tagService.findByTagName(tag.tagName).pipe(
          map(foundTags => {
            return { tag, foundTags };
          })
        )
      ),
      mergeMap(x => {
        if (x.foundTags.length >= 1) {
          return of(x.foundTags[0]);
        }
        return this.tagService.createTag(x.tag);
      }),
      toArray()
    );
  }
}
