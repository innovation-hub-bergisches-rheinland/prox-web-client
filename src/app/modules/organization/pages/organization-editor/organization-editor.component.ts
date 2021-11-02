import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PostOrganizationRequest } from '@data/schema/openapi/user-service/postOrganizationRequest';
import { OrganizationService } from '@data/service/organization.service';
import { UserService } from '@data/service/user.service';
import { ToastService } from '@modules/toast/toast.service';

type Organization = PostOrganizationRequest;

@Component({
  selector: 'organization-editor',
  templateUrl: './organization-editor.component.html',
  styleUrls: ['./organization-editor.component.scss']
})
export class OrganizationEditorComponent implements OnInit {
  organizationForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required)
  });

  get organization(): Organization {
    return {
      name: this.organizationForm.get('name').value
    };
  }

  constructor(
    private organizationService: OrganizationService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit() {}

  onSubmit() {
    this.organizationService.createOrganization(this.organization).subscribe({
      error: err => {
        console.error(err);
        this.toastService.showToast({
          message: 'Organisation konnte nicht angelegt werden',
          isError: true
        });
      },
      next: org => {
        this.toastService.showToast({
          message: 'Organisation wurde erfolgreich angelegt'
        });
        this.router.navigate(['/user', 'organizations']);
      }
    });
  }
}
