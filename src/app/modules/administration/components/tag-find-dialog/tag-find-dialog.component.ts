import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Organization } from '@data/schema/organization.types';
import { Project } from '@data/schema/project.types';
import { Tag } from '@data/schema/tag.types';
import { OrganizationService } from '@data/service/organization.service';
import { ProjectService } from '@data/service/project.service';
import { Observable, forkJoin, map } from 'rxjs';

export interface TagFindDialogData {
  tag: Tag;
}

export interface TagFindUsageResult {
  projects: Project[];
  organizations: Organization[];
}

@Component({
  selector: 'app-tag-find-dialog',
  templateUrl: './tag-find-dialog.component.html'
})
export class TagFindDialogComponent implements OnInit {
  findResult$: Observable<TagFindUsageResult>;
  tag: Tag;

  constructor(
    private dialogRef: MatDialogRef<TagFindDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TagFindDialogData,
    private projectService: ProjectService,
    private organizationService: OrganizationService
  ) {
    this.tag = data.tag;
  }

  ngOnInit(): void {
    const filterOrgs$ = this.organizationService.filterOrganizations(undefined, [this.data.tag.tagName], {
      size: 100
    });
    const filterProjects$ = this.projectService.filterProjects(undefined, undefined, undefined, undefined, [this.data.tag.tagName], {
      size: 100
    });
    this.findResult$ = forkJoin([filterOrgs$, filterProjects$]).pipe(
      map(([orgs, projects]) => {
        return {
          organizations: orgs.content,
          projects: projects.content
        };
      })
    );
  }
}
