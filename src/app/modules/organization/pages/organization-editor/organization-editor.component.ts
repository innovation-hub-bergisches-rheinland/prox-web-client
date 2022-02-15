import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '@data/service/user.service';
import { ToastService } from '@modules/toast/toast.service';
import { CompanyProfileService } from '@data/service/company-profile.service';
import { forkJoin } from 'rxjs';
import { CreateOrganizationSchema } from '@data/schema/user-service.types';

@Component({
  selector: 'organization-editor',
  templateUrl: './organization-editor.component.html',
  styleUrls: ['./organization-editor.component.scss']
})
export class OrganizationEditorComponent implements OnInit {
  organizationForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required)
  });

  get organization(): CreateOrganizationSchema {
    return {
      name: this.organizationForm.get('name').value
    };
  }

  constructor(
    private userService: UserService,
    private companyService: CompanyProfileService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit() {}

  onSubmit() {
    this.userService.createOrganization(this.organization).subscribe({
      error: err => {
        console.error(err);
        this.toastService.showToast({
          message: 'Organisation konnte nicht angelegt werden',
          isError: true
        });
      },
      next: org => {
        console.log(org);
        this.toastService.showToast({
          message: 'Organisation wurde erfolgreich angelegt'
        });
      }
    });
  }
}
