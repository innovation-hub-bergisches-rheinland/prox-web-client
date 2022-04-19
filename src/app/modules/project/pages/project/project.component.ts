import { AfterViewChecked, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';

import { KeycloakService } from 'keycloak-angular';

import { ProjectService } from '@data/service/project.service';
import { ProjectEditorDialogComponent } from '@modules/project/components/project-editor-dialog/project-editor-dialog.component';

import { TagService } from '@data/service/tag.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Project, ProjectWithAssociations, Status } from '@data/schema/project-service.types';
import { ProjectSearch } from '@modules/project/components/project-search-panel/project-search-panel.component';

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
export class ProjectComponent implements OnInit, AfterViewChecked {
  public projectsPage: Project[] = [];
  public pageIndex = 0;
  public pageSize = 10;
  public isLoggedIn = false;
  public projects: Project[] = [];
  public currentFilter?: ProjectSearch;

  @ViewChild(MatPaginator, { static: true }) private paginator: MatPaginator;

  constructor(
    private projectService: ProjectService,
    private tagService: TagService,
    private keycloakService: KeycloakService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngAfterViewChecked(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async ngOnInit() {
    if (await this.keycloakService.isLoggedIn()) {
      this.isLoggedIn = true;
    } else {
      this.isLoggedIn = false;
    }

    this.getAllProjects();
    this.route.queryParams.subscribe({
      next: (params: any) => {
        this.loadQueryParams(params);
      }
    });
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

  public changePageIndexOrSize(pageEvent: PageEvent) {
    this.pageIndex = pageEvent.pageIndex;
    this.pageSize = pageEvent.pageSize;
    this.pageProjects();
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
    this.projectsPage = this.projectsPage.map(p => {
      if (p.id === project.id) {
        return project;
      }
      return p;
    });
  }

  filterProjects(search: ProjectSearch) {
    this.projectService
      .filterProjects('withAssociations', search.status, search.specializations, search.moduleTypes, search.searchString)
      .subscribe({
        next: projects => {
          this.projects = projects;
          this.pageProjects();
          this.setQueryParams(search);
        },
        error: error => {
          console.error('project service error', error);
          this.openErrorSnackBar('Projekte konnten nicht geladen werden! Versuchen Sie es später noch mal.');
        }
      });
  }

  private setQueryParams(search: ProjectSearch) {
    const queryParams: QueryParams = {};

    if (Object.values(search).every(p => p === undefined)) {
      this.currentFilter = undefined;
    }

    if (search.status) {
      queryParams.state = search.status;
    }
    if (search.searchString) {
      queryParams.filter = search.searchString;
    }
    if (search.moduleTypes && search.moduleTypes.length > 0) {
      queryParams.moduleTypes = search.moduleTypes.join(',');
    }
    if (search.specializations && search.specializations.length > 0) {
      queryParams.specializations = search.specializations.join(',');
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge'
    });
  }

  private loadQueryParams(queryParams: QueryParams) {
    const search: ProjectSearch = {};
    if (queryParams.state) {
      search.status = queryParams.state as Status;
    }
    if (queryParams.specializations) {
      search.specializations = queryParams.specializations.split(',');
    }
    if (queryParams.moduleTypes) {
      search.moduleTypes = queryParams.moduleTypes.split(',');
    }
    if (queryParams.filter) {
      search.searchString = queryParams.filter;
    }

    if (Object.values(search).some(p => p !== undefined)) {
      this.currentFilter = search;
      this.filterProjects(search);
    }
  }

  private openErrorSnackBar(message: string) {
    this.snackBar.open(message, 'Verstanden');
  }

  private getAllProjects() {
    this.projectService.getAllProjects('withAssociations').subscribe({
      next: projects => {
        this.projects = projects;
        this.pageProjects();
      },
      error: error => {
        console.error('project service error', error);
        this.openErrorSnackBar('Projekte konnten nicht geladen werden! Versuchen Sie es später noch mal.');
      }
    });
  }

  private pageProjects() {
    this.projectsPage = this.projects.slice(this.pageIndex * this.pageSize, (this.pageIndex + 1) * this.pageSize);
  }
}
