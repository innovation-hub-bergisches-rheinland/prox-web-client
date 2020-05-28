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
  MatChipInputEvent,
  MatChipSelectionChange,
  MatSnackBar
} from '@angular/material';

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

import { StudyCourseModuleSelectionModel } from '../study-course-module-selection/study-course-module-selection.component';

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

  autoSave: Subscription;
  userID: string;
  fullname: string;

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
      description: ['', [Validators.required]],
      supervisorName: ['', [Validators.required]],
      status: ['', [Validators.required]],
      studyCoursesModuleSelectors: this.formBuilder.array([]),
      tagInput: []
    });

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

    this.addStudyCourseModuleSelector();

    if (this.project) {
      this.clearStorage();
      this.fillInExistingProjectValues();
    } else {
      this.tryLoadState();
      this.enableAutosave();
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

      const modules = state.studyCoursesModuleSelectors;

      this.tags = state.tags;
      this.updateTagRecommendations();

      delete state.tags;
      delete state.studyCoursesModuleSelectors;

      this.projectFormControl.patchValue(state);

      const createStudyCourse = (data: any): StudyCourse => {
        const studyCourse = new StudyCourse();
        studyCourse.id = data.id;
        studyCourse.name = data.name;
        studyCourse.academicDegree = data.academicDegree;
        studyCourse._links = data._links;
        return studyCourse;
      };

      const createModuleModel = (data: any): Module => {
        const mod = new Module();
        mod.id = data.id;
        mod.name = data.name;
        mod.projectType = data.projectType;
        mod._links = data._links;
        return mod;
      };

      const createModuleSelectorModel = (
        data: any
      ): StudyCourseModuleSelectionModel => {
        const selectedModules: Module[] = [];
        for (const selectedModule of data.selectedModules) {
          selectedModules.push(createModuleModel(selectedModule));
        }
        return new StudyCourseModuleSelectionModel(
          createStudyCourse(data.studyCourse),
          selectedModules
        );
      };

      if (modules[0] != null) {
        if (modules.length >= 1) {
          this.moduleSelectors.controls[0].setValue(
            createModuleSelectorModel(modules[0])
          );
        }

        for (let index = 1; index < modules.length; index++) {
          this.addStudyCourseModuleSelector();
          this.moduleSelectors.controls[index].setValue(
            createModuleSelectorModel(modules[index])
          );
        }
      }
    }
  }

  clearStorage() {
    this.storage.remove(this.STORAGE_KEY);
  }

  get moduleSelectors(): FormArray {
    return this.projectFormControl.get(
      'studyCoursesModuleSelectors'
    ) as FormArray;
  }

  addStudyCourseModuleSelector() {
    this.moduleSelectors.push(new FormControl());
  }

  removeStudyCourseModuleSelector(index: number) {
    this.moduleSelectors.removeAt(index);
    if (this.moduleSelectors.length < 1) {
      this.addStudyCourseModuleSelector();
    }
  }

  addTag(event: MatChipInputEvent) {
    if (!this.tagAutocomplete.isOpen) {
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
    if (event.option.value instanceof Tag) {
      this.tags.push(event.option.value);
      this.updateTagRecommendations();
    }
    this.tagInput.nativeElement.value = '';
    this.projectFormControl.controls.tagInput.setValue(null);
  }

  private getAggregatedSelectedModules() {
    return _.chain(this.moduleSelectors.getRawValue())
      .pluck('selectedModules')
      .flatten()
      .uniq(x => x.id)
      .value();
  }

  private prepareStudyCourseSelectorData(
    modules: Module[]
  ): Observable<StudyCourseModuleSelectionModel[]> {
    return Observable.create(
      (observer: Observer<StudyCourseModuleSelectionModel[]>) => {
        const observables = [];

        for (const module of modules) {
          observables.push(
            module.getRelation(StudyCourse, 'studyCourse').pipe(
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
  }

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

    this.project.getModules().subscribe(modules =>
      this.prepareStudyCourseSelectorData(modules).subscribe(success => {
        if (success.length >= 1) {
          this.moduleSelectors.controls[0].setValue(success[0]);
        }
        for (let index = 1; index < success.length; index++) {
          this.addStudyCourseModuleSelector();
          this.moduleSelectors.controls[index].setValue(success[index]);
        }
      })
    );

    this.project.getTags().subscribe(tags => {
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
        return this.tagService.create(x.tag);
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
    projectResource.creatorName = this.fullname;

    projectResource.shortDescription = project.shortDescription;
    projectResource.requirement = project.requirement;
    projectResource.description = project.description;
    projectResource.name = project.name;
    projectResource.status = project.status;

    if (project.supervisorName.length === 0) {
      projectResource.supervisorName = projectResource.creatorName;
    } else {
      projectResource.supervisorName = project.supervisorName;
    }

    return projectResource;
  }

  private createProject(project: Project, modules: Module[], tags: Tag[]) {
    const newProject = this.createProjectResource(project);

    // Create Project
    this.projectService.create(newProject).subscribe(
      () => {
        newProject.setTags(tags).subscribe();
        newProject.setModules(modules).subscribe(
          () => {
            this.showSubmitInfo('Projekt wurde erfolgreich erstellt');
            this.clearStorage();
            this.projectSaved.emit(newProject);
          },
          error => {
            this.showSubmitInfo('Fehler beim Verknüpfen der Module');
            console.error('project service error', error);
          }
        );
      },
      error => {
        this.showSubmitInfo('Fehler beim Bearbeiten der Anfrage');
        this.hasSubmitted = false;
        console.error('project service error', error);
      }
    );
  }

  private updateProject(project: Project, modules: Module[], tags: Tag[]) {
    this.project = this.createProjectResource(project);

    // Update Project
    this.projectService.update(this.project).subscribe(
      () => {
        this.project.setTags(tags).subscribe();
        this.project.setModules(modules).subscribe(
          () => {
            this.showSubmitInfo('Projekt wurde erfolgreich bearbeitet');
            this.projectSaved.emit(this.project);
          },
          error => {
            this.showSubmitInfo('Fehler beim Verknüpfen der Module');
            console.error('project service error', error);
          }
        );
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

    const modules = this.getAggregatedSelectedModules();
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
