import { Component, OnInit } from '@angular/core';
import { UserService } from '@data/service/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { Organization } from '@data/schema/user-service.types';
import { Observable } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Profile, Sash } from '@modules/profile/pages/profile-page/profile-page.component';
import { faBullseye } from '@fortawesome/free-solid-svg-icons';
import { AvailableProject } from '@modules/profile/components/profile-projects-card/profile-projects-card.component';
import { AvailableJob } from '@modules/profile/components/profile-jobs-card/profile-jobs-card.component';
import { ProjectHistoryItem } from '@modules/profile/components/profile-project-history/profile-project-history-item/profile-project-history-item.component';

@Component({
  selector: 'app-organization-profile',
  templateUrl: './organization-profile.component.html',
  styleUrls: ['./organization-profile.component.scss']
})
export class OrganizationProfileComponent implements OnInit {
  organization$: Observable<Organization>;
  avatar$: Observable<string>;
  faBullseye = faBullseye;

  // TODO: Remove after demo
  dummyAvailableProjects: AvailableProject[] = [
    {
      id: '383bd84e-e9b2-4c0e-8998-047c691cb242',
      name: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      modules: ['BA', 'PP']
    },
    {
      id: '383bd84e-e9b2-4c0e-8998-047c691cb242',
      name: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      modules: ['BA', 'MA']
    },
    {
      id: '383bd84e-e9b2-4c0e-8998-047c691cb242',
      name: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      modules: ['TP', 'IP']
    },
    {
      id: '383bd84e-e9b2-4c0e-8998-047c691cb242',
      name: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      modules: ['WIP', 'MA', 'BA', 'PP']
    }
  ];
  dummyJobs: AvailableJob[] = [
    {
      id: '383bd84e-e9b2-4c0e-8998-047c691cb242',
      name: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      levels: ['Berufseinsteiger']
    },
    {
      id: '383bd84e-e9b2-4c0e-8998-047c691cb242',
      name: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      levels: ['Berufseinsteiger', 'Berufserfahrene']
    },
    {
      id: '383bd84e-e9b2-4c0e-8998-047c691cb242',
      name: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      levels: ['Berufserfahrene']
    }
  ];
  dummyHistoryItems: ProjectHistoryItem[] = [
    {
      id: '383bd84e-e9b2-4c0e-8998-047c691cb242',
      title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam commodo neque nibh, eget lacinia quam suscipit quis. In fermentum maximus mi. Proin ut scelerisque sapien. Integer mollis, elit id venenatis tincidunt, nisl mi mollis leo, in gravida justo velit consectetur purus. Proin ornare condimentum purus eu vestibulum. Curabitur lorem mauris, dapibus at enim at, sagittis gravida eros. Pellentesque magna nisi, vestibulum pulvinar mi ac, suscipit tincidunt tortor. Quisque condimentum dapibus congue. Morbi in ligula at leo sagittis sollicitudin. Mauris non est tincidunt, viverra lectus sed, vulputate lectus. Aliquam blandit feugiat velit ut pretium.',
      supervisor: 'Prof. Dr. Erika Musterfrau, Prof. Dr. Max Mustermann'
    },
    {
      id: '383bd84e-e9b2-4c0e-8998-047c691cb242',
      title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam commodo neque nibh, eget lacinia quam suscipit quis. In fermentum maximus mi. Proin ut scelerisque sapien. Integer mollis, elit id venenatis tincidunt, nisl mi mollis leo, in gravida justo velit consectetur purus. Proin ornare condimentum purus eu vestibulum. Curabitur lorem mauris, dapibus at enim at, sagittis gravida eros. Pellentesque magna nisi, vestibulum pulvinar mi ac, suscipit tincidunt tortor. Quisque condimentum dapibus congue. Morbi in ligula at leo sagittis sollicitudin. Mauris non est tincidunt, viverra lectus sed, vulputate lectus. Aliquam blandit feugiat velit ut pretium.',
      supervisor: 'Prof. Dr. Erika Musterfrau, Prof. Dr. Max Mustermann'
    },
    {
      id: '383bd84e-e9b2-4c0e-8998-047c691cb242',
      title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam commodo neque nibh, eget lacinia quam suscipit quis. In fermentum maximus mi. Proin ut scelerisque sapien. Integer mollis, elit id venenatis tincidunt, nisl mi mollis leo, in gravida justo velit consectetur purus. Proin ornare condimentum purus eu vestibulum. Curabitur lorem mauris, dapibus at enim at, sagittis gravida eros. Pellentesque magna nisi, vestibulum pulvinar mi ac, suscipit tincidunt tortor. Quisque condimentum dapibus congue. Morbi in ligula at leo sagittis sollicitudin. Mauris non est tincidunt, viverra lectus sed, vulputate lectus. Aliquam blandit feugiat velit ut pretium.',
      supervisor: 'Prof. Dr. Erika Musterfrau, Prof. Dr. Max Mustermann'
    },
    {
      id: '383bd84e-e9b2-4c0e-8998-047c691cb242',
      title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam commodo neque nibh, eget lacinia quam suscipit quis. In fermentum maximus mi. Proin ut scelerisque sapien. Integer mollis, elit id venenatis tincidunt, nisl mi mollis leo, in gravida justo velit consectetur purus. Proin ornare condimentum purus eu vestibulum. Curabitur lorem mauris, dapibus at enim at, sagittis gravida eros. Pellentesque magna nisi, vestibulum pulvinar mi ac, suscipit tincidunt tortor. Quisque condimentum dapibus congue. Morbi in ligula at leo sagittis sollicitudin. Mauris non est tincidunt, viverra lectus sed, vulputate lectus. Aliquam blandit feugiat velit ut pretium.',
      supervisor: 'Prof. Dr. Erika Musterfrau, Prof. Dr. Max Mustermann'
    }
  ];

  constructor(private userService: UserService, private activatedRoute: ActivatedRoute, private router: Router) {
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
  }

  ngOnInit(): void {}

  createSash(org: Organization): Sash {
    return {
      text: org.profile.vita,
      title: 'Beschreibung'
    };
  }

  createProfile(org: Organization): Profile {
    return {
      title: org.name,
      about: [
        {
          key: 'Anzahl Mitarbeiter',
          value: org.profile.numberOfEmployees
        }
      ]
    };
  }
}
