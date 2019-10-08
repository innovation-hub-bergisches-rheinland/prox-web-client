import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, PageEvent } from '@angular/material';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProjectService, SearchService } from '@prox/core/services';
import { KeyCloakUser } from '@prox/keycloak/KeyCloakUser';
import { Project } from '@prox/shared/hal-resources';
import { MatConfirmDialogComponent } from '../../shared/mat-confirm-dialog/mat-confirm-dialog.component';
import { ProjectEditorDialogComponent } from '../project-editor-dialog/project-editor-dialog.component';

export enum SearchOption {
  Alle = 'Alle',
  Beschreibung = 'Beschreibung',
  Betreuer = 'Betreuer',
  Tag = 'Tag',
  Titel = 'Titel',
  Voraussetzung = 'Voraussetzung'
}

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit {
  projects: Project[] = [];
  totalProjects = 0;
  pageIndex = 0;
  pageSize = 10;

  hasPermission = false;
  showExtendedSearch = false;

  search = '';
  searchChange = false;
  lastSearch = '';

  SearchOption = SearchOption; // wichtig damit enum in template funktioniert

  selectedSearchStatus = 'Verfügbar';

  addSearchQueryForm: FormGroup;

  availableStatus = [
    { name: 'Alle' },
    { name: 'Verfügbar' },
    { name: 'Laufend' },
    { name: 'Abgeschlossen' }
  ];

  selectedSearchOption;

  availableSearchOptions: SearchOption[] = [
    SearchOption.Alle,
    SearchOption.Beschreibung,
    SearchOption.Betreuer,
    SearchOption.Tag,
    SearchOption.Titel,
    SearchOption.Voraussetzung
  ];

  constructor(
    private _snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private projectService: ProjectService,
    private searchService: SearchService,
    private user: KeyCloakUser,
    public dialog: MatDialog
  ) {
    this.user.Load().then(() => {
      this.hasPermission = user.hasRole('professor');
    });
  }

  ngOnInit() {
    this.getFilterProjects();

    this.addSearchQueryForm = this.formBuilder.group({
      searchQuery: ['', ''],
      searchQueryType: ['', '']
    });
    this.addSearchQueryForm.get('searchQueryType').setValue(SearchOption.Alle);
  }

  getFilterProjects(pageIndex: number = this.pageIndex, pageSize: number = this.pageSize) {
    let searchText = this.search;
    if (this.selectedSearchStatus !== 'Alle') {
      searchText = 'status="' + this.selectedSearchStatus + '" ' + this.search;
    }

    this.lastSearch = searchText;

    const options = {
      params: [
        { key: 'size', value: pageSize },
        { key: 'page', value: pageIndex },
        {
          key: 'searchText',
          value: searchText
        }
      ]
    };

    this.searchService.getAll(options).subscribe(
      ids => {
        this.projectService.findByIds(ids).subscribe(projects => {
          this.projects = projects;
        });
        this.totalProjects = this.searchService.totalElement();
      },
      error => console.log(error)
    );
    this.alterSearchChange(false);
  }

  deleteProject(project: Project) {
    const dialogRef = this.dialog.open(MatConfirmDialogComponent, {
      data: { title: 'Löschen', message: 'Projekt wirklich löschen?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.projectService
          .delete(project)
          .subscribe(() => {}, error => console.log(error), () => this.getFilterProjects());
      }
    });
  }

  openProjectEditorDialog(project: Project) {
    const dialog = this.dialog.open(ProjectEditorDialogComponent, {
      autoFocus: false,
      maxHeight: '85vh',
      data: project
    });

    dialog.afterClosed().subscribe(() => {
      if (project === null) {
        return;
      }

      const i = this.projects.findIndex(p => p.id === project.id);
      if (i !== -1) {
        this.projectService.get(project.id).subscribe(p => this.projects.splice(i, 1, p));
      }
    });
  }

  alterExtendedSearch() {
    this.showExtendedSearch = !this.showExtendedSearch;
  }

  alterSearchChange(value: boolean) {
    this.searchChange = value;
  }

  addSearchOption() {
    if (this.addSearchQueryForm.get('searchQueryType').value !== 'Alle') {
      if (this.addSearchQueryForm.get('searchQuery').value !== '') {
        if (
          this.addSearchQueryForm.get('searchQueryType').value === 'Tag' ||
          this.addSearchQueryForm.get('searchQueryType').value === 'Betreuer'
        ) {
          const values = this.addSearchQueryForm
            .get('searchQuery')
            .value.replace(', ', ',')
            .replace(' ,', ',')
            .split(',');
          for (let index = 0; index < values.length; ++index) {
            if (values[index].replace(' ', '') !== '') {
              this.search +=
                ' ' +
                this.addSearchQueryForm.get('searchQueryType').value +
                '="' +
                values[index] +
                '"';
              this.openSnackBar('Die Suche wurde erfolgreich erweitert.');
            }
          }
        } else {
          this.search +=
            ' ' +
            this.addSearchQueryForm.get('searchQueryType').value +
            '="' +
            this.addSearchQueryForm.get('searchQuery').value +
            '"';
          this.openSnackBar('Die Suche wurde erfolgreich erweitert.');
        }
      }
    } else if (this.addSearchQueryForm.get('searchQuery').value !== '') {
      this.search += ' ' + this.addSearchQueryForm.get('searchQuery').value;
      this.openSnackBar('Die Suche wurde erfolgreich erweitert.');
    }
    this.addSearchQueryForm.get('searchQuery').setValue('');
    this.getFilterProjects();
  }

  pageEvent(pageEvent: PageEvent) {
    this.projects = [];
    this.pageIndex = pageEvent.pageIndex;
    this.pageSize = pageEvent.pageSize;
    this.getFilterProjects(pageEvent.pageIndex, pageEvent.pageSize);
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, '', {
      duration: 2000
    });
  }
}
