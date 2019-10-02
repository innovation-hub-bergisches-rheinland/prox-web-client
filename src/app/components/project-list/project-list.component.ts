import { Component, OnInit } from '@angular/core';
import { MatDialog, PageEvent } from '@angular/material';
import { ProjectService } from '../../core/services/project.service';
import { KeyCloakUser } from '../../keycloak/KeyCloakUser';
import { Project } from '../../shared/hal-resources/project.resource';
import { MatConfirmDialogComponent } from '../../shared/mat-confirm-dialog/mat-confirm-dialog.component';
import { ProjectDialogComponent } from '../project-dialog/project-dialog.component';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { forEach } from '@angular/router/src/utils/collection';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SearchService } from '@prox/core/services/search.service';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit {
  projects: Project[] = [];
  totalProjects: number = 0;
  pageIndex: number = 0;
  pageSize: number = 10;

  hasPermission = false;
  showExtendedSearch = false;

  search: string = '';
  searchChange: boolean = false;
  selectedSearchOption: string = 'Alle';
  selectedSearchStatus: string = 'Verfügbar';

  addSearchQueryForm: FormGroup;

  availableStatus = [{ name: 'Verfügbar' }, { name: 'Laufend' }, { name: 'Abgeschlossen' }];

  availableSearchOptions = [
    { name: 'Alle' },
    { name: 'Beschreibung' },
    { name: 'Betreuer' },
    { name: 'Tag' },
    { name: 'Titel' },
    { name: 'Voraussetzung' }
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
    //this.getAllProjects();
    this.getFilterProjects();

    this.addSearchQueryForm = this.formBuilder.group({
      searchQuery: ['', ''],
      searchQueryType: ['', '']
    });
    this.addSearchQueryForm.get('searchQueryType').setValue('Alle');
  }

  /*getAllProjects(pageIndex: number = this.pageIndex, pageSize: number = this.pageSize) {
    let options = {
      params: [{key: 'size', value: pageSize}, {key: 'page', value: pageIndex}]
    };

    this.projectService.getAll(options).subscribe(
      projects => {
        this.projects = projects;
        this.totalProjects = this.projectService.totalElement();
      },
      error => console.log(error)
    );
  }*/

  getFilterProjects(pageIndex: number = this.pageIndex, pageSize: number = this.pageSize) {
    let options = {
      params: [
        { key: 'size', value: pageSize },
        { key: 'page', value: pageIndex },
        {
          key: 'searchText',
          value: 'status="' + this.selectedSearchStatus + '" ' + this.search
        }
      ]
    };

    this.searchService.getAll(options).subscribe(
      ids => {
        ids.forEach(id =>
          this.projectService.get(id.id).subscribe(project => this.projects.push(project))
        );
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
          .subscribe(
            () => {},
            error => console.log(error),
            () => this.getFilterProjects() /*this.getAllProjects()*/
          );
      }
    });
  }

  openProjectEditorDialog(project: Project) {
    const dialog = this.dialog.open(ProjectDialogComponent, {
      autoFocus: false,
      maxHeight: '85vh',
      data: project
    });

    dialog.afterClosed().subscribe(() => {
      if (project === null) return;

      const i = this.projects.findIndex(p => p.id === project.id);
      if (i != -1) {
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
    if (this.addSearchQueryForm.get('searchQueryType').value != 'Alle') {
      if (this.addSearchQueryForm.get('searchQuery').value != '') {
        if (
          this.addSearchQueryForm.get('searchQueryType').value == 'Tag' ||
          this.addSearchQueryForm.get('searchQueryType').value == 'Betreuer'
        ) {
          let values = this.addSearchQueryForm
            .get('searchQuery')
            .value.replace(', ', ',')
            .replace(' ,', ',')
            .split(',');
          for (var index = 0; index < values.length; ++index)
            if (values[index].replace(' ', '') != '') {
              this.search +=
                ' ' +
                this.addSearchQueryForm.get('searchQueryType').value +
                '="' +
                values[index] +
                '"';
              this.openSnackBar('Die Suche wurde erfolgreich erweitert.');
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
    } else if (this.addSearchQueryForm.get('searchQuery').value != '') {
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
    //this.getAllProjects(pageEvent.pageIndex, pageEvent.pageSize);
    this.getFilterProjects(pageEvent.pageIndex, pageEvent.pageSize);
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, '', {
      duration: 2000
    });
  }
}
