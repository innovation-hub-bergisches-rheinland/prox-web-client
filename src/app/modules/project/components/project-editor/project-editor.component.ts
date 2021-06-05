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
  catchError
} from 'rxjs/operators';
import * as _ from 'lodash';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import { KeycloakService } from 'keycloak-angular';

import { Project } from '@data/schema/project.resource';
import { Tag } from '@data/schema/tag.resource';
import { ProjectService } from '@data/service/project.service';
import { TagService } from '@data/service/tag.service';

import { ModuleType } from '@data/schema/openapi/project-service/moduleType';
import { StudyProgram } from '@data/schema/openapi/project-service/studyProgram';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatSort } from '@angular/material/sort';
import {
  MatCheckboxDefaultOptions,
  MAT_CHECKBOX_DEFAULT_OPTIONS
} from '@angular/material/checkbox';

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
  private STORAGE_PRE_SELECTED_KEY = 'project-editor-preselected';

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

  private _modules: ModuleType[] = [];
  private _studyPrograms: StudyProgram[] = [];
  dataSource = new MatTableDataSource<ModuleType>(this.modules);
  displayedColumns: string[] = ['select', 'name'];
  moduleSelection = new SelectionModel<ModuleType>(true);
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

  @ViewChild(MatSort) set matSort(sort: MatSort) {
    this.dataSource.sort = sort;
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
    private snackBar: MatSnackBar,
    private keycloakService: KeycloakService,
    @Inject(LOCAL_STORAGE) private storage: StorageService
  ) {}

  ngAfterViewInit(): void {
    this.dataSource.data = this.modules;
  }

  /**
   * Initialize Angular Component
   */
  async ngOnInit() {
    //If user is logged in set its ID and Full Name
    if (await this.keycloakService.isLoggedIn()) {
      this.userID = this.keycloakService.getKeycloakInstance().subject;
      const userProfile = await this.keycloakService.loadUserProfile();
      this.fullname = `${userProfile.firstName} ${userProfile.lastName}`;
    }

    //Build the form
    this.projectFormControl = this.formBuilder.group({
      name: ['', [Validators.required]],
      shortDescription: ['', [Validators.required]],
      requirement: [''],
      description: [''],
      supervisorName: [''],
      status: ['', [Validators.required]],
      tagInput: []
    });

    forkJoin({
      studyPrograms: this.projectService.getAllStudyPrograms(),
      moduleTypes: this.projectService.getAllModuleTypes()
    }).subscribe(
      res => {
        this.studyPrograms.push(...res.studyPrograms);
        this.modules.push(...res.moduleTypes);
        this.tryLoadSelectedStudyPrograms();
      },
      err => console.error(err),
      () => {
        this.dataSource._updateChangeSubscription();
        //State can only be loaded this observable is completed as the form controls are initialized here
        if (!this.project) {
          this.tryLoadState();
        }
      }
    );

    this.filteredTags =
      this.projectFormControl.controls.tagInput.valueChanges.pipe(
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
              this.projectFormControl.controls.tagInput.valueChanges.pipe(
                skip(1)
              )
            )
          )
        )
      );

    //If the component has project as input try load it's values into the editor
    if (this.project) {
      this.clearStorage();
      this.fillInExistingProjectValues();
    } else {
      if (this.keycloakService.isUserInRole('professor')) {
        //Default value for supervisor when new project should be created
        this.projectFormControl.controls.supervisorName.setValue(this.fullname);
      }
      this.enableAutosave();
    }
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
    const state = this.projectFormControl.getRawValue();
    state.tags = this.tags;
    this.storage.set(this.STORAGE_KEY, JSON.stringify(state));
    this.saveSelectedStudyPrograms();
  }

  /**
   * load the state from local storage and set form control values
   */
  tryLoadState() {
    const loadedData = this.storage.get(this.STORAGE_KEY);
    if (loadedData) {
      const state = JSON.parse(loadedData);

      this.tags = state.tags;
      this.updateTagRecommendations();
      delete state.tags;

      this.projectFormControl.patchValue(state);
    }
  }

  saveSelectedStudyPrograms() {
    this.storage.set(
      this.STORAGE_PRE_SELECTED_KEY,
      JSON.stringify(this.studyProgramSelection.selected.filter(sp => sp.id))
    );
  }

  tryLoadSelectedStudyPrograms() {
    const loadedData = this.storage.get(this.STORAGE_PRE_SELECTED_KEY);
    if (loadedData) {
      const state: StudyProgram[] = JSON.parse(loadedData);
      this.studyProgramSelection.select(
        ...this.studyPrograms.filter(sp => state.map(s => s.id).includes(sp.id))
      );
    } else {
      this.studyProgramSelection.select(...this.studyPrograms);
    }
    this.filterModuleTypes();
  }

  /**
   * Removes the data from local storage
   */
  clearStorage() {
    this.storage.remove(this.STORAGE_KEY);
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
    this.projectFormControl.controls.tagInput.setValue(null);
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
    this.projectFormControl.controls.tagInput.setValue(null);
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
  private addRecommendedTag(tag: Tag) {
    this.addTag(tag);

    //Remove added tag from recommendations - necessary for the case when the tag service can not load recommendations
    const index = this.recommendedTags.indexOf(tag);
    if (index !== -1) {
      this.recommendedTags.splice(index, 1);
    }

    //Recalculate recommendations
    this.updateTagRecommendations();
  }

  /**
   * Update the tag recommendations based on currently selected tags
   */
  private updateTagRecommendations() {
    const filteredTags = this.tags.filter(tag => tag.id); //Must have a id
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
        this.openErrorSnackBar(
          'Tags konnten nicht geladen werden! Versuchen Sie es später noch mal.'
        );
      }
    );
  }

  /**
   * Procedural method to set input element values to project values
   */
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

    this.projectService
      .getModulesOfProject(this.project)
      .subscribe(modules =>
        modules.forEach(m =>
          this.modules
            .filter(m1 => m1.id === m.id)
            .forEach(m2 => this.moduleSelection.select(m2))
        )
      );

    this.tagService.getAllTagsOfProject(this.project.id).subscribe(tags => {
      this.tags = tags;
      this.updateTagRecommendations();
    });
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
   * Function which creates a valid project resource based on the given input params
   * It mainly trims strings and sets possible default values
   * @param project project to parse
   * @returns valid project resource
   */
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

    if (
      project.supervisorName.length === 0 &&
      this.keycloakService.isUserInRole('professor')
    ) {
      projectResource.supervisorName = projectResource.creatorName;
    } else if (this.keycloakService.isUserInRole('company-manager')) {
      projectResource.supervisorName = null;
    } else {
      projectResource.supervisorName = project.supervisorName.trim();
    }

    return projectResource;
  }

  /**
   * Creates a new project in backend
   * @param project project to create
   * @param modules moduleTypes of project
   * @param tags tags of project
   */
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

  /**
   * Updates a existing project in backend
   * @param project project to update
   * @param modules moduleTypes of project
   * @param tags tags of project
   */
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

  /**
   * Form Submit method
   * @param project project which is submitted
   */
  onSubmit(project: Project) {
    this.hasSubmitted = true;

    const modules = this.moduleSelection.selected;
    this.createTags(this.tags).subscribe(tags => {
      if (this.project) {
        this.updateProject(project, modules, tags);
      } else {
        this.createProject(project, modules, tags);
      }
    });

    this.saveSelectedStudyPrograms();
  }

  private showSubmitInfo(message: string) {
    this.snackBar.open(message, null, {
      duration: 2000
    });
  }

  private openErrorSnackBar(message: string) {
    this.snackBar.open(message, 'Verstanden');
  }

  cancelButtonClicked() {
    this.cancel.emit();
    this.clearStorage();
  }

  /**
   * Called when the studyPrograms value is changed
   * @param event Event emitted
   * @param studyProgram studyProgram
   */
  toggleStudyProgram(event: MatSlideToggleChange, studyProgram: StudyProgram) {
    //TODO Possible refactor -> maybe a template binding?
    if (event.checked) {
      this.studyProgramSelection.select(studyProgram);
    } else {
      this.studyProgramSelection.deselect(studyProgram);
    }

    this.filterModuleTypes();
  }

  /**
   * Filters Module types based on the study program selectio
   */
  filterModuleTypes() {
    //TODO Refactor: Make use of debounceTime to reduce network traffic
    if (this.studyProgramSelection.selected.length > 0) {
      this.projectService
        .getAllModuleTypesOfStudyprograms(
          this.studyProgramSelection.selected.map(sp => sp.id)
        )
        .subscribe(res => {
          //Elements to add
          const diffA = _.differenceWith(res, this.modules, _.isEqual);

          //Elements to remove
          const diffB = _.differenceWith(this.modules, res, _.isEqual);

          //Add elements
          this.modules.push(...diffA);

          //Pull elements to remove out - this mutates this.modules
          _.pullAllWith(this.modules, diffB, _.isEqual);

          this.dataSource.data = this.modules;
          this.dataSource._updateChangeSubscription();
        });
    } else {
      this.dataSource.data = this.modules = [];
      this.dataSource._updateChangeSubscription();
    }
  }

  selectModule(element: ModuleType) {
    this.moduleSelection.toggle(element);
  }
}
