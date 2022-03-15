import { Component, OnInit } from '@angular/core';
import { UserService } from '@data/service/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { Organization } from '@data/schema/user-service.types';
import { Observable } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Profile, Sash } from '@modules/profile/pages/profile-page/profile-page.component';

@Component({
  selector: 'app-organization-profile',
  templateUrl: './organization-profile.component.html',
  styleUrls: ['./organization-profile.component.scss']
})
export class OrganizationProfileComponent implements OnInit {
  organization$: Observable<Organization>;

  constructor(private userService: UserService, private activatedRoute: ActivatedRoute, private router: Router) {
    this.organization$ = this.activatedRoute.params.pipe(
      mergeMap(p => this.userService.getOrganization(p['id'])),
      catchError(async (err: HttpErrorResponse) => {
        if (err.status === 404) {
          await router.navigate(['404']);
        }
        throw err;
      })
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
