import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Company } from '@data/schema/openapi/company-profile-service/company';
import { CompanyProfileService } from '@data/service/company-profile.service';
import { forkJoin } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-company-profile',
  templateUrl: './company-profile.component.html',
  styleUrls: ['./company-profile.component.scss']
})
export class CompanyProfileComponent implements OnInit {
  company: Company;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private companyProfileService: CompanyProfileService
  ) {}

  async ngOnInit() {
    this.activatedRoute.params
      .pipe(
        map(route => route['id']),
        mergeMap(id => this.companyProfileService.getCompanyById(id))
      )
      .subscribe(
        res => {
          this.company = res;
          console.log(this.company);
        },
        err => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === 404) {
              this.router.navigate(['/404']);
            } else {
              console.error(err);
            }
          } else {
            console.error(err);
          }
        }
      );
  }
}
