import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

import { Observable, catchError, forkJoin, mergeMap, of, startWith } from 'rxjs';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import { KeycloakService } from 'keycloak-angular';

import { ProjectService } from '@data/service/project.service';
import { TagService } from '@data/service/tag.service';
import { CreateProposalSchema, ModuleType, Proposal, Specialization } from '@data/schema/project-service.types';
import { NotificationService } from '@shared/modules/notifications/notification.service';
import { Context } from '@shared/components/context-selector/context-selector.component';

@Component({
  selector: 'app-proposal-editor',
  templateUrl: './proposal-editor.component.html',
  styleUrls: ['./proposal-editor.component.scss']
})
export class ProposalEditorComponent implements OnInit {
  proposalInformationFormGroup = this.formBuilder.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    requirement: [''],
    context: []
  });
  porposalModuleFormGroup = this.formBuilder.group({
    specializations: [[]],
    modules: [[]]
  });
  proposalTagFormGroup = this.formBuilder.group({
    tags: [[]]
  });
  proposalFormGroup: UntypedFormGroup = this.formBuilder.group({
    information: this.proposalInformationFormGroup,
    module: this.porposalModuleFormGroup,
    tag: this.proposalTagFormGroup
  });

  @Input()
  proposal: Proposal;
  isEdit = false;

  @Output()
  saved = new EventEmitter<Proposal>();

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
      const id = this.keycloakService.getKeycloakInstance().subject;

      // TODO: Hacked to preserve default value in context selector
      this.proposalFormGroup.controls.information.get('context').setValue({
        id: userProfile.id,
        name: userProfile.username,
        discriminator: 'user'
      });
    }

    this.specializations$ = this.projectService.getAllSpecializations().pipe(
      catchError(err => {
        this.notificationService.error('Studiengänge konnten nicht geladen werden.');
        return of([]);
      })
    );
    this.modules$ = this.porposalModuleFormGroup.get('specializations').valueChanges.pipe(
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

    if (this.proposal) {
      await this.setValues(this.proposal);
      this.isEdit = true;
    }
  }

  async setValues(proposal: Proposal) {
    this.proposalFormGroup.controls.information.get('name').setValue(proposal.name);
    this.proposalFormGroup.controls.information.get('description').setValue(proposal.description);
    this.proposalFormGroup.controls.information.get('requirement').setValue(proposal.requirement);
    this.porposalModuleFormGroup.get('specializations').setValue(proposal.specializations.map(v => v.key));
    this.porposalModuleFormGroup.get('modules').setValue(proposal.modules.map(v => v.key));
    this.porposalModuleFormGroup.get('tags').setValue(proposal.tags);
  }

  buildProposal(): CreateProposalSchema {
    const name = this.proposalFormGroup.value.information.name;
    const description = this.proposalFormGroup.value.information.description;
    const requirement = this.proposalFormGroup.value.information.requirement;

    return {
      name,
      description,
      requirement
    };
  }

  onSave() {
    const proposal = this.buildProposal();
    let createOrUpdate$: Observable<Proposal>;
    if (this.isEdit) {
      createOrUpdate$ = this.projectService.updateProposal(this.proposal.id, proposal);
    } else {
      const context: Context = this.proposalFormGroup.value.information.context;
      if (!context) {
        createOrUpdate$ = this.projectService.createProposalForContext(proposal, {
          id: this.keycloakService.getKeycloakInstance().subject,
          discriminator: 'user'
        });
      } else {
        createOrUpdate$ = this.projectService.createProposalForContext(proposal, context);
      }
    }

    createOrUpdate$
      .pipe(
        mergeMap((p: Proposal) =>
          forkJoin({
            modules: this.projectService.setProposalModules(p.id, this.porposalModuleFormGroup.controls.modules.value ?? []).pipe(
              catchError(err => {
                this.notificationService.error('Module konnten nicht gespeichert werden');
                return of([]);
              })
            ),
            specializations: this.projectService
              .setProposalSpecializations(p.id, this.porposalModuleFormGroup.controls.specializations.value ?? [])
              .pipe(
                catchError(err => {
                  this.notificationService.error('Studiengänge konnten nicht gespeichert werden');
                  return of([]);
                })
              ),
            tags: this.tagService.synchronize(this.proposalTagFormGroup.controls.tags.value ?? []).pipe(
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
          this.notificationService.success('Idee wurde erstellt');
          this.saved.emit(value.project);
        },
        error: err => {
          console.error(err);
          this.notificationService.error('Idee konnte nicht erstellt werden');
        }
      });
  }
}
