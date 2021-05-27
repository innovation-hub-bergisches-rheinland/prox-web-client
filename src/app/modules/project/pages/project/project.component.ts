import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';

import { KeycloakService } from 'keycloak-angular';
import Fuse from 'fuse.js';
import { combineLatest, forkJoin, from } from 'rxjs';
import { map, switchMap, mergeMap, toArray } from 'rxjs/operators';

import { Project } from '@data/schema/project.resource';
import { ProjectService } from '@data/service/project.service';
import { ConfirmDialogComponent } from '@modules/project/components/confirm-dialog/confirm-dialog.component';
import { ProjectEditorDialogComponent } from '@modules/project/components/project-editor-dialog/project-editor-dialog.component';

import { StatusOption } from './status-option.enum';

import { promise } from 'protractor';
import { TagService } from '@data/service/tag.service';
import { StudyProgram } from '@data/schema/openapi/project-service/studyProgram';
import { ModuleType } from '@data/schema/openapi/project-service/moduleType';
import { MatSelectChange } from '@angular/material/select';
import { ActivatedRoute, Params, Router } from '@angular/router';

interface QueryParams {
  state?: string;
  moduleTypes?: string;
  filter?: string;
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

  public searchString = new FormControl('');
  public selectedStatusOption = new FormControl(StatusOption.Verfuegbar);
  public selectedModuleTypes = new FormControl();
  public selectedStudyPrograms = new FormControl();

  public StatusOption = StatusOption;
  public statusOptions = [
    StatusOption.Verfuegbar,
    StatusOption.Laufend,
    StatusOption.Abgeschlossen
  ];

  private projects: Project[] = [];
  private filteredProjects: Project[] = [];

  private allStudyPrograms: StudyProgram[] = [];
  private allModuleTypes: ModuleType[] = [];
  private _suitableStudyPrograms: StudyProgram[] = [];
  private _suitableModuleTypes: ModuleType[] = [];
  public isLoadingModuleTypes = true;
  public isLoadingStudyPrograms = true;

  @ViewChild(MatPaginator, { static: true }) private paginator: MatPaginator;

  get suitableModuleTypes(): ModuleType[] {
    return this._suitableModuleTypes.sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }

  get suitableStudyPrograms(): StudyProgram[] {
    return this._suitableStudyPrograms.sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }

  constructor(
    private projectService: ProjectService,
    private tagService: TagService,
    private keycloakService: KeycloakService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router
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
    }).subscribe(
      res => {
        this.allStudyPrograms = this._suitableStudyPrograms = res.studyPrograms;
        this.allModuleTypes = this._suitableModuleTypes = res.moduleTypes;
      },
      err => console.error(err),
      () => {
        this.isLoadingStudyPrograms = false;
        this.isLoadingModuleTypes = false;
        this.loadQueryParams();
      }
    );

    this.getAllProjects();
  }

  loadQueryParams() {
    this.route.queryParams.subscribe(
      (params: QueryParams) => {
        if (params.state) {
          const statusOption = StatusOption[params.state];
          if (statusOption) {
            this.selectedStatusOption.setValue(statusOption);
          }
        }
        if (params.moduleTypes) {
          const split: string[] = params.moduleTypes.split(',');
          this.selectedModuleTypes.setValue(
            this.suitableModuleTypes.filter(m => split.includes(m.key))
          );
        }
        if (params.filter) {
          this.searchString.setValue(params.filter);
        }
      },
      err => {
        console.error(err);
      }
    );
  }

  setQueryParams() {
    const queryParams: QueryParams = {};

    if (this.selectedStatusOption.value as string) {
      queryParams.state = this.selectedStatusOption.value;
    }

    if (this.searchString.value as string) {
      queryParams.filter = this.searchString.value;
    }

    if (this.selectedModuleTypes.value as ModuleType[]) {
      queryParams.moduleTypes = this.selectedModuleTypes.value
        .map(m => m.key)
        .join(',');
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
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
          this._suitableModuleTypes = [
            ...new Map(val.flat(1).map(i => [i.id, i])).values()
          ];

          /* One step further pre-filter current projects by only displaying
           * projects which contain modules of the studyProgram by selecting all
           * options
           */
          this.selectedModuleTypes.setValue(this.suitableModuleTypes);
          this.filterProjects();
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
      return this.keycloakService.isUserInRole('professor');
    }
    return false;
  }

  public hasProjectPermission(project: Project): boolean {
    if (this.isLoggedIn) {
      let userId = this.keycloakService.getKeycloakInstance().subject;
      return (
        this.keycloakService.isUserInRole('professor') &&
        userId === project.creatorID
      );
    }
    return false;
    //return promise(false)
  }

  public filterProjects() {
    this.setQueryParams();
    //Initialize with all projects
    let filteredProjects = this.projects;

    //Apply Status Filter
    filteredProjects = this.filterProjectsByStatus(
      filteredProjects,
      this.selectedStatusOption.value
    );

    //Apply ModuleType Filter
    filteredProjects = this.filterProjectsByModuleTypes(
      filteredProjects,
      this.selectedModuleTypes.value
    );

    //When a text is entered in the search field, do a fuzzy search
    if (this.searchString.value) {
      const fuseOptions: Fuse.IFuseOptions<Project> = {
        minMatchCharLength: this.searchString.value.length,
        threshold: 0.1,
        distance: Number.MAX_SAFE_INTEGER,
        keys: [
          {
            name: 'name',
            weight: 0.25
          },
          {
            name: 'description',
            weight: 0.05
          },
          {
            name: 'shortDescription',
            weight: 0.05
          },
          {
            name: 'requirement',
            weight: 0.2
          },
          {
            name: 'supervisorName',
            weight: 0.25
          },
          {
            name: 'tagCollection.tagName',
            weight: 0.2
          }
        ]
      };
      const fuse = new Fuse(filteredProjects, fuseOptions);
      const results = fuse.search(this.searchString.value);

      filteredProjects = results.map(result => result.item);
    }

    //Set filtered projects and page the items
    this.filteredProjects = filteredProjects;
    this.totalFilteredProjects = this.filteredProjects.length;
    this.pageProjects();
    this.paginator.firstPage();
  }

  private filterProjectsByModuleTypes(
    projects: Project[],
    moduleTypes: ModuleType[]
  ): Project[] {
    return moduleTypes && moduleTypes.length > 0
      ? projects.filter(project =>
          project.modules.some(
            m =>
              this.selectedModuleTypes.value.map(mt => mt.id).indexOf(m.id) >= 0
          )
        )
      : projects;
  }

  private filterProjectsByStatus(
    projects: Project[],
    status: string
  ): Project[] {
    return status
      ? projects.filter(project => project.status == status)
      : projects;
  }

  public deleteProject(project: Project) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
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
    if (project) {
      project.tagCollection = [];
      project.modules = [];
    }
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
    this.projectService
      .getAllProjects()
      .pipe(
        switchMap(projects =>
          combineLatest(
            projects.map(project =>
              combineLatest([
                this.tagService.getAllTagsOfProject(project.id),
                this.projectService.getModulesOfProject(project)
              ]).pipe(
                map(([tags, modules]) => {
                  project.tagCollection = tags;
                  project.modules = modules;
                  return project;
                })
              )
            )
          )
        )
      )
      .subscribe(
        projects => {
          this.projects = projects;
          this.filterProjects();
        },
        error => {
          console.error('project service error', error);
          this.openErrorSnackBar(
            'Projekte konnten nicht geladen werden! Versuchen Sie es später noch mal.'
          );
        }
      );
  }

  private pageProjects() {
    this.projectsPage = this.filteredProjects.slice(
      this.pageIndex * this.pageSize,
      (this.pageIndex + 1) * this.pageSize
    );
  }
}
