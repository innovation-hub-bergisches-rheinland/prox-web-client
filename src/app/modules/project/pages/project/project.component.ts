import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Project } from '@data/schema/project.types';
import { ProjectService } from '@data/service/project.service';
import { ProjectEditorDialogComponent } from '@modules/project/components/project-editor-dialog/project-editor-dialog.component';
import { Observable } from 'rxjs';

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
    this.projects$ = this.projectService.getAllProjects();
  }

  public openProjectEditorDialog(project: Project) {
    this.dialog.open(ProjectEditorDialogComponent, {
      autoFocus: false,
      maxHeight: '85vh',
      data: project
    });
  }
}
