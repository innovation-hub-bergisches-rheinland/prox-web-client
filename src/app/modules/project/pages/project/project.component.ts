import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Project } from '@data/schema/project.types';
import { ProjectService } from '@data/service/project.service';
import { ProjectEditorDialogComponent } from '@modules/project/components/project-editor-dialog/project-editor-dialog.component';
import { ProjectSearch } from '@modules/project/components/project-search-panel/project-search-panel.component';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit, AfterViewChecked {
  projects$: Observable<Project[]>;

  constructor(private projectService: ProjectService, private dialog: MatDialog) {}

  ngAfterViewChecked(): void {}
  ngOnInit(): void {
    this.projects$ = this.projectService.filterProjects('OFFERED');
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
  }
}
