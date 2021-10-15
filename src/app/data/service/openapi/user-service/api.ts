export * from './authenticatedUserController.service';
import { AuthenticatedUserControllerService } from './authenticatedUserController.service';
export * from './organizationController.service';
import { OrganizationControllerService } from './organizationController.service';
export const APIS = [
  AuthenticatedUserControllerService,
  OrganizationControllerService
];
