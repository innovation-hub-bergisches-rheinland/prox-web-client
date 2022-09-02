import { AfterViewChecked, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';

import { KeycloakService } from 'keycloak-angular';

import { ProjectService } from '@data/service/project.service';
import { ProjectEditorDialogComponent } from '@modules/project/components/project-editor-dialog/project-editor-dialog.component';

import { TagService } from '@data/service/tag.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Project, Status } from '@data/schema/project-service.types';
import { ProjectSearch } from '@modules/project/components/project-search-panel/project-search-panel.component';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { NotificationService } from '@shared/modules/notifications/notification.service';
import { of } from 'rxjs';

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
    private keycloakService: KeycloakService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private notificationService: NotificationService
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

    this.route.queryParams
      .pipe(
        map(params => this.parseQueryParams(params)),
        tap(search => (this.currentFilter = search)),
        mergeMap(search => {
          if (search) {
            return this.projectService.filterProjects(search.status, search.specializations, search.moduleTypes, search.searchString);
          }
          return this.projectService.getAllProjects();
        }),
        catchError(err => {
          this.notificationService.error('Projekte konnten nicht geladen werden.');
          return of([]);
        })
      )
      .subscribe({
        next: projects => {
          this.projects = projects;
          this.pageProjects();
        }
      });
  }

  public hasProjectCreationPermission(): boolean {
    if (this.isLoggedIn) {
      return this.keycloakService.isUserInRole('professor') || this.keycloakService.isUserInRole('company-manager');
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
        this.onAddProject(res);
      }
    });
  }

  onAddProject(project: Project) {
    this.projects = [project, ...this.projects];
    this.pageIndex = 0;
    this.pageProjects();
  }

  onDeleteProject(project: Project) {
    this.projects = this.projects.filter(p => p.id !== project.id);
    this.projectsPage = this.projectsPage.filter(p => p.id !== project.id);
  }

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

  async setQueryParams(search: ProjectSearch) {
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

    await this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge'
    });
  }

  private parseQueryParams(queryParams: QueryParams): ProjectSearch | undefined {
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
      return search;
    }
    return {
      status: 'AVAILABLE'
    };
  }

  private pageProjects() {
    this.projectsPage = this.projects.slice(this.pageIndex * this.pageSize, (this.pageIndex + 1) * this.pageSize);
  }
}
