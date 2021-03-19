import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import {
  MatAutocomplete,
  MatAutocompleteSelectedEvent,
  MatAutocompleteTrigger
} from '@angular/material/autocomplete';
import {
  MatChipInputEvent,
  MatChipSelectionChange
} from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';

import {
  forkJoin,
  interval,
  Observable,
  Observer,
  of,
  Subscription,
  throwError
} from 'rxjs';
import {
  debounceTime,
  filter,
  map,
  mergeMap,
  skip,
  switchMap,
  takeUntil,
  toArray,
  catchError
} from 'rxjs/operators';
import * as _ from 'underscore';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import { KeycloakService } from 'keycloak-angular';

import { Project } from '@data/schema/project.resource';
import { Tag } from '@data/schema/tag.resource';
import { ProjectService } from '@data/service/project.service';
import { TagService } from '@data/service/tag.service';
import { StudyCourse } from '@data/schema/study-course.resource';
import { Module } from '@data/schema/module.resource';

import { ModuleType } from '@data/schema/openapi/project-service/moduleType';
import { StudyProgram } from '@data/schema/openapi/project-service/studyProgram';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-project-editor',
  templateUrl: './project-editor.component.html',
  styleUrls: ['./project-editor.component.scss']
})
export class ProjectEditorComponent implements OnInit, OnDestroy {
  private STORAGE_KEY = 'project-editor-state';

  @Input() project?: Project;
  @Output() projectSaved = new EventEmitter<Project>();
  @Output() cancel = new EventEmitter<any>();

  projectFormControl: FormGroup;
  hasSubmitted = false;

  tags: Tag[] = [];
  filteredTags: Observable<Tag[]>;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  recommendedTags: Tag[] = [];

  @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>;
  @ViewChild('tagAuto') tagAutocomplete: MatAutocomplete;
  @ViewChild(MatAutocompleteTrigger)
  tagAutocompleteTrigger: MatAutocompleteTrigger;

  autoSave: Subscription;
  userID: string;
  fullname: string;

  modules: ModuleType[] = [];
  _moduleSelection: { module: ModuleType; selected: boolean }[] = [];

  constructor(
    private projectService: ProjectService,
    private tagService: TagService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private keycloakService: KeycloakService,
    @Inject(LOCAL_STORAGE) private storage: StorageService
  ) {}

  async ngOnInit() {
    if (await this.keycloakService.isLoggedIn()) {
      this.userID = this.keycloakService.getKeycloakInstance().subject;
      const userProfile = await this.keycloakService.loadUserProfile();
      this.fullname = `${userProfile.firstName} ${userProfile.lastName}`;
    }
    this.projectFormControl = this.formBuilder.group({
      name: ['', [Validators.required]],
      shortDescription: ['', [Validators.required]],
      requirement: [''],
      description: [''],
      supervisorName: ['', [Validators.required]],
      status: ['', [Validators.required]],
      moduleSelectors: this.formBuilder.array([]),
      tagInput: []
    });

    this.projectService.getAllModuleTypes().subscribe(
      res => {
        res.forEach(module => {
          this._moduleSelection.push({ module: module, selected: false });
          this.moduleSelectors.push(new FormControl(false));
        });
      },
      err => console.error(err),
      () => {
        if (!this.project) {
          this.tryLoadState();
        }
      }
    );

    this.filteredTags = this.projectFormControl.controls.tagInput.valueChanges.pipe(
      filter(value => (value ? value.length >= 2 : false)),
      debounceTime(200),
      switchMap(value =>
        this.tagService.findByTagName(value, false).pipe(
          catchError(error => {
            this.openErrorSnackBar(
              'Tags konnten nicht geladen werden! Versuchen Sie es später noch mal.'
            );
            return throwError(error);
          }),
          takeUntil(
            this.projectFormControl.controls.tagInput.valueChanges.pipe(skip(1))
          )
        )
      )
    );

    if (this.project) {
      this.clearStorage();
      this.fillInExistingProjectValues();
    } else {
      //Default value for supervisor when new project should be created
      this.projectFormControl.controls.supervisorName.setValue(this.fullname);
      this.enableAutosave();
    }
  }

  ngAfterViewChecked() {
    /*
     * When supvisorname is set programmatically in ngOnInit() it is not shown in the view so it is necessary to update the Value and validity
     * Possibly obsolete with Angular ~8
     */
    if (this.projectFormControl) {
      this.projectFormControl.updateValueAndValidity();
    }
  }

  enableAutosave() {
    const source = interval(5000);
    this.autoSave = source.subscribe(() => {
      this.saveState();
    });
  }

  ngOnDestroy() {
    if (this.autoSave) {
      this.autoSave.unsubscribe();
    }
  }

  saveState() {
    const state = this.projectFormControl.getRawValue();
    state.tags = this.tags;
    this.storage.set(this.STORAGE_KEY, JSON.stringify(state));
  }

  tryLoadState() {
    const loadedData = this.storage.get(this.STORAGE_KEY);
    if (loadedData) {
      const state = JSON.parse(loadedData);

      const modules: Array<boolean> = state.moduleSelectors;

      this.tags = state.tags;
      this.updateTagRecommendations();

      delete state.tags;
      delete state.studyCoursesModuleSelectors;

      this.projectFormControl.patchValue(state);
      console.log(modules);

      modules.forEach(
        (value, index) => (this._moduleSelection[index].selected = value)
      );
    }
  }

  clearStorage() {
    this.storage.remove(this.STORAGE_KEY);
  }

  get moduleSelectors(): FormArray {
    return this.projectFormControl.get('moduleSelectors') as FormArray;
  }

  addTag(event: MatChipInputEvent) {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      const tag = new Tag();
      tag.tagName = value.trim();
      this.tags.push(tag);
      this.updateTagRecommendations();
    }

    if (input) {
      input.value = '';
    }
    if (this.tagAutocomplete.isOpen) {
      this.tagAutocompleteTrigger.closePanel();
    }
  }

  removeTag(tag: Tag) {
    const index = this.tags.indexOf(tag);
    if (index >= 0) {
      this.tags.splice(index, 1);
      this.updateTagRecommendations();
    }
  }

  displayTagName(tag?: Tag): string | undefined {
    return tag ? tag.tagName : undefined;
  }

  recommendedTagSelected(tag: Tag, event: MatChipSelectionChange) {
    if (event.isUserInput) {
      this.addRecommendedTag(tag);
    }
  }

  addRecommendedTag(tag: Tag) {
    this.tags.push(tag);
    const index = this.recommendedTags.indexOf(tag);
    if (index !== -1) {
      this.recommendedTags.splice(index, 1);
    }
    this.tagService.getRecommendations(this.tags).subscribe(
      tags => {
        this.recommendedTags = tags;
      },
      () => {
        this.openErrorSnackBar(
          'Tags konnten nicht geladen werden! Versuchen Sie es später noch mal.'
        );
      }
    );
  }

  updateTagRecommendations() {
    const filteredTags = this.tags.filter(tag => tag.id != null);
    this.tagService.getRecommendations(filteredTags).subscribe(
      tags => {
        this.recommendedTags = tags;
      },
      () => {
        this.openErrorSnackBar(
          'Tags konnten nicht geladen werden! Versuchen Sie es später noch mal.'
        );
      }
    );
  }

  selectedTag(event: MatAutocompleteSelectedEvent): void {
    this.tags.push(event.option.value);
    this.updateTagRecommendations();
    this.tagInput.nativeElement.value = '';
    this.projectFormControl.controls.tagInput.setValue(null);
  }

  toggleModule(event: MatCheckboxChange) {
    const id = event.source.id;
    console.log(id);
    this._moduleSelection.find(m => m.module.id == id).selected = event.checked;
  }

  private getSelectedModules(): ModuleType[] {
    return this._moduleSelection
      .filter(m => m.selected == true)
      .map(m => m.module);
  }

  private getAggregatedSelectedModules() {
    console.log(this._moduleSelection);
    return _.chain(this.moduleSelectors.getRawValue())
      .pluck('selectedModules')
      .flatten()
      .uniq(x => {
        console.log(x);
        x.id;
      })
      .value();
  }

  /*private prepareStudyCourseSelectorData(
    modules: ModuleType[]
  ): Observable<StudyCourseModuleSelectionModel[]> {
    /*return Observable.create(
      (observer: Observer<StudyCourseModuleSelectionModel[]>) => {
        const observables: Observable<{
          module: ModuleType;
          studyCourse: StudyProgram;
        }>[] = [];

        for (const module of modules) {
          observables.push(
            this.projectModuleService.findStudyCourseOfModule(module.id).pipe(
              map(course => {
                return { module, studyCourse: course };
              })
            )
          );
        }

        forkJoin(observables).subscribe(
          success => {
            const result = _.chain(success)
              .groupBy(element => element.studyCourse.id)
              .map(element => element)
              .map(element => {
                return new StudyCourseModuleSelectionModel(
                  element[0].studyCourse,
                  element.map(x => x.module)
                );
              })
              .value();
            observer.next(result);
            observer.complete();
          },
          error => {
            this.showSubmitInfo('Fehler beim parsen der Module');
            console.error('module parsing error', error);
            observer.complete();
          }
        );
      }
    );
    return of();
  }*/

  private fillInExistingProjectValues() {
    this.projectFormControl.controls.name.setValue(this.project.name);
    this.projectFormControl.controls.shortDescription.setValue(
      this.project.shortDescription
    );
    this.projectFormControl.controls.requirement.setValue(
      this.project.requirement
    );
    this.projectFormControl.controls.description.setValue(
      this.project.description
    );
    this.projectFormControl.controls.supervisorName.setValue(
      this.project.supervisorName
    );
    this.projectFormControl.controls.status.setValue(this.project.status);

    this.projectService.getModulesOfProject(this.project).subscribe(modules => {
      modules.forEach(module =>
        this.moduleSelectors.controls[module.id].setValue(true)
      );
    });

    this.projectService.getModulesOfProject(this.project).subscribe(modules => {
      modules.forEach(
        module =>
          (this._moduleSelection.find(
            m => m.module.id == module.id
          ).selected = true)
      );
    });

    this.tagService.getAllTagsOfProject(this.project.id).subscribe(tags => {
      this.tags = tags;
      this.updateTagRecommendations();
    });
  }

  private createTags(tags: Tag[]): any {
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

  private createProjectResource(project: Project): Project {
    let projectResource: Project;
    if (this.project) {
      projectResource = this.project;
    } else {
      projectResource = new Project();
    }

    projectResource.creatorID = this.userID;
    projectResource.creatorName = this.fullname.trim();

    projectResource.shortDescription = project.shortDescription.trim();
    projectResource.requirement = project.requirement.trim();
    projectResource.description = project.description.trim();
    projectResource.name = project.name.trim();
    projectResource.status = project.status;

    if (project.supervisorName.length === 0) {
      projectResource.supervisorName = projectResource.creatorName;
    } else {
      projectResource.supervisorName = project.supervisorName.trim();
    }

    return projectResource;
  }

  private createProject(project: Project, modules: ModuleType[], tags: Tag[]) {
    const newProject = this.createProjectResource(project);

    this.projectService.createProject(newProject, tags, modules).subscribe(
      () => {
        this.showSubmitInfo('Projekt wurde erfolgreich erstellt');
        this.clearStorage();
        this.projectSaved.emit(newProject);
      },
      error => {
        this.showSubmitInfo('Fehler beim Bearbeiten der Anfrage');
        this.hasSubmitted = false;
        console.error('project service error', error);
      }
    );
  }

  private updateProject(project: Project, modules: ModuleType[], tags: Tag[]) {
    this.project = this.createProjectResource(project);

    this.projectService.updateProject(this.project, tags, modules).subscribe(
      () => {
        this.showSubmitInfo('Projekt wurde erfolgreich bearbeitet');
        this.projectSaved.emit(this.project);
      },
      error => {
        this.showSubmitInfo('Fehler beim Bearbeiten der Anfrage');
        this.hasSubmitted = false;
        console.error('project service error', error);
      }
    );
  }

  onSubmit(project: Project) {
    this.hasSubmitted = true;

    const modules = this.getSelectedModules();
    console.log(modules);
    this.createTags(this.tags).subscribe(tags => {
      if (this.project) {
        this.updateProject(project, modules, tags as Tag[]);
      } else {
        this.createProject(project, modules, tags as Tag[]);
      }
    });
  }

  private showSubmitInfo(message: string) {
    this.snackBar.open(message, null, {
      duration: 2000
    });
  }

  openErrorSnackBar(message: string) {
    this.snackBar.open(message, 'Verstanden');
  }

  cancelButtonClicked() {
    this.cancel.emit();
    this.clearStorage();
  }
}
