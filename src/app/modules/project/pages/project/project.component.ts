import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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
import { ModuleType, Project, ProjectWithAssociations, Specialization } from '@data/schema/project-service.types';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

export interface QueryParams extends Params {
  state?: string;
  specializations?: string;
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
  addIcon = faPlus;

  public projectsPage: Project[] = [];
  public totalFilteredProjects = 0;
  public pageIndex = 0;
  public pageSize = 10;
  public isLoggedIn = false;

  public searchForm: FormGroup = this.formBuilder.group({
    searchString: [''],
    selectedStatusOption: [StatusOption.AVAILABLE],
    selectedModuleTypes: [],
    selectedSpecializations: [],
    searchTagInput: ['']
  });

  public searchTags: string[] = [];

  public statusOptions = StatusOption;
  public filteredTags$: Observable<Tag[]>;
  public isLoadingModuleTypes = true;
  public isLoadingSpecializations = true;
  @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>;
  private projects: Project[] = [];
  private filteredProjects: Project[] = [];
  private allSpecializations: Specialization[] = [];
  private allModuleTypes: ModuleType[] = [];
  @ViewChild(MatPaginator, { static: true }) private paginator: MatPaginator;

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

  private _suitableSpecializations: Specialization[] = [];

  get suitableSpecializations(): Specialization[] {
    return this._suitableSpecializations.sort((a, b) => a.name.localeCompare(b.name));
  }

  private _suitableModuleTypes: ModuleType[] = [];

  get suitableModuleTypes(): ModuleType[] {
    return this._suitableModuleTypes.sort((a, b) => a.name.localeCompare(b.name));
  }

  async ngOnInit() {
    if (await this.keycloakService.isLoggedIn()) {
      this.isLoggedIn = true;
    } else {
      this.isLoggedIn = false;
    }

    forkJoin({
      specializations: this.projectService.getAllSpecializations(),
      moduleTypes: this.projectService.getAllModuleTypes()
    }).subscribe({
      next: res => {
        this.allSpecializations = this._suitableSpecializations = res.specializations;
        this.allModuleTypes = this._suitableModuleTypes = res.moduleTypes;
      },
      error: err => console.error(err),
      complete: () => {
        this.isLoadingSpecializations = false;
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
        if (params.specializations) {
          const split: string[] = params.specializations.split(',');
          this.searchForm.controls.selectedSpecializations.setValue(this.suitableSpecializations.filter(s => split.includes(s.key)));
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
    if (this.searchForm.controls.selectedSpecializations.value as Specialization[]) {
      queryParams.specializations = this.searchForm.controls.selectedSpecializations.value.map(s => s.key).join(',');
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge'
    });
  }

  public filterModuleTypesBySpecializations(event: MatSelectChange) {
    this.isLoadingModuleTypes = true;
    if (event.value && Array.isArray(event.value) && event.value.length > 0) {
      forkJoin(
        event.value.map((s: Specialization) => {
          return this.projectService.getModulesOfSpecializations([s.id]);
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

  public hasProjectPermission(project: ProjectWithAssociations): boolean {
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
        'withAssociations',
        this.searchForm.controls.selectedStatusOption.value,
        this.searchForm.controls.selectedSpecializations?.value?.map(sp => sp.key) ?? null,
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

  public changePageIndexOrSize(pageEvent: PageEvent) {
    this.pageIndex = pageEvent.pageIndex;
    this.pageSize = pageEvent.pageSize;
    this.pageProjects();
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

  selectedTag(event: MatAutocompleteSelectedEvent): void {
    const selectedTag = event.option.value as Tag;
    this.addTag(selectedTag.tagName);
    this.tagInput.nativeElement.value = '';
    this.searchForm.controls.searchTagInput.setValue('', {
      emitEvent: true
    });
  }

  public openProjectEditorDialog(project: Project) {
    const dialog = this.dialog.open(ProjectEditorDialogComponent, {
      autoFocus: false,
      maxHeight: '85vh',
      data: project
    });

    dialog.afterClosed().subscribe(res => {
      if (res) {
        this.onAddProject();
      }
    });
  }

  // TODO: Refactor
  onAddProject() {
    // We just load all projects again... totally needs to get refactored, as well as the other
    // event handlers for adding/removing projects.
    this.getAllProjects();
  }

  // TODO: Refactor
  onDeleteProject(project: Project) {
    this.projects = this.projects.filter(p => p.id !== project.id);
    this.filteredProjects = this.filteredProjects.filter(p => p.id !== project.id);
    this.projectsPage = this.projectsPage.filter(p => p.id !== project.id);
  }

  // TODO: Refactor
  onUpdateProject(project: Project) {
    this.projects = this.projects.map(p => {
      if (p.id === project.id) {
        return project;
      }
      return p;
    });
    this.filteredProjects = this.filteredProjects.map(p => {
      if (p.id === project.id) {
        return project;
      }
      return p;
    });
    this.projectsPage = this.projectsPage.map(p => {
      if (p.id === project.id) {
        return project;
      }
      return p;
    });
  }

  private openErrorSnackBar(message: string) {
    this.snackBar.open(message, 'Verstanden');
  }

  private getAllProjects() {
    this.projectService.getAllProjects('withAssociations').subscribe({
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

  private addTag(tag: string) {
    if (this.searchTags.filter(t => t === tag.trim()).length === 0) {
      this.searchTags.push(tag);
    }
  }
}
