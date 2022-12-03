import { Component } from '@angular/core';
import { ProfileService } from '@data/service/profile.service';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { faBullseye } from '@fortawesome/free-solid-svg-icons';
import { ProjectService } from '@data/service/project.service';
import { TagService } from '@data/service/tag.service';
import { NotificationService } from '@shared/modules/notifications/notification.service';
import { Title } from '@angular/platform-browser';
import { Organization } from '@data/schema/profile.types';
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
    private profileService: ProfileService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
    private notificationService: NotificationService,
    private tagService: TagService,
    private titleService: Title
  ) {
    this.organization$ = this.activatedRoute.params.pipe(
      mergeMap(p => this.profileService.getOrganization(p['id'])),
      catchError(async (err: HttpErrorResponse) => {
        if (err.status === 404) {
          await router.navigate(['404']);
        }
        throw err;
      })
    );

    this.avatar$ = this.organization$.pipe(map(o => o.logoUrl));

    this.organization$.subscribe(o => this.updateTitle(o));

    // TODO:
    this.tags$ = of([]);
    // this.tags$ = this.organization$.pipe(mergeMap(o => this.tagService.getTagsForEntity(o.id)));
    // TODO
    const projects$: Observable<Project[]> = of([]);

    this.offeredProjects$ = projects$.pipe(
      map(projects => projects.filter(p => p.status.state === 'OFFERED')),
      catchError(err => {
        this.notificationService.warning('Projekte konnten nicht geladen werden, versuchen Sie es später erneut.');
        return of([]);
      })
    );
    this.projectHistory$ = projects$.pipe(
      map(projects => projects.filter(p => p.status.state === 'COMPLETED' || p.status.state === 'RUNNING')),
      catchError(err => {
        this.notificationService.warning('Projekthistorie konnte nicht geladen werden, versuchen Sie es später erneut.');
        return of([]);
      })
    );
  }

  updateTitle(organization: Organization) {
    const newTitle = this.titleService.getTitle() + ' - ' + organization.name;
    this.titleService.setTitle(newTitle);
  }
}
