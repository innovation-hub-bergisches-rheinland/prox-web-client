import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Project, ProjectList, ProjectState } from '@data/schema/project.types';
import { PageRequest } from '@data/schema/shared.types';
import { ProjectService } from '@data/service/project.service';
import { ProjectEditorDialogComponent } from '@modules/project/components/project-editor-dialog/project-editor-dialog.component';
import { ProjectSearch } from '@modules/project/components/project-search-panel/project-search-panel.component';
import { KeycloakService } from 'keycloak-angular';
import { Observable, map } from 'rxjs';

export interface QueryParams {
  q?: string;
  state?: ProjectState;
  moduleType?: string | string[];
  discipline?: string | string[];
  tags?: string | string[];
}

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {
  activeProjectPage$: Observable<ProjectList>;
  searchValues: ProjectSearch;
  canCreateProject = false;

  constructor(
    private projectService: ProjectService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private keycloakService: KeycloakService
  ) {}

  async ngOnInit() {
    this.activeProjectPage$ = this.projectService.filterProjects('OFFERED');
    this.route.queryParams.subscribe(params => {
      this.loadQueryParams(params);
    });
    this.canCreateProject = await this.keycloakService.isLoggedIn();
  }

  public createNewProject() {
    this.dialog.open(ProjectEditorDialogComponent, {
      autoFocus: false,
      maxHeight: '85vh',
      data: null
    });
  }

  deleteProject(project: Project) {
    this.activeProjectPage$ = this.activeProjectPage$.pipe(
      map(projects => {
        return {
          ...projects,
          content: projects.content.filter(p => p.id !== project.id)
        };
      })
    );
  }

  filter(search: ProjectSearch, page: PageRequest = undefined) {
    this.activeProjectPage$ = this.projectService.filterProjects(
      search.status,
      search.disciplines,
      search.moduleTypes,
      search.txt,
      search.tags,
      page
    );
    this.updateQueryParams(search);
  }

  updateQueryParams(search: ProjectSearch) {
    const queryParams: QueryParams = {
      state: search.status,
      discipline: search.disciplines,
      moduleType: search.moduleTypes,
      tags: search.tags,
      q: search.txt
    };
    Object.keys(queryParams).forEach(key => (queryParams[key] === undefined ? delete queryParams[key] : {}));
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      queryParamsHandling: 'merge'
    });
  }

  loadQueryParams(params: QueryParams) {
    // TODO: This can't be right. There must be a better way to do this.
    const search: ProjectSearch = {
      status: params.state,
      disciplines: Array.isArray(params.discipline) ? params.discipline : params.discipline === undefined ? undefined : [params.discipline],
      moduleTypes: Array.isArray(params.moduleType) ? params.moduleType : params.moduleType === undefined ? undefined : [params.moduleType],
      tags: Array.isArray(params.tags) ? params.tags : params.tags === undefined ? undefined : [params.tags],
      txt: params.q
    };
    Object.keys(search).forEach(key => (search[key] === undefined ? delete search[key] : {}));
    this.searchValues = search;
    this.filter(this.searchValues);
  }

  handlePageEvent(event: PageEvent) {
    this.filter(this.searchValues, {
      page: event.pageIndex,
      size: event.pageSize
    });
  }
}
