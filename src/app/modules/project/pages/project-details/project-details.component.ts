import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Location } from '@angular/common';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { KeycloakService } from 'keycloak-angular';

import { Tag } from '@data/schema/tag.resource';
import { Module } from '@data/schema/module.resource';
import { ProjectService } from '@data/service/project.service';
import { ProjectEditorDialogComponent } from '@modules/project/components/project-editor-dialog/project-editor-dialog.component';
import { TagService } from '@data/service/tag.service';
import { Project } from '@data/schema/project-service.types';
import { ToastService } from '@modules/toast/toast.service';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss']
})
export class ProjectDetailsComponent implements OnInit {
  project: Project;

  constructor(
    private keycloakService: KeycloakService,
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private toastService: ToastService
  ) {}

  async ngOnInit() {
    const projectId = this.route.snapshot.paramMap.get('id');
    this.projectService.getProject(projectId).subscribe({
      next: res => (this.project = res),
      error: err => {
        this.toastService.showToast({
          isError: true,
          message: 'Projekt nicht gefunden'
        });
        this.goBack();
      }
    });
  }

  goBack() {
    this.location.back();
  }

  onUpdate(project: Project) {
    this.project = project;
  }
}
