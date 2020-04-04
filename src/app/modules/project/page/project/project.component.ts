import { Component, OnInit } from '@angular/core';
import { Project } from '@data/schema/project.resource';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MatSnackBar, MatDialog, PageEvent } from '@angular/material';
import { ProjectService } from '@data/service/project.service';
import { SearchService } from '@data/service/search.service';
import { ConfirmDialogComponent } from '@modules/project/page/confirm-dialog/confirm-dialog.component';
import { ProjectEditorDialogComponent } from '@modules/project/page/project-editor-dialog/project-editor-dialog.component';
import { KeycloakService } from 'keycloak-angular';
import { SearchOption } from './search-option.enum';
import { StatusOption } from './status-option.enum';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {
  public projects: Project[] = [];
  public totalProjects = 0;
  public pageIndex = 0;
  public pageSize = 10;
  public hasPermission = false;
  public showExtendedSearch = false;
  public hasSearchChanged = false;

  public searchString = new FormControl('');
  public selectedStatusOption = new FormControl(StatusOption.Verfuegbar);
  public extendedSearch: FormGroup;

  public SearchOption = SearchOption;
  public searchOptions = [
    SearchOption.Alle,
    SearchOption.Beschreibung,
    SearchOption.Betreuer,
    SearchOption.Tag,
    SearchOption.Titel,
    SearchOption.Voraussetzung
  ];

  public StatusOption = StatusOption;
  public statusOptions = [
    StatusOption.Alle,
    StatusOption.Verfuegbar,
    StatusOption.Laufend,
    StatusOption.Abgeschlossen
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

    this.getProjects();
    this.buildFormGroup();
  }

  public getProjects() {
    let searchString = this.searchString.value;
    if (this.selectedStatusOption.value !== SearchOption.Alle) {
      searchString =
        'status="' +
        this.selectedStatusOption.value +
        '" ' +
        this.searchString.value;
    }

    const options = {
      params: [
        { key: 'size', value: this.pageSize },
        { key: 'page', value: this.pageIndex },
        {
          key: 'searchText',
          value: searchString
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
    this.hasSearchChanged = false;
  }

  public deleteProject(project: Project) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Löschen', message: 'Projekt wirklich löschen?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.projectService.delete(project).subscribe(
          () => {},
          error => console.error('project service error', error),
          () => this.getProjects()
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

  public toggleShowExtendedSearch() {
    this.showExtendedSearch = !this.showExtendedSearch;
  }

  public setHasSearchChanged(value: boolean) {
    this.hasSearchChanged = value;
  }

  public addSearchOption() {
    if (
      this.extendedSearch.get('searchQueryType').value !== SearchOption.Alle
    ) {
      if (this.extendedSearch.get('searchQuery').value !== '') {
        if (
          this.extendedSearch.get('searchQueryType').value ===
            SearchOption.Tag ||
          this.extendedSearch.get('searchQueryType').value ===
            SearchOption.Betreuer
        ) {
          const values = this.extendedSearch
            .get('searchQuery')
            .value.replace(', ', ',')
            .replace(' ,', ',')
            .split(',');

          for (const value of values) {
            if (value.replace(' ', '') !== '') {
              this.searchString.setValue(
                this.searchString.value +
                  ' ' +
                  this.extendedSearch.get('searchQueryType').value +
                  '="' +
                  value +
                  '"'
              );
              this.openInfoSnackBar('Die Suche wurde erfolgreich erweitert.');
            }
          }
        } else {
          this.searchString.setValue(
            this.searchString.value +
              ' ' +
              this.extendedSearch.get('searchQueryType').value +
              '="' +
              this.extendedSearch.get('searchQuery').value +
              '"'
          );
          this.openInfoSnackBar('Die Suche wurde erfolgreich erweitert.');
        }
      }
    } else if (this.extendedSearch.get('searchQuery').value !== '') {
      this.searchString.setValue(
        this.searchString.value +
          ' ' +
          this.extendedSearch.get('searchQuery').value
      );
      this.openInfoSnackBar('Die Suche wurde erfolgreich erweitert.');
    }
    this.extendedSearch.get('searchQuery').setValue('');
    this.getProjects();
  }

  public changePageIndexOrSize(pageEvent: PageEvent) {
    this.pageIndex = pageEvent.pageIndex;
    this.pageSize = pageEvent.pageSize;
    this.getProjects();
  }

  private buildFormGroup() {
    this.extendedSearch = this.formBuilder.group({
      searchQuery: [''],
      searchQueryType: [SearchOption.Alle]
    });
  }

  private openInfoSnackBar(message: string) {
    this.snackBar.open(message, '', {
      duration: 2000
    });
  }

  private openErrorSnackBar(message: string) {
    this.snackBar.open(message, 'Verstanden');
  }
}
