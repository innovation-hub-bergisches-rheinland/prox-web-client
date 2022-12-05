import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Project, ProjectState } from '@data/schema/project.types';
import { ProjectService } from '@data/service/project.service';
import { ProjectEditorDialogComponent } from '@modules/project/components/project-editor-dialog/project-editor-dialog.component';
import { ProjectSearch } from '@modules/project/components/project-search-panel/project-search-panel.component';
import { Observable, map } from 'rxjs';

export interface QueryParams {
  q?: string;
  state?: ProjectState;
  moduleType?: string | string[];
  discipline?: string | string[];
}

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {
  projects$: Observable<Project[]>;
  searchValues: ProjectSearch;

  constructor(private projectService: ProjectService, private dialog: MatDialog, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.projects$ = this.projectService.filterProjects('OFFERED');
    this.route.queryParams.subscribe(params => {
      this.loadQueryParams(params);
    });
  }

  public openProjectEditorDialog(project: Project) {
    this.dialog.open(ProjectEditorDialogComponent, {
      autoFocus: false,
      maxHeight: '85vh',
      data: project
    });
  }

  deleteProject(project: Project) {
    this.projects$ = this.projects$.pipe(map(projects => projects.filter(p => p.id !== project.id)));
  }

  filter(search: ProjectSearch) {
    this.projects$ = this.projectService.filterProjects(search.status, search.disciplines, search.moduleTypes, search.txt);
    this.updateQueryParams(search);
  }

  updateQueryParams(search: ProjectSearch) {
    const queryParams: QueryParams = {
      state: search.status,
      discipline: search.disciplines,
      moduleType: search.moduleTypes,
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
      txt: params.q
    };
    Object.keys(search).forEach(key => (search[key] === undefined ? delete search[key] : {}));
    this.searchValues = search;
    this.filter(this.searchValues);
  }
}
