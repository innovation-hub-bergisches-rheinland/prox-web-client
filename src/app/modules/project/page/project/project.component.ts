import { Component, OnInit } from '@angular/core';
import { Project } from '@data/schema/project.resource';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatSnackBar, MatDialog, PageEvent } from '@angular/material';
import { ProjectService } from '@data/service/project.service';
import { SearchService } from '@data/service/search.service';
import { MatConfirmDialogComponent } from '@modules/project/page/mat-confirm-dialog/mat-confirm-dialog.component';
import { ProjectEditorDialogComponent } from '@modules/project/page/project-editor-dialog/project-editor-dialog.component';
import { KeycloakService } from 'keycloak-angular';

export enum SearchOption {
  Alle = 'Alle',
  Beschreibung = 'Beschreibung',
  Betreuer = 'Betreuer',
  Tag = 'Tag',
  Titel = 'Titel',
  Voraussetzung = 'Voraussetzung'
}

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {
  projects: Project[] = [];
  totalProjects = 0;
  pageIndex = 0;
  pageSize = 10;

  hasPermission: boolean;
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

  selectedSearchOption: SearchOption;

  availableSearchOptions: SearchOption[] = [
    SearchOption.Alle,
    SearchOption.Beschreibung,
    SearchOption.Betreuer,
    SearchOption.Tag,
    SearchOption.Titel,
    SearchOption.Voraussetzung
  ];

  constructor(
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private projectService: ProjectService,
    private searchService: SearchService,
    private keycloakService: KeycloakService,
    public dialog: MatDialog
  ) {}

  async ngOnInit() {
    if (await this.keycloakService.isLoggedIn()) {
      this.hasPermission = this.keycloakService.isUserInRole('professor');
    } else {
      this.hasPermission = false;
    }

    this.getFilterProjects();

    this.addSearchQueryForm = this.formBuilder.group({
      searchQuery: ['', ''],
      searchQueryType: ['', '']
    });
    this.addSearchQueryForm.get('searchQueryType').setValue(SearchOption.Alle);
  }

  getFilterProjects(
    pageIndex: number = this.pageIndex,
    pageSize: number = this.pageSize
  ) {
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
        this.projectService.findByIds(ids).subscribe(
          projects => {
            this.projects = projects;
          },
          error => {
            console.error('project service error', error);
            this.openErrorSnackBar(
              'Projekte konnten nicht geladen werden! Versuchen Sie es später noch mal.'
            );
          }
        );
        this.totalProjects = this.searchService.totalElement();
      },
      error => console.error('search service error', error)
    );
    this.alterSearchChange(false);
  }

  deleteProject(project: Project) {
    const dialogRef = this.dialog.open(MatConfirmDialogComponent, {
      data: { title: 'Löschen', message: 'Projekt wirklich löschen?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.projectService.delete(project).subscribe(
          () => {},
          error => console.error('project service error', error),
          () => this.getFilterProjects()
        );
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
        this.projectService.get(project.id).subscribe(p => {
          this.projects.splice(i, 1, p);
          this.projects = this.projects;
        });
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

          for (const value of values) {
            if (value.replace(' ', '') !== '') {
              this.search +=
                ' ' +
                this.addSearchQueryForm.get('searchQueryType').value +
                '="' +
                value +
                '"';
              this.openInfoSnackBar('Die Suche wurde erfolgreich erweitert.');
            }
          }
        } else {
          this.search +=
            ' ' +
            this.addSearchQueryForm.get('searchQueryType').value +
            '="' +
            this.addSearchQueryForm.get('searchQuery').value +
            '"';
          this.openInfoSnackBar('Die Suche wurde erfolgreich erweitert.');
        }
      }
    } else if (this.addSearchQueryForm.get('searchQuery').value !== '') {
      this.search += ' ' + this.addSearchQueryForm.get('searchQuery').value;
      this.openInfoSnackBar('Die Suche wurde erfolgreich erweitert.');
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

  openInfoSnackBar(message: string) {
    this.snackBar.open(message, '', {
      duration: 2000
    });
  }

  openErrorSnackBar(message: string) {
    this.snackBar.open(message, 'Verstanden');
  }
}
