import { Component } from '@angular/core';
import { OrganizationService } from '@data/service/organization.service';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, filter, map, mergeMap, share, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { faBullseye } from '@fortawesome/free-solid-svg-icons';
import { ProjectService } from '@data/service/project.service';
import { TagService } from '@data/service/tag.service';
import { NotificationService } from '@shared/modules/notifications/notification.service';
import { Title } from '@angular/platform-browser';
import { Organization } from '@data/schema/organization.types';
import { Project } from '@data/schema/project.types';

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
    private profileService: OrganizationService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
    private notificationService: NotificationService,
    private tagService: TagService,
    private titleService: Title
  ) {
    this.organization$ = this.activatedRoute.params.pipe(
      filter(p => !!p['id']),
      mergeMap(p => this.profileService.getOrganization(p['id'])),
      catchError(async (err: HttpErrorResponse) => {
        if (err.status === 404) {
          await router.navigate(['404']);
        }
        throw err;
      }),
      tap(organization => this.updateTitle(organization))
    );

    const sharedOrganization$ = this.organization$.pipe(share());

    this.avatar$ = sharedOrganization$.pipe(map(o => o.logoUrl));

    this.tags$ = sharedOrganization$.pipe(map(org => org.tags.map(tag => tag.tagName)));
    const projects$: Observable<Project[]> = sharedOrganization$.pipe(
      tap(org => console.log(org)),
      mergeMap(org => this.projectService.findByPartner(org.id)),
      map(p => p.content),
      catchError(err => []),
      share()
    );
    this.offeredProjects$ = projects$.pipe(map(projects => projects.filter(project => project.status.state === 'OFFERED')));
    this.projectHistory$ = projects$.pipe(
      map(projects => projects.filter(project => project.status.state === 'RUNNING' || project.status.state === 'COMPLETED'))
    );
  }

  updateTitle(organization: Organization) {
    const newTitle = this.titleService.getTitle() + ' - ' + organization.name;
    this.titleService.setTitle(newTitle);
  }
}
