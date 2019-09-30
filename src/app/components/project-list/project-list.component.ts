import { Component, OnInit } from '@angular/core';
import { MatDialog, PageEvent } from '@angular/material';
import { ProjectService } from '../../core/services/project.service';
import { KeyCloakUser } from '../../keycloak/KeyCloakUser';
import { Project } from '../../shared/hal-resources/project.resource';
import { MatConfirmDialogComponent } from '../../shared/mat-confirm-dialog/mat-confirm-dialog.component';
import { ProjectDialogComponent } from '../project-dialog/project-dialog.component';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit {
  projects: Project[];
  totalProjects: number = 0;
  pageIndex: number = 0;
  pageSize: number = 10;

  hasPermission = false;

  availableStatus = [
    { name: 'Bachelorarbeit', type: 'BA' },
    { name: 'Masterarbeit', type: 'MA' },
    { name: 'Praxisproject', type: 'PP' }
  ];

  constructor(
    private projectService: ProjectService,
    private user: KeyCloakUser,
    public dialog: MatDialog
  ) {
    this.user.Load().then(() => {
      this.hasPermission = user.hasRole('professor');
    });
  }

  ngOnInit() {
    this.getAllProjects();
  }

  getAllProjects(pageIndex: number = this.pageIndex, pageSize: number = this.pageSize) {
    let options = {
      params: [{ key: 'size', value: pageSize }, { key: 'page', value: pageIndex }]
    };

    this.projectService.getAll(options).subscribe(
      projects => {
        this.projects = projects;
        this.totalProjects = this.projectService.totalElement();
      },
      error => console.log(error)
    );
  }

  deleteProject(project: Project) {
    const dialogRef = this.dialog.open(MatConfirmDialogComponent, {
      data: { title: 'Löschen', message: 'Projekt wirklich löschen?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.projectService
          .delete(project)
          .subscribe(() => {}, error => console.log(error), () => this.getAllProjects());
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

  pageEvent(pageEvent: PageEvent) {
    this.pageIndex = pageEvent.pageIndex;
    this.pageSize = pageEvent.pageSize;
    this.getAllProjects(pageEvent.pageIndex, pageEvent.pageSize);
  }
}
