/* tslint:disable:one-line */
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatSelectChange } from '@angular/material';
import { RelevantProject } from '@prox/components/project-list/relevant.project';
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
  projects: Project[] = [];
  totalProjects: 1000;
  allStatus: string[] = [];
  selectedStatus: string;
  selectedName: string;
  hasPermission = false;

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

  getAllProjects() {
    this.projectService.getAll().subscribe(
      projects => (this.projects = projects),
      error => console.log(error),
      () => {
        this.fillStatus(this.projects);
        this.getAndSetTagArrayForProjects(this.projects);
      }
    );
  }

  statusFilter(status: string) {
    this.projectService.findByStatus(status).subscribe(
      projects => (this.projects = projects),
      error => console.log(error),
      () => {
        this.fillStatus(this.projects);
        this.getAndSetTagArrayForProjects(this.projects);
      }
    );
  }

  nameFilter(name: string) {
    if (this.selectedStatus) {
      this.projectService
        .findByStatus(this.selectedStatus)
        .subscribe(projects => this.filterProjectsByRelevance(projects, name));
    } else {
      this.projectService
        .getAll()
        .subscribe(projects => this.filterProjectsByRelevance(projects, name));
    }
  }

  filterProjectsByStatus(event: MatSelectChange) {
    const status = event.value;
    if (status) {
      this.selectedStatus = status;
      if (this.selectedName) {
        this.nameFilter(this.selectedName);
      } else {
        this.statusFilter(status);
      }
    } else {
      this.selectedStatus = null;
      if (this.selectedName) {
        this.nameFilter(this.selectedName);
      } else {
        this.getAllProjects();
      }
    }
  }

  filterProjectsByName(event: any) {
    const name = event.target.value;
    if (name) {
      this.selectedName = name;
      this.nameFilter(name);
    } else {
      this.selectedName = null;
      if (this.selectedStatus) {
        this.statusFilter(this.selectedStatus);
      } else {
        this.getAllProjects();
      }
    }
  }

  openProjectDialog(project: Project) {
    const dialog = this.dialog.open(ProjectDialogComponent, {
      autoFocus: false,
      maxHeight: '85vh',
      data: project
    });

    dialog.afterClosed().subscribe(() => {
      this.getAllProjects();
    });
  }

  private fillStatus(projects: Project[]) {
    projects.forEach(project => this.allStatus.push(project.status));
    this.allStatus = this.allStatus.filter((value, index, self) => self.indexOf(value) === index);
  }

  private async filterProjectsByRelevance(projects: Project[], name?: string) {
    let relevantProjects = [];

    for (const project of projects) {
      relevantProjects.push(new RelevantProject(project));
    }

    if (name != null && name.length > 1) {
      const words = name
        .split(' ', 50)
        .filter((value, index, self) => value != null && value.length > 1);

      this.rateSupervisorRelevance(relevantProjects, words);
      this.rateProjectNameRelevance(relevantProjects, words);

      for (const project of relevantProjects) {
        await this.rateProjectTagRelevance(project, words);
      }

      relevantProjects = relevantProjects.filter((value, index, self) => value.relevance > 0);
      relevantProjects = relevantProjects.sort((a, b) => (a.relevance < b.relevance ? 1 : -1));
    }

    this.projects = [];

    for (const project of relevantProjects) {
      this.projects.push(project.project);
    }

    this.getAndSetTagArrayForProjects(this.projects);
  }

  private rateSupervisorRelevance(projects: RelevantProject[], names: string[]) {
    for (const project of projects) {
      for (const name of names) {
        if (project.project.supervisorName.toLowerCase() === name.toLowerCase()) {
          project.relevance = project.relevance + 10;
        } else if (project.project.supervisorName.toLowerCase().includes(name.toLowerCase())) {
          project.relevance = project.relevance + 3;
        }
      }
    }
  }

  private rateProjectNameRelevance(projects: RelevantProject[], names: string[]) {
    for (const project of projects) {
      for (const name of names) {
        if (project.project.name.toLowerCase().includes(name.toLowerCase())) {
          project.relevance++;
        }
      }
    }
  }

  private async rateProjectTagRelevance(project: RelevantProject, names: string[]): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      project.project.getTags().subscribe(
        temp_tags => {
          for (const name of names) {
            for (const tag of temp_tags) {
              if (tag.tagName.toLowerCase() === name.toLowerCase()) {
                project.relevance = project.relevance + 5;
              } else if (tag.tagName.toLowerCase().includes(name.toLowerCase())) {
                project.relevance = project.relevance + 2;
              }
            }
          }
        },
        error => reject(error),
        () => resolve()
      );
    });
  }

  getAndSetTagArrayForProjects(projects: Project[]) {
    for (var _i = 0; _i < projects.length; _i++) {
      projects[_i].getAndSetTagArray().then();
    }
  }
}
