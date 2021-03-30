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

import { interval, Observable, of, Subscription, throwError } from 'rxjs';
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

import { ModuleType } from '@data/schema/openapi/project-service/moduleType';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { StudyProgram } from '@data/schema/openapi/project-service/studyProgram';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import * as Module from 'node:module';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-project-editor',
  templateUrl: './project-editor.component.html',
  styleUrls: ['./project-editor.component.scss']
})
export class ProjectEditorComponent
  implements OnInit, OnDestroy, AfterViewInit {
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

  private _modules: ModuleType[] = [];
  studyPrograms: StudyProgram[] = [];
  dataSource = new MatTableDataSource<ModuleType>(this.modules);
  displayedColumns: string[] = ['select', 'name'];
  moduleSelection = new SelectionModel<ModuleType>(true, []);
  studyProgramSelection = new SelectionModel<StudyProgram>(true, []);

  get moduleSelectors(): FormArray {
    return this.projectFormControl.get('moduleSelectors') as FormArray;
  }

  set modules(modules: ModuleType[]) {
    this._modules = modules;
  }

  get modules(): ModuleType[] {
    return this._modules.sort((a, b) => a.name.localeCompare(b.name));
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
      supervisorName: ['', [Validators.required]],
      status: ['', [Validators.required]],
      tagInput: []
    });

    this.projectService.getAllStudyPrograms().subscribe(
      res => this.studyPrograms.push(...res),
      err => console.error(err)
    );

    //Get All Modules and set the associated form control values
    this.projectService.getAllModuleTypes().subscribe(
      res => {
        this.modules.push(...res);
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

    //If the component has project as input try load it's values into the editor
    if (this.project) {
      this.clearStorage();
      this.fillInExistingProjectValues();
    } else {
      //Default value for supervisor when new project should be created
      this.projectFormControl.controls.supervisorName.setValue(this.fullname);
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
  }

  /**
   * load the state from local storage and set form control values
   */
  tryLoadState() {
    const loadedData = this.storage.get(this.STORAGE_KEY);
    if (loadedData) {
      const state = JSON.parse(loadedData);

      const modules: Array<boolean> = state.moduleSelectors;

      this.tags = state.tags;
      this.updateTagRecommendations();

      delete state.tags;
      delete state.moduleSelectors;

      this.projectFormControl.patchValue(state);
      modules.forEach(
        (value, index) => (this.moduleSelection[index].selected = value)
      );
    }
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
    /**
     * Workaround: https://stackoverflow.com/a/52814543/4567795
     * When an option from the autocompletion is selected the MatChipInputEvent
     * is somehow fired before the MatAutocompleteSelectedEvent so it is necessary
     * to check whether the panel is open
     */
    if (!this.tagAutocomplete.isOpen) {
      const value = event.value.trim();

      //If a valid value is submitted, save tag to data
      if (value) {
        const tag = new Tag();
        tag.tagName = value;
        this.addTag(tag);
      }

      //Remove input from field
      event.input.value = '';
    } else {
      this.tagAutocompleteTrigger.closePanel();
    }
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
   * Add checked modules to project data
   * @param event event emitted from checkbox change
   */
  /*toggleModule(event: MatCheckboxChange) {
    const id = event.source.id;
    this.moduleSelection.find(m => m.module.id == id).selected = event.checked;
  }*/

  /**
   * retrieves all selected modules
   * @returns array of selected moduley
   */
  private getSelectedModules(): ModuleType[] {
    return this.moduleSelection.selected;
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

    this.projectService.getModulesOfProject(this.project).subscribe(modules => {
      modules.forEach(module =>
        this.moduleSelectors.controls[module.id].setValue(true)
      );
    });

    this.projectService
      .getModulesOfProject(this.project)
      .subscribe(modules => this.moduleSelection.select(...modules));

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

    if (project.supervisorName.length === 0) {
      projectResource.supervisorName = projectResource.creatorName;
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

    const modules = this.getSelectedModules();
    this.createTags(this.tags).subscribe(tags => {
      if (this.project) {
        this.updateProject(project, modules, tags);
      } else {
        this.createProject(project, modules, tags);
      }
    });
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
    /*this.studyProgramSelection.select(studyProgram);
    this.projectService
      .getAllModuleTypesOfStudyprograms(
        this.studyProgramSelection.selected.map(sp => sp.id)
      )
      .subscribe(res => {
        this.dataSource.data = this.modules = res;
        this.dataSource._updateChangeSubscription();
      });*/
  }
}
