import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  AfterViewInit,
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
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  catchError,
  concatAll
} from 'rxjs/operators';
import * as _ from 'lodash';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import { KeycloakService } from 'keycloak-angular';

import { Tag } from '@data/schema/tag.resource';
import { ProjectService } from '@data/service/project.service';
import { TagService } from '@data/service/tag.service';

import { MatTableDataSource } from '@angular/material/table';
import { SelectionChange, SelectionModel } from '@angular/cdk/collections';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatSort } from '@angular/material/sort';
import {
  MatCheckboxDefaultOptions,
  MAT_CHECKBOX_DEFAULT_OPTIONS
} from '@angular/material/checkbox';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastService } from '@modules/toast/toast.service';
import { Toast } from '@modules/toast/types';
import {
  CreateProjectSchema,
  Project,
  StudyProgram
} from '@data/schema/project-service.types';

interface ModuleType {
  id: string;
}

@Component({
  selector: 'app-project-editor',
  templateUrl: './project-editor.component.html',
  styleUrls: ['./project-editor.component.scss'],
  providers: [
    {
      /* Change the default click behaviour of MatCheckbox to no operation
       * as the selection is determined by a selection model
       * NOTE: This will possibly affect every checkbox in this component
       * */
      provide: MAT_CHECKBOX_DEFAULT_OPTIONS,
      useValue: { clickAction: 'noop' } as MatCheckboxDefaultOptions
    }
  ]
})
export class ProjectEditorComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  private STORAGE_KEY = 'project-editor-state';

  hasSubmitted = false;
  private projectId?: string = undefined;
  @Output() projectSaved = new EventEmitter<Project>();
  @Output() cancel = new EventEmitter<any>();
  @Output() markDraft = new EventEmitter<boolean>();

  projectFormControl: FormGroup = this.formBuilder.group({
    name: ['', [Validators.required]],
    shortDescription: ['', [Validators.required]],
    requirement: [''],
    description: [''],
    supervisorName: [''],
    status: ['', [Validators.required]],
    tagInput: []
  });

  tags: Tag[] = [];
  filteredTags: Observable<Tag[]>;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  recommendedTags: Tag[] = [];

  @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>;
  @ViewChild('tagAuto') tagAutocomplete: MatAutocomplete;
  @ViewChild(MatAutocompleteTrigger)
  tagAutocompleteTrigger: MatAutocompleteTrigger;

  autoSave: Subscription;
  userID = '';
  fullName = '';

  private _modules: ModuleType[] = [];
  private _studyPrograms: StudyProgram[] = [];
  dataSource = new MatTableDataSource<ModuleType>(this.modules);
  displayedColumns: string[] = ['select', 'name'];
  moduleSelection: ModuleType[] = [];
  preselectedModules: ModuleType[] = [];
  studyProgramSelection = new SelectionModel<StudyProgram>(true);

  get moduleSelectors(): FormArray {
    return this.projectFormControl.get('moduleSelectors') as FormArray;
  }

  set modules(modules: ModuleType[]) {
    this._modules = modules;
  }

  get modules(): ModuleType[] {
    return this._modules;
  }

  set studyPrograms(studyPrograms: StudyProgram[]) {
    this._studyPrograms = studyPrograms;
  }

  get studyPrograms(): StudyProgram[] {
    return this._studyPrograms.sort((a, b) => a.name.localeCompare(b.name));
  }

  get isProfessor(): boolean {
    return this.keycloakService.isUserInRole('professor');
  }

  get _project(): CreateProjectSchema {
    return {
      creatorName: this.fullName,
      shortDescription: this.projectFormControl.value.shortDescription.trim(),
      requirement: this.projectFormControl.value.requirement.trim(),
      description: this.projectFormControl.value.description.trim(),
      name: this.projectFormControl.value.name.trim(),
      status: this.projectFormControl.value.status.trim(),
      supervisorName: this.projectFormControl.value.supervisorName.trim()
    };
  }

  set _project(project: CreateProjectSchema) {
    this.projectFormControl.setValue(
      {
        name: project.name ?? '',
        shortDescription: project.shortDescription ?? '',
        requirement: project.requirement ?? '',
        description: project.description ?? '',
        supervisorName: project.supervisorName ?? '',
        status: project.status ?? 'VERFÜGBAR',
        tagInput: ''
      },
      {
        emitEvent: false
      }
    );

    if (this.isEditProject()) {
      this.projectService.getModulesOfProjectById(this.projectId).subscribe({
        next: modules => (this.preselectedModules = modules)
      });

      this.tagService.getAllTagsOfProject(this.projectId).subscribe(tags => {
        this.tags = tags;
        this.updateTagRecommendations();
      });
    }
  }

  @Input()
  set project(project: Project) {
    if (project) {
      this.projectId = project.id;
      this._project = project;
    }
  }

  @ViewChild(MatSort) set matSort(sort: MatSort) {
    this.dataSource.sort = sort;
  }

  isEditProject(): boolean {
    return !!this.projectId;
  }

  /**
   * Constructor
   * @param projectService Service for prox-project-service
   * @param tagService Service for prox-tag-service
   * @param formBuilder FormBuilder to build a form out of editors input elements
   * @param snackBar MatSnackBar for errors
   * @param keycloakService Service for Keycloak
   * @param storage Service for local Storage
   */
  constructor(
    private projectService: ProjectService,
    private tagService: TagService,
    private formBuilder: FormBuilder,
    private toastService: ToastService,
    private keycloakService: KeycloakService,
    @Inject(LOCAL_STORAGE) private storage: StorageService
  ) {
    forkJoin({
      studyPrograms: this.projectService.getAllStudyPrograms(),
      moduleTypes: this.projectService.getAllModuleTypes()
    }).subscribe({
      next: res => {
        this.studyPrograms.push(...res.studyPrograms);
        this.modules.push(...res.moduleTypes);
      },
      error: err => console.error(err),
      complete: () => {
        this.dataSource._updateChangeSubscription();

        const project = this._project;
        if (
          (!project.supervisorName ||
            project.supervisorName.trim().length === 0) &&
          this.keycloakService.isUserInRole('professor')
        ) {
          project.supervisorName = this.fullName;
          this._project = project as CreateProjectSchema;
        }

        this.enableAutosave();
        this.tryLoadState();
      }
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.data = this.modules;
  }

  /**
   * Initialize Angular Component
   */
  async ngOnInit() {
    // If user is logged in set its ID and Full Name
    if (await this.keycloakService.isLoggedIn()) {
      this.userID = this.keycloakService.getKeycloakInstance().subject;
      const userProfile = await this.keycloakService.loadUserProfile();
      this.fullName = `${userProfile.firstName} ${userProfile.lastName}`;
    }

    this.filteredTags =
      this.projectFormControl.controls.tagInput.valueChanges.pipe(
        filter(value => (value ? value.length >= 2 : false)),
        debounceTime(200),
        switchMap(value =>
          this.tagService.findByTagName(value, false).pipe(
            catchError(error => {
              this.toastService.showToasts([
                {
                  message:
                    'Tags konnten nicht geladen werden! Versuchen Sie es später noch mal.'
                }
              ]);
              return throwError(() => error);
            }),
            takeUntil(
              this.projectFormControl.controls.tagInput.valueChanges.pipe(
                skip(1)
              )
            )
          )
        )
      );
  }

  /**
   * Initialize autosave
   * TODO refactor
   */
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

  /**
   * save the current state into local storage
   */
  saveState() {
    // Get from storage
    let storage: Array<Project & { tags?: Tag[] }> = this.loadDataFromStorage();
    const state = this.projectFormControl.getRawValue();
    state.tags = this.tags;
    state.id = this.projectId;

    // Does an item already exist?
    const index = storage.findIndex(i => i.id === this.projectId);
    if (index === -1) {
      storage.push(state);
    } else {
      // Replace all possible items
      const newArr = storage.filter(i => i.id !== this.projectId);
      newArr.push(state);
      storage = newArr;
    }

    this.storage.set(this.STORAGE_KEY, JSON.stringify(storage));
  }

  /**
   * load the state from local storage and set form control values
   */
  tryLoadState() {
    const loadedData: Array<Project & { tags?: Tag[] }> =
      this.loadDataFromStorage();
    const state = loadedData.find(p => p.id === this.projectId);

    if (state) {
      this.tags = state.tags;
      this.updateTagRecommendations();
      delete state.tags;
      this.projectFormControl.patchValue(state);
      this.markDraft.emit(true);
    }
  }

  /**
   * Removes the data from local storage
   */
  clearStorage() {
    const storage = this.storage.get(this.STORAGE_KEY);
    let loadedData: Array<Project & { tags?: Tag[] }> = [];
    if (storage) {
      try {
        loadedData = JSON.parse(storage);
      } catch (e) {
        console.warn({
          message: 'Could not parse storage, resetting',
          error: e
        });
        this.clearStorage();
      }
    }

    const state = loadedData.filter(p => p.id !== this.projectId);
    this.storage.set(this.STORAGE_KEY, JSON.stringify(state));
  }

  private loadDataFromStorage(): Array<Project & { tags?: Tag[] }> {
    const storage = this.storage.get(this.STORAGE_KEY);
    let loadedData: Array<Project & { tags?: Tag[] }> = [];
    if (storage) {
      try {
        const storageData = JSON.parse(storage);
        if (storageData && Array.isArray(storageData)) {
          loadedData = storageData;
        } else {
          this.storage.set(this.STORAGE_KEY, []);
        }
      } catch (e) {
        console.warn({
          message: 'Could not parse storage, resetting',
          error: e
        });
        this.storage.set(this.STORAGE_KEY, []);
      }
    }
    return loadedData;
  }

  /**
   * Add the tag which is created or selected from form control to project data
   * @param event event emittet from matChipInputTokenEnd
   */
  addTagEvent(event: MatChipInputEvent) {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      const tag = new Tag();
      tag.tagName = value;
      this.addTag(tag);
    }

    if (input) {
      input.value = '';
    }

    this.tagAutocompleteTrigger.closePanel();
    this.projectFormControl.controls.tagInput.setValue(null, {
      emitEvent: false
    });
  }

  /**
   * function which adds a tag to project data. The tag should be only added
   * if it is unique in the list
   * @param tag tag to add to project data
   */
  private addTag(tag: Tag) {
    if (this.tags.filter(t => t.tagName === tag.tagName).length === 0) {
      this.tags.push(tag);
      this.updateTagRecommendations();
    }
  }

  /**
   * Add selected tag from autocompletion to project data
   * @param event event emitted when tag from autocompletion is selected
   */
  selectedTag(event: MatAutocompleteSelectedEvent): void {
    const selectedTag = event.option.value as Tag;
    this.addTag(selectedTag);
    this.tagInput.nativeElement.value = '';
    this.projectFormControl.controls.tagInput.setValue(null, {
      emitEvent: false
    });
  }

  /**
   * Remove tag from project data
   * @param tag Tag to remove
   */
  removeTag(tag: Tag) {
    const index = this.tags.indexOf(tag);
    if (index >= 0) {
      this.tags.splice(index, 1);
      this.updateTagRecommendations();
    }
  }

  /**
   * Action to perform when a recommended tag is selected
   * @param tag selected tag from recommendations
   * @param event emitted event
   */
  recommendedTagSelected(tag: Tag, event: MatChipSelectionChange) {
    if (event.isUserInput) {
      this.addRecommendedTag(tag);
    }
  }

  /**
   * Add the recommended tag to project data
   * @param tag Recommended tag to add
   */
  addRecommendedTag(tag: Tag) {
    this.addTag(tag);

    // Remove added tag from recommendations - necessary for the case when the tag service can not load recommendations
    const index = this.recommendedTags.indexOf(tag);
    if (index !== -1) {
      this.recommendedTags.splice(index, 1);
    }

    // Recalculate recommendations
    this.updateTagRecommendations();
  }

  /**
   * Update the tag recommendations based on currently selected tags
   */
  private updateTagRecommendations() {
    const filteredTags = this.tags.filter(tag => tag.id); // Must have a id
    this.tagService.getRecommendations(filteredTags).subscribe(
      tags => {
        /**
         * Filter out tags which are already in the input field
         * This occures when the user manually inputs a tag which already exists in the backend.
         */
        this.recommendedTags = tags.filter(
          t => this.tags.filter(t1 => t1.tagName === t.tagName).length === 0
        );
      },
      () => {
        this.toastService.showToasts([
          {
            message:
              'Tags konnten nicht geladen werden! Versuchen Sie es später noch mal.'
          }
        ]);
      }
    );
  }

  /**
   * This function creates non-existent tags in backend and will
   * retrieve tags which already exist and can be used to prevent collisions
   * @param tags tags which should be created
   * @returns created and retrieved tags
   */
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

  /**
   * Form Submit method
   * @param project project which is submitted
   */
  onSubmit(project: CreateProjectSchema) {
    this.hasSubmitted = true;
    // Decide whether a project should be updated or created
    const createOrUpdateProject = this.isEditProject()
      ? this.projectService.updateProject(this.projectId, project)
      : this.projectService.createProject(project);
    const selectedModules = this.moduleSelection;

    createOrUpdateProject
      .pipe(
        mergeMap((p: Project) =>
          forkJoin({
            modules: this.projectService
              .setProjectModules(p.id, selectedModules)
              .pipe(catchError(err => of(err))),
            tags: this.createTags(this.tags).pipe(
              mergeMap(tags =>
                this.tagService
                  .setProjectTags(p.id, tags)
                  .pipe(catchError(err => of(err)))
              )
            ),
            project: of(p)
          })
        )
      )
      .subscribe({
        next: res => {
          const toasts: Toast[] = [
            {
              message: 'Projekt wurde erfolgreich erstellt'
            }
          ];
          if (res.modules instanceof HttpErrorResponse) {
            toasts.push({
              message:
                'Module konnten nicht gespeichert werden, versuchen Sie es später erneut.',
              isError: true
            });
          }
          if (res.tags instanceof HttpErrorResponse) {
            toasts.push({
              message:
                'Tags konnten nicht gespeichert werden, versuchen Sie es später erneut.',
              isError: true
            });
          }
          this.toastService.showToasts(toasts);
          this.clearStorage();
          this.projectSaved.emit(res.project);
        },
        error: err => {
          console.error(err);
          const toasts: Toast[] = [
            {
              message:
                'Projekt konnte nicht gespeichert werden, versuchen Sie es später nochmal'
            }
          ];
          this.toastService.showToasts(toasts);
        },
        complete: () => {}
      });
  }

  onModuleSelectionChange(event: SelectionChange<ModuleType>) {
    this.moduleSelection.push(...event.added);
    this.moduleSelection = this.moduleSelection.filter(
      ms => !event.removed.some(r => r.id === ms.id)
    );
  }

  cancelButtonClicked() {
    this.cancel.emit();
    this.clearStorage();
  }
}
