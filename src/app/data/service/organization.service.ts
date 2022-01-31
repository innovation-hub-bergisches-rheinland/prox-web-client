import { Injectable, Injector } from '@angular/core';
import { PostOrganizationRequest } from '@data/schema/openapi/user-service/postOrganizationRequest';
import { PostOrganizationResponse } from '@data/schema/openapi/user-service/postOrganizationResponse';
import { Observable } from 'rxjs';
import { OrganizationControllerService } from './openapi/user-service/organizationController.service';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {
  constructor(injector: Injector, private organizationService: OrganizationControllerService) {}

  createOrganization(organization: PostOrganizationRequest): Observable<PostOrganizationResponse> {
    return this.organizationService.postOrganization(organization);
  }
}
