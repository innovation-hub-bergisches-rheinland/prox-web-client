import { Component } from '@angular/core';
import { UserService } from '@data/service/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { Organization } from '@data/schema/user-service.types';
import { Observable } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { faBullseye } from '@fortawesome/free-solid-svg-icons';
import { Project } from '@data/schema/project-service.types';
import { ProjectService } from '@data/service/project.service';
import { TagService } from '@data/service/tag.service';

@Component({
  selector: 'app-organization-profile',
  templateUrl: './organization-profile.component.html',
  styleUrls: ['./organization-profile.component.scss']
})
export class OrganizationProfileComponent {
  organization$: Observable<Organization>;
  avatar$: Observable<string>;
  tags$: Observable<string[]>;
  faBullseye = faBullseye;
  offeredProjects$: Observable<Project[]>;
  projectHistory$: Observable<Project[]>;

  constructor(
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
    private tagService: TagService
  ) {
    this.organization$ = this.activatedRoute.params.pipe(
      mergeMap(p => this.userService.getOrganization(p['id'])),
      catchError(async (err: HttpErrorResponse) => {
        if (err.status === 404) {
          await router.navigate(['404']);
        }
        throw err;
      }),
      tap(o => (this.avatar$ = this.userService.getOrganizationAvatar(o.id)))
    );

    this.tags$ = this.organization$.pipe(mergeMap(o => this.tagService.getTagsForEntity(o.id)));
    const projects$ = this.organization$.pipe(mergeMap(org => projectService.findProjectsOfOrganization(org.id)));

    this.offeredProjects$ = projects$.pipe(
      map(projects => projects.filter(p => p.status === 'AVAILABLE')),
      catchError(err => [])
    );
    this.projectHistory$ = projects$.pipe(
      map(projects => projects.filter(p => p.status !== 'AVAILABLE')),
      catchError(err => [])
    );
  }
}
