import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import { KeycloakService } from 'keycloak-angular';

import { ProjectService } from '@data/service/project.service';
import { TagService } from '@data/service/tag.service';
import { NotificationService } from '@shared/modules/notifications/notification.service';
import { CreateProjectRequest, Project } from '@data/schema/project.types';
import { InformationFormGroup } from './project-editor-information/project-editor-information.component';
import { CurriculumFormGroup } from './project-editor-module/project-editor-module.component';
import { combineLatestWith, forkJoin, map, mergeMap, of, share } from 'rxjs';
import { MiscFormGroup } from './project-editor-misc/project-editor-misc.component';
import moment from 'moment';
import { UserService } from '@data/service/user.service';

@Component({
  selector: 'app-project-editor',
  templateUrl: './project-editor.component.html',
  styleUrls: ['./project-editor.component.scss']
})
export class ProjectEditorComponent implements OnInit {
  projectInformationFormGroup = new FormGroup<InformationFormGroup>({
    title: new FormControl('', Validators.required),
    summary: new FormControl('', Validators.required),
    description: new FormControl(''),
    requirement: new FormControl(''),
    supervisors: new FormControl(),
    partner: new FormControl()
  });
  projectCurriculumFormGroup = new FormGroup<CurriculumFormGroup>({
    disciplines: new FormControl<string[]>([]),
    modules: new FormControl<string[]>([])
  });
  projectMiscFormGroup = new FormGroup<MiscFormGroup>({
    tags: new FormControl([]),
    range: new FormGroup({
      beginDate: new FormControl(null),
      endDate: new FormControl(null)
    })
  });
  projectForm = new FormGroup({
    information: this.projectInformationFormGroup,
    curriculum: this.projectCurriculumFormGroup,
    misc: this.projectMiscFormGroup
  });

  @Input()
  project: Project;

  @Input()
  type: 'PROPOSAL' | 'PROJECT';

  isEdit = false;

  @Output()
  saved = new EventEmitter<Project>();

  constructor(
    private projectService: ProjectService,
    private tagService: TagService,
    private notificationService: NotificationService,
    private keycloakService: KeycloakService,
    private userService: UserService
  ) {}

  async ngOnInit() {
    const projectSupervisorControl = this.projectInformationFormGroup.controls.supervisors;
    const isProposal = this.type === 'PROPOSAL' || this.project?.status?.state === 'PROPOSED';
    const isProject = this.type === 'PROJECT' || (this.project?.status?.state !== undefined && !isProposal);

    if (isProposal) {
      projectSupervisorControl.disable();
    }

    if (isProject && (await this.keycloakService.isLoggedIn())) {
      const projectSupervisorControl = this.projectInformationFormGroup.controls.supervisors;

      if (!projectSupervisorControl.value) {
        this.userService.getCurrentAuthenticated().subscribe({
          next: profile => {
            projectSupervisorControl.setValue([
              {
                userId: profile.userId,
                displayName: profile.displayName,
                removable: false
              }
            ]);
          }
        });
      }
    }

    if (this.project) {
      await this.setProjectValues(this.project);
      this.isEdit = true;
    }
  }

  async setProjectValues(project: Project) {
    this.projectForm.controls.information.controls.title.setValue(project.title);
    this.projectForm.controls.information.controls.summary.setValue(project.summary);
    this.projectForm.controls.information.controls.description.setValue(project.description);
    this.projectForm.controls.information.controls.requirement.setValue(project.requirement);
    this.projectForm.controls.information.controls.supervisors.setValue(
      project.supervisors.map(s => ({ userId: s.id, displayName: s.name }))
    );
    this.projectForm.controls.information.controls.partner.setValue(project.partner?.id);

    const disciplines = project.curriculumContext?.disciplines?.map(discipline => discipline.key) ?? [];
    const modules = project.curriculumContext?.moduleTypes?.map(module => module.key) ?? [];

    this.projectForm.controls.curriculum.controls.disciplines.setValue(disciplines);
    this.projectForm.controls.curriculum.controls.modules.setValue(modules);

    this.projectForm.controls.misc.controls.tags.setValue(project.tags.map(tag => tag.tagName));

    if (project.timeBox?.start) {
      this.projectForm.controls.misc.controls.range.controls.beginDate.setValue(moment(project.timeBox?.start));
    }
    if (project.timeBox?.end) {
      this.projectForm.controls.misc.controls.range.controls.endDate.setValue(moment(project.timeBox?.end));
    }
  }

  buildProject(): CreateProjectRequest {
    const disciplines = this.projectForm.controls.curriculum.controls.disciplines.value;
    const modules = this.projectForm.controls.curriculum.controls.modules.value;

    const project: CreateProjectRequest = {
      title: this.projectForm.controls.information.controls.title.value,
      summary: this.projectForm.controls.information.controls.summary.value,
      description: this.projectForm.controls.information.controls.description.value,
      requirement: this.projectForm.controls.information.controls.requirement.value,
      context: {
        disciplineKeys: disciplines,
        moduleTypeKeys: modules
      },
      timeBox: {
        start: this.projectForm.controls.misc.controls.range.controls.beginDate.value?.toISOString(),
        end: this.projectForm.controls.misc.controls.range.controls.endDate.value?.toISOString()
      },
      partnerId: this.projectForm.controls.information.controls.partner.value,
      supervisors: this.projectForm.controls.information.controls.supervisors.value?.map(s => s.userId)
    };

    return project;
  }

  onSave() {
    const project = this.buildProject();
    const tags = this.projectForm.controls.misc.controls.tags.value;

    // TODO: I love angular and observables... This would be so much easier with async/await.
    // TODO: This is a mess. I need to refactor this.

    const project$ = (
      this.isEdit ? this.projectService.updateProject(this.project.id, project) : this.projectService.createProject(project)
    ).pipe(share());
    const tags$ = tags ? this.tagService.synchronize(tags).pipe(map(tags => tags.tags.map(tag => tag.id))) : of([]);
    const setTags$ = project$.pipe(
      combineLatestWith(tags$),
      mergeMap(([project, tags]) => {
        return this.projectService.setProjectTags(project.id, tags);
      })
    );

    forkJoin({
      project: project$,
      tags: setTags$
    }).subscribe({
      next: value => {
        this.notificationService.success('Projekt wurde erfolgreich gespeichert');
        this.saved.emit(value.project);
      },
      error: err => {
        this.notificationService.error('Ein Fehler beim Speichern des Projekts ist aufgetreten. Versuchen Sie es später erneut.');
      }
    });
  }
}
