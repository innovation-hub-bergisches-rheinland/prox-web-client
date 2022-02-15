export type OrganizationId = string;
export type UserId = string;

export type OrganizationRole = 'MEMBER' | 'ADMIN';

export interface UserSearchResult {
  id: UserId;
  name: string;
}

export interface Organization {
  id: OrganizationId;
  name: string;
}

export interface OrganizationMembership {
  member: string;
  role: OrganizationRole;
}

export interface GetOrganizationsWrapper {
  organizations: Organization[];
}

export type CreateOrganizationSchema = Omit<Organization, 'id'>;
