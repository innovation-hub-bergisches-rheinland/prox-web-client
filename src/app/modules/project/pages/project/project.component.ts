import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';

import { KeycloakService } from 'keycloak-angular';
import { Observable, forkJoin, of, throwError } from 'rxjs';

import { ProjectService } from '@data/service/project.service';
import { ProjectEditorDialogComponent } from '@modules/project/components/project-editor-dialog/project-editor-dialog.component';

import { StatusOption } from './status-option.enum';

import { TagService } from '@data/service/tag.service';
import { MatSelectChange } from '@angular/material/select';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Tag } from '@data/schema/tag.resource';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { catchError, debounceTime, filter, skip, switchMap, takeUntil } from 'rxjs/operators';
import { ToastService } from '@modules/toast/toast.service';
import { ConfirmationDialogComponent } from '@shared/components/confirmation-dialog/confirmation-dialog.component';

interface ModuleType {
  key: string;
  name: string;
}

interface StudyProgram {
  id: string;
  key: string;
  name: string;
}

interface Project {
  id: string;
  status: 'AVAILABLE' | 'RUNNING' | 'FINISHED';
  name: string;
  shortDescription: string;
  description: string;
  requirement: string;
  supervisorName: string;
  creatorID: string;
  context: 'PROFESSOR' | 'COMPANY';
  createdAt: string;
  modifiedAt: string;
  modules: ModuleType[];
}

export interface QueryParams extends Params {
  state?: string;
  moduleTypes?: string;
  filter?: string;
  tags?: string;
}

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {
  public projectsPage: Project[] = [];
  public totalFilteredProjects = 0;
  public pageIndex = 0;
  public pageSize = 10;
  public isLoggedIn = false;

  public searchForm: FormGroup = this.formBuilder.group({
    searchString: [''],
    selectedStatusOption: [StatusOption.AVAILABLE],
    selectedModuleTypes: [],
    selectedStudyPrograms: [],
    searchTagInput: ['']
  });

  public searchTags: string[] = [];

  public statusOptions = StatusOption;

  private projects: Project[] = [];
  private filteredProjects: Project[] = [];
  public filteredTags$: Observable<Tag[]>;

  private allStudyPrograms: StudyProgram[] = [];
  private allModuleTypes: ModuleType[] = [];
  private _suitableStudyPrograms: StudyProgram[] = [];
  private _suitableModuleTypes: ModuleType[] = [];
  public isLoadingModuleTypes = true;
  public isLoadingStudyPrograms = true;

  @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>;
  @ViewChild(MatPaginator, { static: true }) private paginator: MatPaginator;

  get suitableModuleTypes(): ModuleType[] {
    return this._suitableModuleTypes.sort((a, b) => a.name.localeCompare(b.name));
  }

  get suitableStudyPrograms(): StudyProgram[] {
    return this._suitableStudyPrograms.sort((a, b) => a.name.localeCompare(b.name));
  }

  constructor(
    private projectService: ProjectService,
    private tagService: TagService,
    private keycloakService: KeycloakService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
    private toastService: ToastService,
    private formBuilder: FormBuilder
  ) {}

  async ngOnInit() {
    if (await this.keycloakService.isLoggedIn()) {
      this.isLoggedIn = true;
    } else {
      this.isLoggedIn = false;
    }

    forkJoin({
      studyPrograms: this.projectService.getAllStudyPrograms(),
      moduleTypes: this.projectService.getAllModuleTypes()
    }).subscribe({
      next: res => {
        this.allStudyPrograms = this._suitableStudyPrograms = res.studyPrograms;
        this.allModuleTypes = this._suitableModuleTypes = res.moduleTypes;
      },
      error: err => console.error(err),
      complete: () => {
        this.isLoadingStudyPrograms = false;
        this.isLoadingModuleTypes = false;
        this.loadQueryParams();
      }
    });

    this.filteredTags$ = this.searchForm.controls.searchTagInput.valueChanges.pipe(
      filter(value => (value ? value.length >= 2 : false)),
      debounceTime(200),
      switchMap(value =>
        this.tagService.findByTagName(value, false).pipe(
          catchError(error => {
            this.toastService.showToasts([
              {
                message: 'Tags konnten nicht geladen werden! Versuchen Sie es später noch mal.'
              }
            ]);
            return throwError(() => error);
          }),
          takeUntil(this.searchForm.controls.searchTagInput.valueChanges.pipe(skip(1)))
        )
      )
    );

    this.getAllProjects();
  }

  loadQueryParams() {
    this.route.queryParams.subscribe(
      (params: QueryParams) => {
        if (params.state) {
          const statusOption = params.state;
          if (statusOption) {
            this.searchForm.controls.selectedStatusOption.setValue(statusOption);
          }
        } else {
          this.searchForm.controls.selectedStatusOption.setValue(null);
        }
        if (params.moduleTypes) {
          const split: string[] = params.moduleTypes.split(',');
          this.searchForm.controls.selectedModuleTypes.setValue(this.suitableModuleTypes.filter(m => split.includes(m.key)));
        }
        if (params.filter) {
          this.searchForm.controls.searchString.setValue(params.filter);
        }
        if (params.tags) {
          const split: string[] = params.tags.split(',');
          // TODO Filter for existing tags
          this.searchTags = split;
        }
      },
      err => {
        console.error(err);
      }
    );
  }

  setQueryParams() {
    const queryParams: QueryParams = {};

    queryParams.state = (this.searchForm.controls.selectedStatusOption.value as string) ?? '';
    queryParams.filter = (this.searchForm.controls.searchString.value as string) ?? '';
    queryParams.tags = this.searchTags.join(',');

    if (this.searchForm.controls.selectedModuleTypes.value as ModuleType[]) {
      queryParams.moduleTypes = this.searchForm.controls.selectedModuleTypes.value.map(m => m.key).join(',');
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge'
    });
  }

  public filterModuleTypesByStudyProgram(event: MatSelectChange) {
    this.isLoadingModuleTypes = true;
    if (event.value && Array.isArray(event.value) && event.value.length > 0) {
      forkJoin(
        event.value.map((s: StudyProgram) => {
          return this.projectService.getAllModuleTypesOfStudyProgram(s.id);
        })
      ).subscribe(
        val => {
          /* emits a nested Array of ModuleTypes so it needs to be flatten by 1,
           * then the produced array need to be distinct for which we use a Map
           * with the id as a key and the whole ModuleType as value.
           * An alternative to it would be the following:
           * ```js
           * val.flat(1)
           *  .filter((c, i, a) => a.findIndex(e => e.id === c.id) === i)
           * ```
           */
          this._suitableModuleTypes = [...new Map(val.flat(1).map(i => [i.id, i])).values()];

          /* One step further pre-filter current projects by only displaying
           * projects which contain modules of the studyProgram by selecting all
           * options
           */
          this.searchForm.controls.selectedModuleTypes.setValue(this.suitableModuleTypes);
        },
        err => console.error(err),
        () => (this.isLoadingModuleTypes = false)
      );
    } else {
      this._suitableModuleTypes = this.allModuleTypes;
      this.isLoadingModuleTypes = false;
    }
  }

  public hasProjectCreationPermission(): boolean {
    if (this.isLoggedIn) {
      return this.keycloakService.isUserInRole('professor') || this.keycloakService.isUserInRole('company-manager');
    }
    return false;
  }

  public hasProjectPermission(project: Project): boolean {
    if (this.isLoggedIn) {
      const userId = this.keycloakService.getKeycloakInstance().subject;
      return (
        (this.keycloakService.isUserInRole('professor') || this.keycloakService.isUserInRole('company-manager')) &&
        userId === project.creatorID
      );
    }
    return false;
  }

  public filterProjects() {
    forkJoin({
      projects: this.projectService.filterProjects(
        'withModules',
        this.searchForm.controls.selectedStatusOption.value,
        this.searchForm.controls.selectedModuleTypes?.value?.map(mt => mt.key) ?? null,
        this.searchForm.controls.searchString.value
      ),
      tagCollections: this.tagService.findAllProjectIdsUsingTagsByNames(this.searchTags).pipe(catchError(err => of([])))
    }).subscribe({
      next: value => {
        this.filteredProjects = value.projects;
        if (value.tagCollections.length > 0) {
          this.filteredProjects = this.filteredProjects.filter(p => value.tagCollections.includes(p.id));
        }
      },
      error: err => console.error(err),
      complete: () => {
        // Set filtered projects and page the items
        this.totalFilteredProjects = this.filteredProjects.length;
        this.pageProjects();
        this.paginator.firstPage();
        this.setQueryParams();
      }
    });
  }

  public deleteProject(project: Project) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { title: 'Löschen', message: 'Projekt wirklich löschen?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.projectService.deleteProject(project).subscribe(
          () => {
            this.projects = this.projects.filter(p => p !== project);
            this.filterProjects();
          },
          error => console.error('project service error', error)
        );
      }
    });
  }

  public openProjectEditorDialog(project: Project) {
    const dialog = this.dialog.open(ProjectEditorDialogComponent, {
      autoFocus: false,
      maxHeight: '85vh',
      data: project
    });

    dialog.afterClosed().subscribe(() => this.getAllProjects());
  }

  public changePageIndexOrSize(pageEvent: PageEvent) {
    this.pageIndex = pageEvent.pageIndex;
    this.pageSize = pageEvent.pageSize;
    this.pageProjects();
  }

  private openErrorSnackBar(message: string) {
    this.snackBar.open(message, 'Verstanden');
  }

  private getAllProjects() {
    this.projectService.getAllProjects('withModules').subscribe({
      next: projects => {
        this.projects = projects;
        this.filterProjects();
      },
      error: error => {
        console.error('project service error', error);
        this.openErrorSnackBar('Projekte konnten nicht geladen werden! Versuchen Sie es später noch mal.');
      }
    });
  }

  private pageProjects() {
    this.projectsPage = this.filteredProjects.slice(this.pageIndex * this.pageSize, (this.pageIndex + 1) * this.pageSize);
  }

  /**
   * Remove tag from search
   * @param tag Tag to remove
   */
  removeTag(tag: string) {
    const index = this.searchTags.indexOf(tag);
    if (index >= 0) {
      this.searchTags.splice(index, 1);
    }
  }

  private addTag(tag: string) {
    if (this.searchTags.filter(t => t === tag.trim()).length === 0) {
      this.searchTags.push(tag);
    }
  }

  selectedTag(event: MatAutocompleteSelectedEvent): void {
    const selectedTag = event.option.value as Tag;
    this.addTag(selectedTag.tagName);
    this.tagInput.nativeElement.value = '';
    this.searchForm.controls.searchTagInput.setValue('', {
      emitEvent: true
    });
  }
}
